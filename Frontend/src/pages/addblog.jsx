import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddBlogPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    coverImage: null,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      coverImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    if (formData.coverImage) {
        formDataToSend.append("coverImage", formData.coverImage);
    }

    try {
        const response = await axios.post(
            "/api/v1/blogs/create",
            formDataToSend,
            { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Blog added successfully:", response.data);

        // ✅ No need for an extra API call, just navigate
        alert("Blog added successfully! Redirecting to home...");
        navigate("/");
    } catch (error) {
        setError(error.response?.data?.message || "Failed to add blog");
    }
};

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add a New Blog</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 dark:text-white">Blog Title</label>
              <input
                type="text"
                name="title"
                id="title"
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-900 dark:text-white">Blog Content</label>
              <textarea
                name="content"
                id="content"
                rows="5"
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-900 dark:text-white">Cover Image</label>
              <input
                type="file"
                name="coverImage"
                id="coverImage"
                accept="image/*"
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
              Publish Blog
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AddBlogPage; // ✅ Make sure this line exists!
