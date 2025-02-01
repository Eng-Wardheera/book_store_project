const mongoose =  require('mongoose');

const categorySchema = new mongoose.Schema({
  catName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
  }, {
    timestamps: true,
  });
  
  const category = mongoose.model('categories', categorySchema);

  module.exports = category;