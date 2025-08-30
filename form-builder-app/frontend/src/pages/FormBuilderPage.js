import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formsAPI, questionsAPI } from "../services/api";
import Question from "../components/Question";
import "./FormBuilderPage.css";

const FormBuilderPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    answerType: "text",
    isRequired: false
  });

  useEffect(() => {
    fetchFormData();
  }, [formId]);

  const fetchFormData = async () => {
    try {
      const [formResponse, questionsResponse] = await Promise.all([
        formsAPI.getById(formId),
        questionsAPI.getByFormId(formId)
      ]);
      
      if (formResponse.message) {
        setError(formResponse.message);
      } else {
        setForm(formResponse);
        setQuestions(questionsResponse);
      }
    } catch (error) {
      setError("Failed to fetch form data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await questionsAPI.create({
        ...newQuestion,
        formId
      });
      
      if (response._id) {
        setQuestions([...questions, response]);
        setNewQuestion({
          questionText: "",
          answerType: "text",
          isRequired: false
        });
        setShowAddQuestion(false);
      }
    } catch (error) {
      setError("Failed to add question");
    }
  };

  const handleUpdateQuestion = async (questionId, updatedData) => {
    try {
      const response = await questionsAPI.update(questionId, updatedData);
      if (response._id) {
        setQuestions(questions.map(q => 
          q._id === questionId ? response : q
        ));
      }
    } catch (error) {
      setError("Failed to update question");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await questionsAPI.delete(questionId);
        setQuestions(questions.filter(q => q._id !== questionId));
      } catch (error) {
        setError("Failed to delete question");
      }
    }
  };

  const handleSaveForm = async () => {
    try {
      await formsAPI.update(formId, {
        title: form.title,
        description: form.description
      });
      setError("");
    } catch (error) {
      setError("Failed to save form");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!form) {
    return <div className="error">Form not found</div>;
  }

  return (
    <div className="form-builder-container">
      <header className="form-builder-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Form Builder: {form.title}</h1>
        <button onClick={handleSaveForm} className="save-btn">
          Save Form
        </button>
      </header>

      <main className="form-builder-main">
        <div className="form-info">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="form-title-input"
            placeholder="Form Title"
          />
          <textarea
            value={form.description || ""}
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="form-description-input"
            placeholder="Form Description"
            rows="3"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="questions-section">
          <div className="questions-header">
            <h3>Questions ({questions.length})</h3>
            <button 
              onClick={() => setShowAddQuestion(!showAddQuestion)}
              className="add-question-btn"
            >
              {showAddQuestion ? "Cancel" : "Add Question"}
            </button>
          </div>

          {showAddQuestion && (
            <div className="add-question-form">
              <h4>Add New Question</h4>
              <form onSubmit={handleAddQuestion}>
                <div className="form-group">
                  <label htmlFor="questionText">Question Text</label>
                  <input
                    type="text"
                    id="questionText"
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                    required
                    placeholder="Enter your question"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="answerType">Answer Type</label>
                  <select
                    id="answerType"
                    value={newQuestion.answerType}
                    onChange={(e) => setNewQuestion({...newQuestion, answerType: e.target.value})}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="formula">Formula</option>
                    <option value="linked">Linked Answer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newQuestion.isRequired}
                      onChange={(e) => setNewQuestion({...newQuestion, isRequired: e.target.checked})}
                    />
                    Required
                  </label>
                </div>
                <button type="submit" className="submit-btn">Add Question</button>
              </form>
            </div>
          )}

          <div className="questions-list">
            {questions.length === 0 ? (
              <div className="no-questions">
                <p>No questions added yet. Add your first question to get started!</p>
              </div>
            ) : (
              questions.map((question, index) => (
                <Question
                  key={question._id}
                  question={question}
                  onUpdate={handleUpdateQuestion}
                  onDelete={handleDeleteQuestion}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormBuilderPage;
