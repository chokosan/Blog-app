import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBlog } from '../context/Blogcontext'

const Singleblog = () => {
  const { id } = useParams()
  const { current: blog, currentStatus, fetchSingleBlog } = useBlog()

  useEffect(() => {
    if (id) {
      fetchSingleBlog(id)
    }
  }, [id, fetchSingleBlog])

  if (currentStatus === 'loading' || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading blog...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {blog.image && (
          <img
            src={blog.image.url}
            alt={blog.title}
            className="w-full h-72 object-cover"
          />
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
            {blog.category && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                {blog.category}
              </span>
            )}
            {blog.author?.name && <span>By {blog.author.name}</span>}
            {blog.createdAt && <span>{new Date(blog.createdAt).toLocaleDateString()}</span>}
          </div>

          <div
            className="prose prose-lg max-w-full text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.description || "" }}
          />
        </div>
      </div>
    </div>
  )
}

export default Singleblog