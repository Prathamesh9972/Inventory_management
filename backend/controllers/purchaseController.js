const Purchase = require('../models/purchaseModel');

const validatePurchase = (data) => {
  const { chemical, supplierName, quantity, price, purchasedBy } = data;
  return chemical && supplierName && quantity && price != null && purchasedBy;
};

// Create a new purchase
const addPurchase = async (req, res) => {
  try {
    if (!validatePurchase(req.body)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const purchase = await Purchase.create(req.body);
    res.status(201).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log purchase' });
  }
};

// Get all purchases
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate('chemical');
    res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

// Get single purchase
const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate('chemical');
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
};

// Update purchase
const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update purchase' });
  }
};

// Delete purchase
const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!paymentStatus) {
      return res.status(400).json({ error: 'Payment status is required' });
    }

    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

module.exports = {
  addPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  updatePaymentStatus,
};
