import React, { useEffect } from "react";
import BlogCard from "./BlogCard";
import { useBlog } from "../context/Blogcontext";

const LatestBlog = () => {
  const { all: blogs, allStatus, fetchAllBlogs } = useBlog();

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-700 sm:text-4xl mb-8 text-center">
          Latest Blogs
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {allStatus === "loading" && <p>Loading blogs...</p>}

          {allStatus === "failed" && (
            <p className="text-red-500">Failed to load blogs</p>
          )}
              {allStatus === "succeeded" &&
  blogs
    ?.slice(-4)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((blog) => (
      <BlogCard
        key={blog._id}
        id={blog._id}
        title={blog.title}
        image={blog.image.url}
        snippet={
          blog.description
            ? blog.description.length > 140
              ? blog.description
                  .replace(/<[^>]*>/g, "")
                  .slice(0, 140) + "..."
              : blog.description.replace(/<[^>]*>/g, "")
            : ""
        }
      />
    ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;