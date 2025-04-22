const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  chemical: { type: mongoose.Schema.Types.ObjectId, ref: 'Chemical', required: true },
  supplierName: { type: String, required: true },
  supplierContact: { type: String }, // New field
  quantity: { type: Number, required: true },
  price: { type: Number, default: 0 },
  purchaseDate: { type: Date, default: Date.now },
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
