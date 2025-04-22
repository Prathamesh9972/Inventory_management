const Sale = require('../models/salesModel');
const Purchase = require('../models/purchaseModel');
const Chemical = require('../models/chemicalModel');

const getDetailedReport = async (req, res) => {
  try {
    const salesDetails = await Sale.find()
      .populate('chemical', 'name batchNumber price') // Include price here
      .select('chemical quantity customerName saleDate soldBy payment');

    const purchaseDetails = await Purchase.find()
      .populate('chemical', 'name batchNumber')
      .select('chemical quantity price supplierName purchaseDate purchasedBy payment');

    const chemicalDetails = await Chemical.find()
      .select('name batchNumber quantity intakeDate expirationDate addedBy');

    // Total Sales Value (using price if available)
    const totalSalesValue = salesDetails.reduce((total, sale) => {
      const price = sale.chemical?.price || 0;
      return total + (sale.quantity * price);
    }, 0);

    // Total Purchase Cost
    const totalPurchaseCost = purchaseDetails.reduce((total, purchase) => {
      return total + (purchase.quantity * purchase.price);
    }, 0);

    const totalPaymentReceived = salesDetails.reduce((total, sale) => {
      return total + (sale.payment?.amountPaid || 0);
    }, 0);

    const totalPaymentMade = purchaseDetails.reduce((total, purchase) => {
      return total + (purchase.payment?.amountPaid || 0);
    }, 0);

    const report = {
      salesCount: salesDetails.length,
      totalSalesValue,
      totalPaymentReceived,
      salesDetails,
      purchaseCount: purchaseDetails.length,
      totalPurchaseCost,
      totalPaymentMade,
      purchaseDetails,
      totalChemicals: chemicalDetails.length,
      chemicalDetails,
    };

    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate detailed report' });
  }
};

module.exports = { getDetailedReport };
