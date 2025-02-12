const express = require("express");
const router = express.Router();
const bisFaqs = require("../models/bisfaqs"); // Renamed model import for clarity

// Get all FAQs (Ensure it works with `/faqs`)

router.get("/", async (req, res) => {
  try {
    const faqs = await bisFaqs.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single FAQ (Ensure it works with `/faqs/:id`)

router.get("/:id", getFaq, (req, res) => {
  res.json(res.faq);
});

// Middleware function to get a single FAQ by ID

async function getFaq(req, res, next) {
  try {
    const faq = await bisFaqs.findById(req.params.id);
    if (faq) {
      res.faq = faq;
      next();
    } else {
      res.status(404).json({ message: "FAQ not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create a new FAQ (Ensure it works with `/faqs`)

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

// Update a FAQ (Ensure it works with `/faqs/:id`)

router.patch("/:id", getFaq, async (req, res) => {
  if (req.body.question || req.body.answer) {
    res.faq.question = req.body.question;
    res.faq.answer = req.body.answer;
  }

  try {
    const updatedFaq = await res.faq.save();
    res.json(updatedFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a FAQ (Ensure it works with `/faqs/:id`)

router.delete("/:id", getFaq, async (req, res) => {
  try {
    await res.faq.remove();
    res.json({ message: "FAQ deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export the router

module.exports = router;
