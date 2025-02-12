const mongoose = require("mongoose");

// faq schema

const faqSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Faq", faqSchema);
