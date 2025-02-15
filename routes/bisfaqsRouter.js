const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const bisFaqs = require("../models/bisfaqs");

// 🔹 Get All FAQs (Paginated)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const faqs = await bisFaqs
      .find({}, { _id: 1, question: 1, answer: 1 }) // Fetch only necessary fields
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean(); // Use .lean() for better performance

    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Get Single FAQ by ID
router.get("/:id", async (req, res) => {
  try {
    const faq = await bisFaqs.findById(req.params.id).lean();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Create New FAQ
router.post("/", async (req, res) => {
  const faq = new bisFaqs({ question: req.body.question, answer: req.body.answer });

  try {
    const newFaq = await faq.save();
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔹 Update FAQ
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

// 🔹 Delete FAQ
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
