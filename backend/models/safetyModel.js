const mongoose = require('mongoose');

const safetySchema = new mongoose.Schema({
  chemical: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chemical', 
    required: true 
  },
  hazard: {
    type: String,
    required: true
  },
  handlingInstructions: {
    type: String,
    required: true
  },
  safetyEquipment: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create and export the Safety model
module.exports = mongoose.model('Safety', safetySchema);
