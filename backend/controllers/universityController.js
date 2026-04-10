const supabase = require('../config/supabase');

// Real DB schema:
// universities: id, Name (capital N), country_id, city, type, website, description
// countries: id, name
// programs: id, university_id, degree, field, duration_years, tuition_per_year, degree_level_id
// intakes: id, university_id, intake_name, start_month
// language_requirements: id, university_id, test_name, min_score
// scholarship_eligibility: id, university_id, degree_level_id, eligibility_basis, minimum_gpa, additional_notes

const getAllUniversities = async (req, res) => {
  const { country_id, search } = req.query;
  try {
    let query = supabase.from('universities').select('*, countries(name)');
    if (country_id) query = query.eq('country_id', country_id);
    if (search && search.trim()) query = query.ilike('Name', `%${search.trim()}%`);
    const { data, error } = await query.order('Name');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('getAllUniversities error:', err);
    res.status(500).json({ error: 'Failed to retrieve universities' });
  }
};

const getUniversityById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select(`
        *,
        countries(name),
        programs(*),
        intakes(*),
        language_requirements(*),
        scholarship_eligibility(*)
      `)
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'University not found' });
    res.json(data);
  } catch (err) {
    console.error('getUniversityById error:', err);
    res.status(500).json({ error: 'Failed to retrieve university' });
  }
};

const createUniversity = async (req, res) => {
  const { Name, country_id } = req.body;
  if (!Name || !country_id) return res.status(400).json({ error: 'Name and country are required' });
  try {
    const { data, error } = await supabase.from('universities').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create university' });
  }
};

const updateUniversity = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('universities').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'University not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update university' });
  }
};

const deleteUniversity = async (req, res) => {
  try {
    const { error } = await supabase.from('universities').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'University deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete university' });
  }
};

module.exports = { getAllUniversities, getUniversityById, createUniversity, updateUniversity, deleteUniversity };
