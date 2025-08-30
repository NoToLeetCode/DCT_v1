const express = require("express");
const Question = require("../models/Question");
const Form = require("../models/Form");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all questions for a form
router.get("/form/:formId", auth, async (req, res) => {
  try {
    // Verify form ownership
    const form = await Form.findOne({ _id: req.params.formId, userId: req.user.user.id });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    const questions = await Question.find({ formId: req.params.formId }).sort({ order: 1 });
    res.json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new question
router.post("/", auth, async (req, res) => {
  try {
    const { questionText, answerType, formId, isRequired } = req.body;
    
    // Verify form ownership
    const form = await Form.findOne({ _id: formId, userId: req.user.user.id });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    // Get the next order number
    const lastQuestion = await Question.findOne({ formId }).sort({ order: -1 });
    const order = lastQuestion ? lastQuestion.order + 1 : 0;
    
    const newQuestion = new Question({
      questionText,
      answerType,
      formId,
      order,
      isRequired
    });
    
    const question = await newQuestion.save();
    res.json(question);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a question
router.put("/:id", auth, async (req, res) => {
  try {
    const { questionText, answerType, isRequired } = req.body;
    
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // Verify form ownership
    const form = await Form.findOne({ _id: question.formId, userId: req.user.user.id });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    question.questionText = questionText || question.questionText;
    question.answerType = answerType || question.answerType;
    question.isRequired = isRequired !== undefined ? isRequired : question.isRequired;
    
    await question.save();
    res.json(question);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a question
router.delete("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // Verify form ownership
    const form = await Form.findOne({ _id: question.formId, userId: req.user.user.id });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
