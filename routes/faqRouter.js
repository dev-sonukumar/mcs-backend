const express = require("express");
const router = express.Router();
const bisFaqs = require("../models/bisfaqs"); // Import FAQ model

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await bisFaqs.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single FAQ by ID
router.get("/:id", async (req, res) => {
  try {
    const faq = await bisFaqs.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new FAQ
router.post("/", async (req, res) => {
  const faq = new bisFaqs({
    question: req.body.question,
    answer: req.body.answer,
  });

  try {
    const newFaq = await faq.save();
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an FAQ (Use PUT for full update)

router.put("/:id", async (req, res) => {
  try {
    const faq = await bisFaqs.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an FAQ
router.delete("/:id", async (req, res) => {
  try {
    const deletedFaq = await bisFaqs.findByIdAndDelete(req.params.id);
    if (!deletedFaq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
