const supabase = require('../config/supabase');

// Strategy:
// - Supabase Auth manages sessions & JWTs
// - user_profiles table: id = auth.users.id (PK), stores full_name, email, is_admin etc.
// - No separate 'users' table exists in the schema

const register = async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Step 1: Create Supabase Auth user
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    if (!data.user) return res.status(400).json({ error: 'Registration failed' });

    const authUserId = data.user.id;

    // Step 2: Insert into user_profiles (id = auth user id, per schema)
    const { error: profileErr } = await supabase
      .from('user_profiles')
      .insert({ id: authUserId, email, full_name, is_admin: false });

    if (profileErr) {
      // Non-fatal — auth user created, profile can be created on first login
      console.error('Profile creation error:', profileErr.message);
    }

    res.status(201).json({
      message: 'Registration successful. Please verify your email, then log in.',
      user: data.user,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: 'Invalid email or password' });

    // Fetch full_name + is_admin from user_profiles (matches actual schema)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, is_admin')
      .eq('id', data.user.id)
      .maybeSingle();

    // Merge profile fields into user object for frontend
    const userWithName = {
      ...data.user,
      full_name: profile?.full_name || data.user.user_metadata?.full_name || '',
      role: profile?.is_admin ? 'admin' : 'student',
    };

    res.json({
      message: 'Login successful',
      user: userWithName,
      session: { ...data.session, user: userWithName },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/reset-password` : 'http://localhost:3000/reset-password',
    });

    if (error) {
      console.error('Password reset request error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'If an account exists, a password reset link has been sent to your email.' });
  } catch (err) {
    console.error('Password reset schema error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  const { access_token, new_password } = req.body;

  if (!access_token || !new_password) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (new_password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data.user) {
      return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' });
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(data.user.id, {
      password: new_password
    });

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.json({ message: 'Password has been successfully updated' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login, logout, requestPasswordReset, resetPassword };