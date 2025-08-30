const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  answerType: {
    type: String,
    required: true,
    enum: ["text", "number", "formula", "linked"],
    default: "text"
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isRequired: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Question", questionSchema);
