const express = require("express");
const mongoose = require("mongoose");
const { Types } = require("mongoose");

const router = express.Router();
const eprFaqs = require("../models/eprfaqs");

// ✅ Memory Cache (Consider Redis in Production)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes expiration
const cacheExpiry = new Map(); // Stores expiration timestamps

const setCache = (key, data) => {
  cache.set(key, data);
  cacheExpiry.set(key, Date.now() + CACHE_TTL);
};

const getCache = (key) => {
  const expiry = cacheExpiry.get(key);
  if (!expiry || expiry < Date.now()) {
    cache.delete(key);
    cacheExpiry.delete(key);
    return null;
  }
  return cache.get(key);
};

// ✅ GET: All FAQs (Pagination & Caching)
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const cacheKey = `faqs_page_${page}_limit_${limit}`;

  const cachedData = getCache(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const faqs = await eprFaqs
      .find({}, { _id: 1, question: 1, answer: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    setCache(cacheKey, faqs);
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

  const cachedFaq = getCache(id);
  if (cachedFaq) return res.json(cachedFaq);

  try {
    const faq = await eprFaqs.findById(id).lean();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    setCache(id, faq);
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ POST: Create FAQ (Update Cache Immediately)
router.post("/", async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer)
    return res
      .status(400)
      .json({ message: "Both question and answer are required" });

  try {
    const newFaq = new eprFaqs({ question, answer });
    await newFaq.save();

    cache.clear(); // Clear cache to refresh data

    res.status(201).json(newFaq);
  } catch (err) {
    res.status(400).json({ message: "Invalid Data" });
  }
});

// ✅ PUT: Update FAQ (Invalidate Cache)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid FAQ ID" });

  try {
    const faq = await eprFaqs
      .findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      })
      .lean();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    cache.delete(id);
    cache.clear(); // Clear list cache since data is updated

    res.json(faq);
  } catch (err) {
    res.status(400).json({ message: "Invalid Data" });
  }
});

// ✅ DELETE: Remove FAQ (Clear Cached List)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid FAQ ID" });

  try {
    const deletedFaq = await eprFaqs.findByIdAndDelete(id);
    if (!deletedFaq) return res.status(404).json({ message: "FAQ not found" });

    cache.delete(id);
    cache.clear(); // Clear paginated cache

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
