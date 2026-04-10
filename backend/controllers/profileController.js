const supabase = require('../config/supabase');
const { ollama, fetchContext, buildContextString } = require('../utils/ragHelper');

// Schema: user_profiles.id = auth.users.id (PK, not user_id)
// full_name and email live directly in user_profiles

const getProfile = async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) throw error;

    // If no profile row yet, auto-create one
    if (!profile) {
      const { data: newProfile, error: insertErr } = await supabase
        .from('user_profiles')
        .insert({
          id: req.user.id,
          email: req.user.email,
          full_name: req.user.user_metadata?.full_name || req.user.email?.split('@')[0] || 'Student',
          is_admin: false,
        })
        .select()
        .single();

      if (insertErr) {
        console.error('Profile auto-create error:', insertErr.message);
        return res.json({ id: req.user.id, email: req.user.email, full_name: '' });
      }
      return res.json(newProfile);
    }

    res.json(profile);
  } catch (err) {
    console.error('getProfile error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

const updateProfile = async (req, res) => {
  const {
    full_name,
    preferred_country, degree_level, field_of_study,
    budget_range, language_test, language_score,
  } = req.body;

  const updates = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (preferred_country !== undefined) updates.preferred_country = preferred_country;
  if (degree_level !== undefined) updates.degree_level = degree_level;
  if (field_of_study !== undefined) updates.field_of_study = field_of_study;
  if (budget_range !== undefined) updates.budget_range = budget_range;
  if (language_test !== undefined) updates.language_test = language_test;
  if (language_score !== undefined) updates.language_score = language_score;
  updates.updated_at = new Date().toISOString();

  try {
    // Check if profile row exists
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', req.user.id)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', req.user.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('user_profiles')
        .insert({ id: req.user.id, email: req.user.email, ...updates })
        .select()
        .single();
    }

    if (result.error) throw result.error;
    res.json({ message: 'Profile updated successfully', profile: result.data });
  } catch (err) {
    console.error('updateProfile error:', err.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (!profile) return res.status(400).json({ error: 'Please save your profile first before generating recommendations.' });

    const queryStr = `
      Field: ${profile.field_of_study || 'Any'}
      Country: ${profile.preferred_country || 'Any'}
      Education level: ${profile.degree_level || 'Any'}
      Budget: ${profile.budget_range || 'Any'}
    `;

    const context = await fetchContext(queryStr);
    const contextStr = buildContextString(context);

    const systemPrompt = `You are an expert StudyGlobe Academic Advisor. 
    A user wants university and program recommendations based on their profile:
    ${queryStr}

    Using ONLY the following dataset, recommend 2-3 specific programs that best match their criteria.
    Format your response in Markdown with clear headings for each university/program.
    Do NOT invent information that is not inside the dataset!

    ${contextStr}`;

    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'gemma4:31b',
      messages: [{ role: 'system', content: systemPrompt }]
    });

    res.json({ recommendations: response.message.content });
  } catch (err) {
    console.error('getRecommendations error:', err.message);
    const detail = err.message || '';
    if (detail.includes('429') || detail.includes('524') || detail.includes('timeout')) {
       return res.status(503).json({ error: 'AI advisor is currently busy. Please try again in a few moments.' });
    }
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

module.exports = { getProfile, updateProfile, getRecommendations };