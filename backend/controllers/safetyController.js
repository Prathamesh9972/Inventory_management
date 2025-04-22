const Safety = require('../models/safetyModel');

// Add safety information
const addSafetyInfo = async (req, res) => {
  try {
    const { chemical, hazard, handlingInstructions, safetyEquipment } = req.body;
    
    // Create a new safety info entry
    const info = await Safety.create({
      chemical,
      hazard,
      handlingInstructions,
      safetyEquipment
    });
    
    res.status(201).json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add safety info' });
  }
};

// Get all safety information
const getAllSafety = async (req, res) => {
  try {
    const safety = await Safety.find().populate('chemical');
    res.status(200).json(safety);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch safety info' });
  }
};

// Update safety information by ID
const updateSafetyInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { chemical, hazard, handlingInstructions, safetyEquipment } = req.body;

    // Find the safety info by ID and update it
    const updatedSafety = await Safety.findByIdAndUpdate(id, {
      chemical,
      hazard,
      handlingInstructions,
      safetyEquipment
    }, { new: true });

    if (!updatedSafety) {
      return res.status(404).json({ error: 'Safety info not found' });
    }

    res.status(200).json(updatedSafety);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update safety info' });
  }
};

// Delete safety information by ID
const deleteSafetyInfo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the safety info by ID
    const deletedSafety = await Safety.findByIdAndDelete(id);

    if (!deletedSafety) {
      return res.status(404).json({ error: 'Safety info not found' });
    }

    res.status(200).json({ message: 'Safety info deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete safety info' });
  }
};

module.exports = { addSafetyInfo, getAllSafety, updateSafetyInfo, deleteSafetyInfo };
