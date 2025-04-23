const Sale = require('../models/salesModel');

// Add a new sale
const addSale = async (req, res) => {
  try {
    const {
      chemical,
      quantity,
      customerName,
      saleDate,
      soldBy,
      paymentAmount,
      transactionId,
      paymentStatus,
      customerContact,
      paidBy
    } = req.body;

    // Validate required fields
    if (!chemical || !quantity || !soldBy || !paymentAmount || !paidBy||!customerContact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newSale = await Sale.create({
      chemical,
      quantity,
      customerName,
      saleDate,
      soldBy,
      paymentAmount,
      customerContact,
      transactionId: transactionId || "",
      paymentStatus: paymentStatus || "Pending",  // Default to Pending
      paidBy
    });

    res.status(201).json(newSale);
  } catch (error) {
    console.error('Error adding sale:', error);
    res.status(500).json({ error: 'Failed to log sale' });
  }
}

// Get all sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('chemical');
    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
}

// Get a single sale by ID
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('chemical');
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
}

// Update a sale by ID
const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Failed to update sale' });
  }
}

// Delete a sale by ID
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
}

module.exports = {
  addSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale
}
