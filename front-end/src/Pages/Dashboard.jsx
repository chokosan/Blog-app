import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/Authcontext";
import { useBlog } from "../context/Blogcontext";
import { BLOG_CATEGORIES } from "../constants/categories";
import { Editor } from "@tinymce/tinymce-react";


const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const {
    items: blogs,
    status,
    createStatus,
    deleteStatus,
    error,
    fetchUserBlogs,
    createBlog,
    deleteBlog,
  } = useBlog();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserBlogs();
  }, [user, navigate, fetchUserBlogs]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }
    if (!formData.description || formData.description.replace(/<[^>]*>/g, "").trim().length === 0) {
      toast.error("Please write some content");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      await createBlog(data);
      toast.success("Blog created");
      setFormData({
        title: "",
        category: "",
        description: "",
        image: null,
      });
    } catch (err) {
      toast.error(err || "Failed to create blog");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await deleteBlog(id);
      toast.success("Blog deleted");
    } catch (err) {
      toast.error(err || "Failed to delete blog");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Your Blogs
        </h1>

        {/* Create Blog Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Write a new blog
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full p-2 border-2 border-gray-300 rounded outline-none"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border-2 border-gray-300 rounded outline-none bg-white"
              >
                <option value="" disabled>
                  Select category
                </option>
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog content
              </label>
             <Editor
  apiKey="04mcrzi9c2b6c20xnz3js3lp8oe8iulj5c24nbdpzqnyr28y"
  value={formData.description}
  onEditorChange={(content) =>
    setFormData((prev) => ({ ...prev, description: content }))
  }
  init={{
    height: 400,
    menubar: false,
    telemetry: false,
    plugins: [
      "advlist", "autolink", "lists", "link", "image",
      "charmap", "preview", "anchor", "searchreplace",
      "visualblocks", "code", "fullscreen",
      "insertdatetime", "media", "table", "wordcount"
    ],
    toolbar:
      "undo redo | formatselect | bold italic underline | \
       alignleft aligncenter alignright | \
       bullist numlist | link image | code",
  }}
/>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border-2 border-gray-300 rounded outline-none"
            />
            <button
              type="submit"
              disabled={createStatus === "loading"}
              className="bg-orange-500 px-4 py-2 rounded text-white hover:bg-amber-600 duration-300"
            >
              {createStatus === "loading" ? "Publishing..." : "Publish Blog"}
            </button>
          </form>
        </div>

        {/* User Blogs List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Your Blogs</h2>
            {status === "loading" && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>

          {blogs.length === 0 && status === "succeeded" && (
            <p className="text-gray-500">You haven't published any blogs yet.</p>
          )}

          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="flex flex-col sm:flex-row gap-4 border-b pb-4 last:border-b-0"
              >
                {blog.image && (
                  <img
                    src={blog.image.url}
                    alt={blog.title}
                    className="w-full sm:w-40 h-32 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {blog.category}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {blog.description}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => handleDelete(blog._id)}
                    disabled={deleteStatus === "loading"}
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {status === "failed" && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;