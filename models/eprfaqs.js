const mongoose = require("mongoose");

// etafaq schema

const eprfaqSchema = new mongoose.Schema({
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

module.exports = mongoose.model("eprFaqs", eprfaqSchema);
