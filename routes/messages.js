const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { supabase } = require('../config/database');
const { authenticateToken, requireStudentOrStaff } = require('../middleware/auth');

const router = express.Router();

// Get conversations for current user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { data: conversations, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        receiver_id,
        item_id,
        claim_id,
        content,
        is_read,
        created_at,
        sender:users!messages_sender_id_fkey(id, full_name, role, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, full_name, role, avatar_url),
        item:items!messages_item_id_fkey(id, title, image_urls),
        claim:claims!messages_claim_id_fkey(id, status)
      `)
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get conversations error:', error);
      return res.status(500).json({ error: 'Failed to fetch conversations' });
    }

    // Group messages by conversation (item_id or claim_id)
    const conversationMap = new Map();

    conversations.forEach(message => {
      const conversationKey = message.item_id || message.claim_id || 'direct';
      const otherUserId = message.sender_id === req.user.id ? message.receiver_id : message.sender_id;
      const otherUser = message.sender_id === req.user.id ? message.receiver : message.sender;

      if (!conversationMap.has(conversationKey)) {
        conversationMap.set(conversationKey, {
          id: conversationKey,
          type: message.item_id ? 'item' : message.claim_id ? 'claim' : 'direct',
          item: message.item,
          claim: message.claim,
          otherUser: {
            id: otherUserId,
            name: otherUser.full_name,
            role: otherUser.role,
            avatar: otherUser.avatar_url
          },
          lastMessage: message,
          unreadCount: 0,
          messages: []
        });
      }

      const conversation = conversationMap.get(conversationKey);
      conversation.messages.push(message);
      
      if (!message.is_read && message.receiver_id === req.user.id) {
        conversation.unreadCount++;
      }

      // Update last message if this is more recent
      if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
        conversation.lastMessage = message;
      }
    });

    // Convert to array and sort by last message time
    const conversationList = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));

    res.json(conversationList);

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages for a specific conversation
router.get('/conversation/:id', authenticateToken, [
  query('type').isIn(['item', 'claim', 'direct']).withMessage('Valid conversation type required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { type, page = 1, limit = 50 } = req.query;

    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, role, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, full_name, role, avatar_url)
      `)
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    // Filter by conversation type
    if (type === 'item') {
      query = query.eq('item_id', id);
    } else if (type === 'claim') {
      query = query.eq('claim_id', id);
    } else if (type === 'direct') {
      query = query.eq('receiver_id', id).eq('item_id', null).eq('claim_id', null);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: messages, error, count } = await query;

    if (error) {
      console.error('Get messages error:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    // Mark messages as read
    const unreadMessageIds = messages
      .filter(msg => !msg.is_read && msg.receiver_id === req.user.id)
      .map(msg => msg.id);

    if (unreadMessageIds.length > 0) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', unreadMessageIds);
    }

    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send new message
router.post('/', authenticateToken, requireStudentOrStaff, [
  body('receiverId').isUUID().withMessage('Valid receiver ID is required'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message content is required'),
  body('itemId').optional().isUUID().withMessage('Valid item ID required'),
  body('claimId').optional().isUUID().withMessage('Valid claim ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, content, itemId, claimId } = req.body;

    // Validate that receiver exists
    const { data: receiver, error: receiverError } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('id', receiverId)
      .single();

    if (receiverError || !receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Validate item or claim if provided
    if (itemId) {
      const { data: item, error: itemError } = await supabase
        .from('items')
        .select('id, title')
        .eq('id', itemId)
        .single();

      if (itemError || !item) {
        return res.status(404).json({ error: 'Item not found' });
      }
    }

    if (claimId) {
      const { data: claim, error: claimError } = await supabase
        .from('claims')
        .select('id, status')
        .eq('id', claimId)
        .single();

      if (claimError || !claim) {
        return res.status(404).json({ error: 'Claim not found' });
      }
    }

    // Create message
    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: req.user.id,
        receiver_id: receiverId,
        item_id: itemId || null,
        claim_id: claimId || null,
        content: content.trim()
      }])
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, role, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, full_name, role, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Send message error:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    // Create notification for receiver
    await supabase
      .from('notifications')
      .insert([{
        user_id: receiverId,
        title: 'New Message',
        message: `You have a new message from ${req.user.full_name}`,
        type: 'new_message',
        data: { 
          messageId: newMessage.id, 
          senderId: req.user.id,
          itemId,
          claimId
        }
      }]);

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark conversation as read
router.put('/conversation/:id/read', authenticateToken, [
  query('type').isIn(['item', 'claim', 'direct']).withMessage('Valid conversation type required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { type } = req.query;

    let query = supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', req.user.id)
      .eq('is_read', false);

    // Filter by conversation type
    if (type === 'item') {
      query = query.eq('item_id', id);
    } else if (type === 'claim') {
      query = query.eq('claim_id', id);
    } else if (type === 'direct') {
      query = query.eq('sender_id', id).eq('item_id', null).eq('claim_id', null);
    }

    const { error } = await query;

    if (error) {
      console.error('Mark messages as read error:', error);
      return res.status(500).json({ error: 'Failed to mark messages as read' });
    }

    res.json({ message: 'Messages marked as read' });

  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const { data: unreadMessages, error } = await supabase
      .from('messages')
      .select('id')
      .eq('receiver_id', req.user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Get unread count error:', error);
      return res.status(500).json({ error: 'Failed to get unread count' });
    }

    res.json({ unreadCount: unreadMessages.length });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
