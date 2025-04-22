const mongoose = require("mongoose");

const chemicalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batchNumber: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: "kg" },
  intakeDate: { type: Date, default: Date.now },
  expirationDate: { type: Date },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Chemical", chemicalSchema);
