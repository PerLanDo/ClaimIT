const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for avatar uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      studentId: user.student_id,
      department: user.department,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar_url,
      points: user.points,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/', authenticateToken, upload.single('avatar'), [
  body('fullName').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Full name must be 1-255 characters'),
  body('studentId').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Student ID must be 1-50 characters'),
  body('department').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Department must be 1-255 characters'),
  body('phone').optional().trim().isMobilePhone().withMessage('Valid phone number required'),
  body('address').optional().trim().isLength({ max: 500 }).withMessage('Address must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, studentId, department, phone, address } = req.body;
    const updates = {};

    // Build updates object
    if (fullName) updates.full_name = fullName;
    if (studentId) updates.student_id = studentId;
    if (department) updates.department = department;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    // Handle avatar upload
    if (req.file) {
      // TODO: Implement actual image upload to Backblaze B2
      // For now, we'll store a placeholder URL
      updates.avatar_url = `placeholder_avatar_url_${req.file.originalname}`;
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('*')
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        fullName: updatedUser.full_name,
        studentId: updatedUser.student_id,
        department: updatedUser.department,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar_url,
        points: updatedUser.points,
        updatedAt: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's items statistics
    const { data: itemsStats, error: itemsError } = await supabase
      .from('items')
      .select('status, date_lost, date_found')
      .eq('poster_id', userId);

    if (itemsError) {
      console.error('Get items statistics error:', itemsError);
      return res.status(500).json({ error: 'Failed to fetch items statistics' });
    }

    // Get user's claims statistics
    const { data: claimsStats, error: claimsError } = await supabase
      .from('claims')
      .select('status')
      .eq('claimant_id', userId);

    if (claimsError) {
      console.error('Get claims statistics error:', claimsError);
      return res.status(500).json({ error: 'Failed to fetch claims statistics' });
    }

    // Process statistics
    const items = itemsStats || [];
    const claims = claimsStats || [];

    const statistics = {
      items: {
        total: items.length,
        lost: items.filter(item => item.date_lost).length,
        found: items.filter(item => item.date_found).length,
        active: items.filter(item => item.status === 'active').length,
        claimed: items.filter(item => item.status === 'claimed').length,
        archived: items.filter(item => item.status === 'archived').length
      },
      claims: {
        total: claims.length,
        pending: claims.filter(claim => claim.status === 'pending').length,
        approved: claims.filter(claim => claim.status === 'approved').length,
        rejected: claims.filter(claim => claim.status === 'rejected').length
      },
      points: req.user.points || 0
    };

    res.json(statistics);

  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's items
router.get('/items', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const { data: items, error, count } = await supabase
      .from('items')
      .select(`
        *,
        categories(name, icon)
      `, { count: 'exact' })
      .eq('poster_id', req.user.id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Get user items error:', error);
      return res.status(500).json({ error: 'Failed to fetch user items' });
    }

    res.json({
      items: items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's claims
router.get('/claims', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const { data: claims, error, count } = await supabase
      .from('claims')
      .select(`
        *,
        item:items!claims_item_id_fkey(
          id, title, description, location, image_urls,
          categories(name, icon),
          poster:users!items_poster_id_fkey(id, full_name, role)
        )
      `, { count: 'exact' })
      .eq('claimant_id', req.user.id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Get user claims error:', error);
      return res.status(500).json({ error: 'Failed to fetch user claims' });
    }

    res.json({
      claims: claims || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get user claims error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const { data: notifications, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Get notifications error:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }

    res.json({
      notifications: notifications || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Mark notification as read error:', error);
      return res.status(500).json({ error: 'Failed to mark notification as read' });
    }

    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read
router.put('/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Mark all notifications as read error:', error);
      return res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }

    res.json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread notification count
router.get('/notifications/unread-count', authenticateToken, async (req, res) => {
  try {
    const { data: unreadNotifications, error } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Get unread notification count error:', error);
      return res.status(500).json({ error: 'Failed to get unread notification count' });
    }

    res.json({ unreadCount: unreadNotifications.length });

  } catch (error) {
    console.error('Get unread notification count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
