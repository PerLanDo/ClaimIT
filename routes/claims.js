const express = require('express');
const multer = require('multer');
const { body, validationResult, query } = require('express-validator');
const { supabase } = require('../config/database');
const { authenticateToken, requireAdmin, requireStudentOrStaff } = require('../middleware/auth');

const router = express.Router();

// Configure multer for proof image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all claims (for admins) or user's own claims
router.get('/', authenticateToken, [
  query('status').optional().isIn(['pending', 'approved', 'rejected']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      page = 1,
      limit = 20
    } = req.query;

    let query = supabase
      .from('claims')
      .select(`
        *,
        item:items!claims_item_id_fkey(
          id, title, description, location, image_urls,
          categories(name, icon),
          poster:users!items_poster_id_fkey(id, full_name, role)
        ),
        claimant:users!claims_claimant_id_fkey(id, full_name, email, role),
        reviewer:users!claims_reviewed_by_fkey(id, full_name, role)
      `)
      .order('created_at', { ascending: false });

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Non-admin users can only see their own claims
    if (req.user.role !== 'admin') {
      query = query.eq('claimant_id', req.user.id);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: claims, error, count } = await query;

    if (error) {
      console.error('Get claims error:', error);
      return res.status(500).json({ error: 'Failed to fetch claims' });
    }

    res.json({
      claims,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get claims error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single claim by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: claim, error } = await supabase
      .from('claims')
      .select(`
        *,
        item:items!claims_item_id_fkey(
          id, title, description, location, image_urls, qr_code,
          categories(name, icon, description),
          poster:users!items_poster_id_fkey(id, full_name, role, department)
        ),
        claimant:users!claims_claimant_id_fkey(id, full_name, email, role, student_id),
        reviewer:users!claims_reviewed_by_fkey(id, full_name, role)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Check permissions - user can see their own claims or admins can see all
    if (claim.claimant_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    res.json(claim);

  } catch (error) {
    console.error('Get claim error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new claim
router.post('/', authenticateToken, requireStudentOrStaff, upload.single('proofImage'), [
  body('itemId').isUUID().withMessage('Valid item ID is required'),
  body('proofDescription').trim().isLength({ min: 1 }).withMessage('Proof description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId, proofDescription } = req.body;

    // Check if item exists and is claimable
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('id, status, poster_id')
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.status !== 'active') {
      return res.status(400).json({ error: 'Item is not available for claiming' });
    }

    // Check if user is not the poster
    if (item.poster_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot claim your own item' });
    }

    // Check if user already has a pending or approved claim for this item
    const { data: existingClaim, error: claimError } = await supabase
      .from('claims')
      .select('id, status')
      .eq('item_id', itemId)
      .eq('claimant_id', req.user.id)
      .single();

    if (claimError && claimError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Check existing claim error:', claimError);
      return res.status(500).json({ error: 'Failed to check existing claims' });
    }

    if (existingClaim && existingClaim.status !== 'rejected') {
      return res.status(400).json({ 
        error: 'You already have a claim for this item',
        existingClaimStatus: existingClaim.status
      });
    }

    // Upload proof image (placeholder - implement with Backblaze B2)
    let proofImageUrl = null;
    if (req.file) {
      // TODO: Implement actual image upload to Backblaze B2
      proofImageUrl = `placeholder_proof_url_${req.file.originalname}`;
    }

    // Create claim
    const { data: newClaim, error } = await supabase
      .from('claims')
      .insert([{
        item_id: itemId,
        claimant_id: req.user.id,
        proof_description: proofDescription,
        proof_image_url: proofImageUrl,
        status: 'pending'
      }])
      .select(`
        *,
        item:items!claims_item_id_fkey(
          id, title, description, location, image_urls,
          categories(name, icon),
          poster:users!items_poster_id_fkey(id, full_name, role)
        ),
        claimant:users!claims_claimant_id_fkey(id, full_name, email, role)
      `)
      .single();

    if (error) {
      console.error('Create claim error:', error);
      return res.status(500).json({ error: 'Failed to create claim' });
    }

    // Create notification for item poster
    await supabase
      .from('notifications')
      .insert([{
        user_id: item.poster_id,
        title: 'New Claim on Your Item',
        message: `Someone has claimed your item "${item.title}"`,
        type: 'item_claimed',
        data: { itemId, claimId: newClaim.id }
      }]);

    // Create notification for admins
    const { data: admins } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin');

    if (admins && admins.length > 0) {
      const adminNotifications = admins.map(admin => ({
        user_id: admin.id,
        title: 'New Claim to Review',
        message: `A new claim has been submitted for item "${item.title}"`,
        type: 'claim_submitted',
        data: { itemId, claimId: newClaim.id, claimantId: req.user.id }
      }));

      await supabase
        .from('notifications')
        .insert(adminNotifications);
    }

    res.status(201).json({
      message: 'Claim submitted successfully',
      claim: newClaim
    });

  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update claim status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('adminNotes').optional().trim().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Get current claim
    const { data: claim, error: fetchError } = await supabase
      .from('claims')
      .select(`
        id, item_id, claimant_id, status,
        item:items!claims_item_id_fkey(id, title, poster_id)
      `)
      .eq('id', id)
      .single();

    if (fetchError || !claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({ error: 'Claim has already been reviewed' });
    }

    // Update claim status
    const updates = {
      status,
      reviewed_by: req.user.id,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes
    };

    const { data: updatedClaim, error } = await supabase
      .from('claims')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        item:items!claims_item_id_fkey(id, title, description, location, image_urls),
        claimant:users!claims_claimant_id_fkey(id, full_name, email, role),
        reviewer:users!claims_reviewed_by_fkey(id, full_name, role)
      `)
      .single();

    if (error) {
      console.error('Update claim status error:', error);
      return res.status(500).json({ error: 'Failed to update claim status' });
    }

    // If approved, update item status and claimed_by
    if (status === 'approved') {
      await supabase
        .from('items')
        .update({
          status: 'claimed',
          claimed_by: claim.claimant_id
        })
        .eq('id', claim.item_id);

      // Award points to claimant
      await supabase.rpc('increment_user_points', {
        user_id: claim.claimant_id,
        points_to_add: 20
      });
    }

    // Create notifications
    const notificationData = {
      user_id: claim.claimant_id,
      title: `Claim ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your claim for "${claim.item.title}" has been ${status}`,
      type: 'claim_update',
      data: { claimId: id, status, itemId: claim.item_id }
    };

    await supabase
      .from('notifications')
      .insert([notificationData]);

    // Notify item poster if approved
    if (status === 'approved') {
      await supabase
        .from('notifications')
        .insert([{
          user_id: claim.item.poster_id,
          title: 'Item Claimed',
          message: `Your item "${claim.item.title}" has been claimed`,
          type: 'item_claimed',
          data: { itemId: claim.item_id, claimId: id }
        }]);
    }

    res.json({
      message: `Claim ${status} successfully`,
      claim: updatedClaim
    });

  } catch (error) {
    console.error('Update claim status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get claims statistics (admin only)
router.get('/admin/statistics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: stats, error } = await supabase
      .from('claims')
      .select('status')
      .in('status', ['pending', 'approved', 'rejected']);

    if (error) {
      console.error('Get claims statistics error:', error);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    const statistics = {
      total: stats.length,
      pending: stats.filter(c => c.status === 'pending').length,
      approved: stats.filter(c => c.status === 'approved').length,
      rejected: stats.filter(c => c.status === 'rejected').length
    };

    res.json(statistics);

  } catch (error) {
    console.error('Get claims statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
