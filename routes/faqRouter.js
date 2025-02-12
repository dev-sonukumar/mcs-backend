const express = require("express");
const router = express.Router();
const Faq = require("../models/faq"); // Renamed model import for clarity

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await Faq.find(); // Use correct model name
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single FAQ
router.get("/:id", getFaq, (req, res) => {
  res.json(res.faq);
});

// Create a new FAQ
router.post("/", async (req, res) => {
  const newFaq = new Faq({
    question: req.body.question,
    answer: req.body.answer,
  });

  try {
    const savedFaq = await newFaq.save();
    res.status(201).json(savedFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a FAQ
router.patch("/:id", getFaq, async (req, res) => {
  if (req.body.question) res.faq.question = req.body.question;
  if (req.body.answer) res.faq.answer = req.body.answer;

  try {
    const updatedFaq = await res.faq.save();
    res.json(updatedFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a FAQ
router.delete("/:id", getFaq, async (req, res) => {
  try {
    await Faq.deleteOne({ _id: res.faq._id }); // ✅ Correct deletion method
    res.json({ message: "FAQ deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get FAQ by ID
async function getFaq(req, res, next) {
  let faq;
  try {
    faq = await Faq.findById(req.params.id); // Use correct model name
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.faq = faq;
  next();
}

module.exports = router;
