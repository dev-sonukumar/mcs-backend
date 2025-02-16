const mongoose = require("mongoose");

// etafaq schema

const etafaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

// exporting the faq schema

module.exports = mongoose.model("etaFaqs", etafaqSchema);
