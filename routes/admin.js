const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { supabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get admin dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get various statistics
    const [
      itemsStats,
      claimsStats,
      usersStats,
      recentActivity
    ] = await Promise.all([
      // Items statistics
      supabase
        .from('items')
        .select('status, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()), // Last 30 days
      
      // Claims statistics
      supabase
        .from('claims')
        .select('status, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()), // Last 30 days
      
      // Users statistics
      supabase
        .from('users')
        .select('role, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()), // Last 30 days
      
      // Recent activity (latest items and claims)
      supabase
        .from('items')
        .select(`
          id, title, status, created_at,
          poster:users!items_poster_id_fkey(full_name, role),
          categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    // Process items statistics
    const itemsData = itemsStats.data || [];
    const itemsStatistics = {
      total: itemsData.length,
      active: itemsData.filter(item => item.status === 'active').length,
      claimed: itemsData.filter(item => item.status === 'claimed').length,
      archived: itemsData.filter(item => item.status === 'archived').length
    };

    // Process claims statistics
    const claimsData = claimsStats.data || [];
    const claimsStatistics = {
      total: claimsData.length,
      pending: claimsData.filter(claim => claim.status === 'pending').length,
      approved: claimsData.filter(claim => claim.status === 'approved').length,
      rejected: claimsData.filter(claim => claim.status === 'rejected').length
    };

    // Process users statistics
    const usersData = usersStats.data || [];
    const usersStatistics = {
      total: usersData.length,
      students: usersData.filter(user => user.role === 'student').length,
      staff: usersData.filter(user => user.role === 'staff').length,
      teachers: usersData.filter(user => user.role === 'teacher').length,
      admins: usersData.filter(user => user.role === 'admin').length
    };

    // Get category breakdown
    const { data: categoryStats } = await supabase
      .from('items')
      .select(`
        categories(name),
        status
      `)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const categoryBreakdown = {};
    (categoryStats || []).forEach(item => {
      const categoryName = item.categories?.name || 'Unknown';
      if (!categoryBreakdown[categoryName]) {
        categoryBreakdown[categoryName] = {
          total: 0,
          active: 0,
          claimed: 0,
          archived: 0
        };
      }
      categoryBreakdown[categoryName].total++;
      categoryBreakdown[categoryName][item.status]++;
    });

    res.json({
      items: itemsStatistics,
      claims: claimsStatistics,
      users: usersStatistics,
      categories: categoryBreakdown,
      recentActivity: recentActivity.data || []
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (with pagination and filters)
router.get('/users', authenticateToken, requireAdmin, [
  query('role').optional().isIn(['student', 'staff', 'teacher', 'admin']),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      role,
      search,
      page = 1,
      limit = 20
    } = req.query;

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Get users error:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role
router.put('/users/:id/role', authenticateToken, requireAdmin, [
  body('role').isIn(['student', 'staff', 'teacher', 'admin']).withMessage('Valid role is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { role } = req.body;

    // Prevent admin from changing their own role
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id, email, full_name, role')
      .single();

    if (error) {
      console.error('Update user role error:', error);
      return res.status(500).json({ error: 'Failed to update user role' });
    }

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all items with admin controls
router.get('/items', authenticateToken, requireAdmin, [
  query('status').optional().isIn(['active', 'claimed', 'archived']),
  query('category').optional().isUUID(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      category,
      search,
      page = 1,
      limit = 20
    } = req.query;

    let query = supabase
      .from('items')
      .select(`
        *,
        categories(name, icon),
        poster:users!items_poster_id_fkey(id, full_name, role, email),
        claimed_by_user:users!items_claimed_by_fkey(id, full_name, role, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: items, error, count } = await query;

    if (error) {
      console.error('Get admin items error:', error);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get admin items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item status (admin only)
router.put('/items/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['active', 'claimed', 'archived']).withMessage('Valid status is required'),
  body('adminNotes').optional().trim().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const { data: updatedItem, error } = await supabase
      .from('items')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        categories(name, icon),
        poster:users!items_poster_id_fkey(id, full_name, role)
      `)
      .single();

    if (error) {
      console.error('Update item status error:', error);
      return res.status(500).json({ error: 'Failed to update item status' });
    }

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Create notification for item poster if status changed
    if (status === 'archived') {
      await supabase
        .from('notifications')
        .insert([{
          user_id: updatedItem.poster_id,
          title: 'Item Archived',
          message: `Your item "${updatedItem.title}" has been archived by admin`,
          type: 'item_archived',
          data: { itemId: id, adminNotes }
        }]);
    }

    res.json({
      message: 'Item status updated successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Update item status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item (admin only)
router.delete('/items/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Get item details before deletion for notification
    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('title, poster_id')
      .eq('id', id)
      .single();

    if (fetchError || !item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete item error:', error);
      return res.status(500).json({ error: 'Failed to delete item' });
    }

    // Create notification for item poster
    await supabase
      .from('notifications')
      .insert([{
        user_id: item.poster_id,
        title: 'Item Deleted',
        message: `Your item "${item.title}" has been deleted by admin`,
        type: 'item_deleted',
        data: { itemId: id }
      }]);

    res.json({ message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all notifications (admin view)
router.get('/notifications', authenticateToken, requireAdmin, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 50 } = req.query;

    const { data: notifications, error, count } = await supabase
      .from('notifications')
      .select(`
        *,
        user:users!notifications_user_id_fkey(id, full_name, role, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Get notifications error:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }

    res.json({
      notifications,
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

module.exports = router;
