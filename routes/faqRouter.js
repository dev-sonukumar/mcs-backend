const express = require("express");
const router = express.Router(); // Correcting the router import
const faq = require("../models/faq");

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await faq.find();
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
router.post("/createFaq", async (req, res) => {
  const newFaq = new faq({
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

// Delete a FAQ
router.delete("/:id", getFaq, async (req, res) => {
  try {
    await res.faq.remove();
    res.json({ message: "FAQ deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get FAQ by ID
async function getFaq(req, res, next) {
  let faq;

  try {
    faq = await faq.findById(req.params.id);
    if (faq == null) {
      return res.status(404).json({ message: "FAQ not found." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.faq = faq;
  next();
}

module.exports = router; // Export the router
