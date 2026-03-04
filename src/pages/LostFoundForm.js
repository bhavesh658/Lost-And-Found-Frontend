import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LostFoundForm() {
  const navigate = useNavigate();

  // ================= INITIAL STATE =================
  const initialFormState = {
    title: "",
    description: "",
    category: "",
    type: "",
    location: "",
    date: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [image, setImage] = useState(null); // File ke liye
  const [preview, setPreview] = useState(null); // Preview dikhane ke liye
  const [loading, setLoading] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // Blob URL for preview
    }
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Image upload ke liye FormData zaroori hai
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("type", formData.type);
      data.append("location", formData.location);
      data.append("date", formData.date);
      if (image) {
        data.append("image", image); // Backend mein upload.single("image") se match hona chaiye
      }

      await axios.post(
        "https://lost-and-found-backend-3cak.onrender.com/api/items/create",
        data, // JSON ki jagah FormData bhej rahe hain
        {
          headers: {
            "Content-Type": "multipart/form-data", // Zaroori hai
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Item Submitted Successfully");
      setFormData(initialFormState);
      setPreview(null);
      setImage(null);
      navigate("/user-dashboard");

    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to submit item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg p-4 col-md-8 col-lg-6 mx-auto border-0 rounded-4">
        <h4 className="text-center mb-4 fw-bold">
          📦 Report Lost / Found Item
        </h4>

        <form onSubmit={handleSubmit}>
          <label className="fw-bold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="What did you lose/find?"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <label className="fw-bold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            placeholder="Tell us more (Color, Brand, etc.)"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <div className="row">
            <div className="col-md-6">
              <label className="fw-bold mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                placeholder="Mobile, Wallet..."
                className="form-control mb-3"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-bold mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                className="form-control mb-3"
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className="fw-bold mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                placeholder="Where was it?"
                className="form-control mb-3"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-bold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                className="form-control mb-3"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div className="mb-4">
            <label className="fw-bold mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="mt-3 text-center border rounded p-2">
                <p className="small text-muted mb-1">Image Preview:</p>
                <img 
                    src={preview} 
                    alt="Preview" 
                    className="img-fluid rounded" 
                    style={{ maxHeight: "200px" }} 
                />
              </div>
            )}
          </div>

          <button
            className="btn btn-primary w-100 fw-bold py-2 rounded-3 shadow-sm"
            disabled={loading}
            style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)", border: "none" }}
          >
            {loading ? "Submitting..." : "Submit Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LostFoundForm;