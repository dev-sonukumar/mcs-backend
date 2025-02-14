const Redis = require("ioredis");
const redis = new Redis(); // Default Redis connection (127.0.0.1:6379)

const express = require("express");
const router = express.Router();
const bisFaqs = require("../models/bisfaqs"); // Import FAQ model

// Get all FAQs with pagination and caching
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const cacheKey = `faqs:${page}:${limit}`; // Unique key for the cache based on page and limit

  try {
    // Check if data is already cached in Redis
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // If data exists in the cache, return it directly
      return res.json(JSON.parse(cachedData));
    }

    // If not cached, fetch data from MongoDB
    const faqs = await bisFaqs
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select("question answer");

    // Cache the fetched data in Redis for future requests
    redis.setex(cacheKey, 3600, JSON.stringify(faqs)); // Cache for 1 hour (3600 seconds)

    // Send the response
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single FAQ by ID with caching
router.get("/:id", async (req, res) => {
  const cacheKey = `faq:${req.params.id}`; // Cache key for individual FAQ

  try {
    // Check if data is already cached in Redis for this specific FAQ
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // If data exists in the cache, return it directly
      return res.json(JSON.parse(cachedData));
    }

    // If not cached, fetch the FAQ from MongoDB
    const faq = await bisFaqs.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    // Cache the fetched FAQ in Redis for future requests
    redis.setex(cacheKey, 3600, JSON.stringify(faq)); // Cache for 1 hour (3600 seconds)

    // Send the response
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new FAQ and invalidate cache
router.post("/", async (req, res) => {
  const faq = new bisFaqs({
    question: req.body.question,
    answer: req.body.answer,
  });

  try {
    const newFaq = await faq.save();

    // Invalidate cache for all FAQ pages
    // You can use a specific cache key pattern to invalidate only relevant ones, e.g., for the affected page
    const { page = 1, limit = 10 } = req.body; // Assuming body contains pagination details for the new FAQ
    const cacheKey = `faqs:${page}:${limit}`;
    redis.del(cacheKey); // Remove cache for the specific page

    // Cache invalidation after creating new FAQ
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an FAQ and invalidate cache
router.put("/:id", async (req, res) => {
  try {
    const faq = await bisFaqs.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    // Invalidate cache for the specific FAQ by ID
    const cacheKey = `faq:${req.params.id}`;
    redis.del(cacheKey); // Remove cache for the specific FAQ

    res.json(faq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an FAQ and invalidate cache
router.delete("/:id", async (req, res) => {
  try {
    const deletedFaq = await bisFaqs.findByIdAndDelete(req.params.id);
    if (!deletedFaq) return res.status(404).json({ message: "FAQ not found" });

    // Invalidate cache for the specific FAQ by ID
    const cacheKey = `faq:${req.params.id}`;
    redis.del(cacheKey); // Remove cache for the specific FAQ

    res.json({ message: "FAQ deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
