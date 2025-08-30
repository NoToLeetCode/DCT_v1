const express = require("express");
const Form = require("../models/Form");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all forms for a user
router.get("/", auth, async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.user.user.id }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific form
router.get("/:id", auth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, userId: req.user.user.id });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new form
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const newForm = new Form({
      title,
      description,
      userId: req.user.user.id
    });
    
    const form = await newForm.save();
    res.json(form);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a form
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    let form = await Form.findOne({ _id: req.params.id, userId: req.user.user.id });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    form.title = title || form.title;
    form.description = description || form.description;
    
    await form.save();
    res.json(form);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a form
router.delete("/:id", auth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, userId: req.user.user.id });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Form deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
