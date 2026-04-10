const supabase = require('../config/supabase');

const getAllUsers = async (req, res) => {
  try {
    // user_profiles is the single source of truth — no separate users table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, is_admin, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Map role string → is_admin boolean
  const is_admin = role === 'admin';

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ is_admin })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'User role updated', user: data });
  } catch (err) {
    console.error('updateUserRole error:', err.message);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

module.exports = { getAllUsers, updateUserRole };