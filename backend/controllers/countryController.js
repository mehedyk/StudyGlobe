const supabase = require('../config/supabase');

const getAllCountries = async (req, res) => {
  try {
    const { data, error } = await supabase.from('countries').select('*').order('name');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve countries' });
  }
};

const getCountryById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('countries').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Country not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve country' });
  }
};

const createCountry = async (req, res) => {
  const { name, code, description, image_url } = req.body;
  if (!name) return res.status(400).json({ error: 'Country name is required' });
  try {
    const { data, error } = await supabase
      .from('countries').insert({ name, code, description, image_url }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create country' });
  }
};

const updateCountry = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('countries').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Country not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update country' });
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { error } = await supabase.from('countries').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Country deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete country' });
  }
};

module.exports = { getAllCountries, getCountryById, createCountry, updateCountry, deleteCountry };
