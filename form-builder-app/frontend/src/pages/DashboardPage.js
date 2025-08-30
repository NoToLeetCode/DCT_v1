import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formsAPI } from "../services/api";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFormData, setNewFormData] = useState({
    title: "",
    description: ""
  });
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await formsAPI.getAll();
      if (response.message) {
        setError(response.message);
      } else {
        setForms(response);
      }
    } catch (error) {
      setError("Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    try {
      const response = await formsAPI.create(newFormData);
      if (response._id) {
        setForms([response, ...forms]);
        setNewFormData({ title: "", description: "" });
        setShowCreateForm(false);
      }
    } catch (error) {
      setError("Failed to create form");
    }
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await formsAPI.delete(formId);
        setForms(forms.filter(form => form._id !== formId));
      } catch (error) {
        setError("Failed to delete form");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Form Builder Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-actions">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-form-btn"
          >
            {showCreateForm ? "Cancel" : "Create New Form"}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form-section">
            <h3>Create New Form</h3>
            <form onSubmit={handleCreateForm} className="create-form-form">
              <div className="form-group">
                <label htmlFor="title">Form Title</label>
                <input
                  type="text"
                  id="title"
                  value={newFormData.title}
                  onChange={(e) => setNewFormData({...newFormData, title: e.target.value})}
                  required
                  placeholder="Enter form title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newFormData.description}
                  onChange={(e) => setNewFormData({...newFormData, description: e.target.value})}
                  placeholder="Enter form description"
                  rows="3"
                />
              </div>
              <button type="submit" className="submit-btn">Create Form</button>
            </form>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="forms-grid">
          {forms.length === 0 ? (
            <div className="no-forms">
              <p>No forms created yet. Create your first form to get started!</p>
            </div>
          ) : (
            forms.map((form) => (
              <div key={form._id} className="form-card">
                <h3>{form.title}</h3>
                <p>{form.description || "No description"}</p>
                <div className="form-actions">
                  <Link to={`/form-builder/${form._id}`} className="edit-btn">
                    Edit Form
                  </Link>
                  <button 
                    onClick={() => handleDeleteForm(form._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                  <button className="view-responses-btn">
                    View Responses
                  </button>
                </div>
                <div className="form-meta">
                  <small>Created: {new Date(form.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
