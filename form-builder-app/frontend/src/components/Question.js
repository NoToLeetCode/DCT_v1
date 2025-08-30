import React, { useState } from "react";
import "./Question.css";

const Question = ({ question, onUpdate, onDelete, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    questionText: question.questionText,
    answerType: question.answerType,
    isRequired: question.isRequired
  });

  const handleSave = () => {
    onUpdate(question._id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      questionText: question.questionText,
      answerType: question.answerType,
      isRequired: question.isRequired
    });
    setIsEditing(false);
  };

  const getAnswerTypeLabel = (type) => {
    const labels = {
      text: "Text",
      number: "Number",
      formula: "Formula",
      linked: "Linked Answer"
    };
    return labels[type] || type;
  };

  if (isEditing) {
    return (
      <div className="question-card editing">
        <div className="question-header">
          <span className="question-number">Q{index + 1}</span>
          <div className="question-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
        
        <div className="question-content">
          <div className="form-group">
            <label>Question Text</label>
            <input
              type="text"
              value={editData.questionText}
              onChange={(e) => setEditData({...editData, questionText: e.target.value})}
              className="question-input"
            />
          </div>
          
          <div className="form-group">
            <label>Answer Type</label>
            <select
              value={editData.answerType}
              onChange={(e) => setEditData({...editData, answerType: e.target.value})}
              className="answer-type-select"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="formula">Formula</option>
              <option value="linked">Linked Answer</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={editData.isRequired}
                onChange={(e) => setEditData({...editData, isRequired: e.target.checked})}
              />
              Required
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Q{index + 1}</span>
        <div className="question-actions">
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
          <button onClick={() => onDelete(question._id)} className="delete-btn">Delete</button>
        </div>
      </div>
      
      <div className="question-content">
        <h4 className="question-text">{question.questionText}</h4>
        <div className="question-meta">
          <span className="answer-type">
            Type: {getAnswerTypeLabel(question.answerType)}
          </span>
          {question.isRequired && (
            <span className="required-badge">Required</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
