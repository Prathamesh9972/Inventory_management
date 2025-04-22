const Chemical = require("../models/chemicalModel");

// 🔍 Get all chemicals
exports.getChemicals = async (req, res) => {
  try {
    const chemicals = await Chemical.find().sort({ createdAt: -1 });
    res.status(200).json(chemicals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chemicals", details: error.message });
  }
};

// ➕ Add a new chemical (Admin Only)
exports.addChemical = async (req, res) => {
  const { name, batchNumber, quantity, intakeDate, expirationDate } = req.body;
  const userId = req.user?._id;
  const userRole = req.user?.role;

  if (userRole !== 'admin') {
    return res.status(403).json({ error: "Only admins can add chemicals" });
  }

  if (!name || !batchNumber || !quantity) {
    return res.status(400).json({ error: "Name, batch number, and quantity are required" });
  }

  try {
    const chemical = new Chemical({
      name,
      batchNumber,
      quantity,
      intakeDate: intakeDate || new Date(),
      expirationDate,
      addedBy: userId
    });

    await chemical.save();
    res.status(201).json(chemical);
  } catch (error) {
    res.status(500).json({ error: "Failed to add chemical", details: error.message });
  }
};

// 📄 Get a specific chemical by ID
exports.getChemicalById = async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ error: "Chemical not found" });
    }
    res.status(200).json(chemical);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chemical", details: error.message });
  }
};

// ✏️ Update a chemical by ID (Admin Only)
exports.updateChemical = async (req, res) => {
  const userRole = req.user?.role;

  if (userRole !== 'admin') {
    return res.status(403).json({ error: "Only admins can update chemicals" });
  }

  try {
    const updatedChemical = await Chemical.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedChemical) {
      return res.status(404).json({ error: "Chemical not found" });
    }
    res.status(200).json(updatedChemical);
  } catch (error) {
    res.status(500).json({ error: "Failed to update chemical", details: error.message });
  }
};

// ❌ Delete a chemical by ID (Admin Only)
exports.deleteChemical = async (req, res) => {
  const userRole = req.user?.role;

  if (userRole !== 'admin') {
    return res.status(403).json({ error: "Only admins can delete chemicals" });
  }

  try {
    const chemical = await Chemical.findByIdAndDelete(req.params.id);
    if (!chemical) {
      return res.status(404).json({ error: "Chemical not found" });
    }
    res.status(200).json({ message: "Chemical deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete chemical", details: error.message });
  }
};

// 🔍 Search chemicals by name or batch number (case-insensitive)
exports.searchChemicals = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const results = await Chemical.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { batchNumber: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to search chemicals", details: error.message });
  }
};
