const mongoose = require('mongoose');

// Define Schemes
const blockNumberSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    blockNumber: { type: Number, required: true },
  },
  {
    timestamps: true
  });

// Create Model & Export
module.exports = mongoose.model('BlockNumber', blockNumberSchema);
