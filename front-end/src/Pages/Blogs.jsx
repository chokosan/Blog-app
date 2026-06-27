import React, { useEffect } from 'react'
import BlogCard from '../Components/BlogCard'
import { useBlog } from '../context/Blogcontext'

const Blogs = () => {
  const { all: blogs, allStatus, fetchAllBlogs } = useBlog()

  useEffect(() => {
    fetchAllBlogs()
  }, [fetchAllBlogs])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-800">
        <h1 className="text-4xl font-bold mb-3">Our Blogs</h1>
        <h1 className=' mb-3'>A place where ideas, stories, lessons, and experiences come together <br />shared thoughtfully, written honestly, and meant to inspire curiosity and reflection</h1>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {allStatus === 'loading' && (
          <p className="text-center text-gray-500">Loading blogs...</p>
        )}
        {allStatus === 'succeeded' && blogs.length === 0 && (
          <p className="text-center text-gray-500">No blogs found.</p>
        )}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
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
                        .slice(0, 140) + '...'
                    : blog.description.replace(/<[^>]*>/g, "")
                  : ''
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;