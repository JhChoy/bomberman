const mongoose = require('mongoose');

// Define Schemes
const gameListSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    host: { type: String, required: true },
  },
  {
    timestamps: true
  });

// Create Model & Export
module.exports = mongoose.model('GameList', gameListSchema);
