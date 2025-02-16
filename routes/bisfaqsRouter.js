const express = require("express");
const mongoose = require("mongoose");
const { Types } = require("mongoose");

const router = express.Router();
const bisFaqs = require("../models/bisfaqs");

// ✅ Caching Middleware (Optional: Use Redis for faster responses)
const cache = new Map();

// ✅ GET: All FAQs (Pagination & Caching)
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max limit 50
  const cacheKey = `faqs_page_${page}_limit_${limit}`;

  // Serve from cache if available
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const faqs = await bisFaqs
      .find({}, { _id: 1, question: 1, answer: 1 }) // Select only required fields
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // Use .lean() for performance boost

    cache.set(cacheKey, faqs); // Store in cache
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ GET: Single FAQ (Validate ID & Cache)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid FAQ ID" });

  if (cache.has(id)) return res.json(cache.get(id)); // Serve from cache

  try {
    const faq = await bisFaqs.findById(id).lean();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    cache.set(id, faq); // Store in cache
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ POST: Create FAQ (Immediate Response)
router.post("/", async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer)
    return res
      .status(400)
      .json({ message: "Both question and answer are required" });

  try {
    const newFaq = new bisFaqs({ question, answer });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(400).json({ message: "Invalid Data" });
  }
});

// ✅ PUT: Update FAQ (Efficient Query)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid FAQ ID" });

  try {
    const faq = await bisFaqs
      .findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      })
      .lean();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    cache.set(id, faq); // Update cache
    res.json(faq);
  } catch (err) {
    res.status(400).json({ message: "Invalid Data" });
  }
});

// ✅ DELETE: Remove FAQ (Quick Response)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid FAQ ID" });

  try {
    const deletedFaq = await bisFaqs.findByIdAndDelete(id);
    if (!deletedFaq) return res.status(404).json({ message: "FAQ not found" });

    cache.delete(id); // Remove from cache
    res.status(204).send(); // No Content Response
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
