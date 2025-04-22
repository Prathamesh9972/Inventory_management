const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  chemical: { type: mongoose.Schema.Types.ObjectId, ref: 'Chemical', required: true },
  quantity: { type: Number, required: true },
  customerName: { type: String },
  customerContact: { type: String }, // New field
  saleDate: { type: Date, default: Date.now },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentAmount: { type: Number, default: 0 },
  transactionId: { type: String, default: "" },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: "Pending" },
  paidBy: { type: String, enum: ["Cash", "UPI", "Bank"], default: "Cash" }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
