const supabase = require('../config/supabase');

const getSystemMetrics = async (req, res) => {
  try {
    const [usersRes, universitiesRes, programsRes, countriesRes] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('universities').select('*', { count: 'exact', head: true }),
      supabase.from('programs').select('*', { count: 'exact', head: true }),
      supabase.from('countries').select('*', { count: 'exact', head: true }),
    ]);

    res.json({
      users: usersRes.count || 0,
      universities: universitiesRes.count || 0,
      programs: programsRes.count || 0,
      countries: countriesRes.count || 0,
    });
  } catch (err) {
    console.error('getSystemMetrics error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
};

module.exports = { getSystemMetrics };