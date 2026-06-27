import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "../utils/api";

const BlogContext = createContext(null);

export const BlogProvider = ({ children }) => {
  // user-specific blogs (dashboard)
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); 

  // public blogs (listing)
  const [all, setAll] = useState([]);
  const [allStatus, setAllStatus] = useState("idle");

  // single blog (detail page)
  const [current, setCurrent] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("idle");

  const [error, setError] = useState(null);
  const [createStatus, setCreateStatus] = useState("idle");
  const [deleteStatus, setDeleteStatus] = useState("idle");

  // GET /blog/user/blogs (authenticated)
  const fetchUserBlogs = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.get("/blog/user/blogs");
      setItems(res.data || []);
      setStatus("succeeded");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to load blogs";
      setStatus("failed");
      setError(message);
    }
  }, []);

  // GET /blog/all (public)
  const fetchAllBlogs = useCallback(async () => {
    setAllStatus("loading");
    setError(null);
    try {
      const res = await api.get("/blog/all");
      setAll(res.data.blogs || []);
      setAllStatus("succeeded");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to load blogs";
      setAllStatus("failed");
      setError(message);
    }
  }, []);

  // GET /blog/:id (public)
  const fetchSingleBlog = useCallback(async (id) => {
    setCurrentStatus("loading");
    setError(null);
    try {
      const res = await api.get(`/blog/${id}`);
      setCurrent(res.data.singleblog || null);
      setCurrentStatus("succeeded");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to load blog";
      setCurrentStatus("failed");
      setError(message);
    }
  }, []);

  // POST /blog/create (multipart/form-data)
  const createBlog = useCallback(async (formData) => {
    setCreateStatus("loading");
    setError(null);
    try {
      const res = await api.post("/blog/create", formData);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create blog");
      }
      const blog = res.data.blog;
      setItems((prev) => [blog, ...prev]);
      setAll((prev) => [blog, ...prev]);
      setCreateStatus("succeeded");
      return blog;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to create blog";
      setCreateStatus("failed");
      setError(message);
      throw message; 
    }
  }, []);

  // DELETE /blog/delete/:id
  const deleteBlog = useCallback(async (id) => {
    setDeleteStatus("loading");
    setError(null);
    try {
      const res = await api.delete(`/blog/delete/${id}`);
      if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to delete blog");
      }
      setItems((prev) => prev.filter((b) => b._id !== id));
      setAll((prev) => prev.filter((b) => b._id !== id));
      setDeleteStatus("succeeded");
      return id;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to delete blog";
      setDeleteStatus("failed");
      setError(message);
      throw message;
    }
  }, []);

  const value = {
    items,
    status,
    all,
    allStatus,
    current,
    currentStatus,
    error,
    createStatus,
    deleteStatus,
    fetchUserBlogs,
    fetchAllBlogs,
    fetchSingleBlog,
    createBlog,
    deleteBlog,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used within a BlogProvider");
  return ctx;
};