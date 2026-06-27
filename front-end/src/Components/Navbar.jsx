import React, { useState } from 'react'
import logo from '../assets/logo3.png'
import { Link } from 'react-router-dom'
import { useAuth } from "../context/Authcontext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="bg-white p-4 sticky top-0 z-50 shadow">
        <div className="flex mx-auto justify-between items-center">

          {/* Left: Logo */}
          <div className="flex gap-2 items-center">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <img src={logo} alt="logo" className="w-14 h-14" />
            </Link>
            <p className="text-2xl hidden sm:block">
              Insight <span className="font-bold">Hub</span>
            </p>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden sm:flex gap-7 text-xl text-gray-700">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <Link to="/blogs" className="hover:text-orange-500">Blogs</Link>
            <Link to="/about" className="hover:text-orange-500">About</Link>
            <Link to="/contact" className="hover:text-orange-500">Contact</Link>
          </ul>

          {/* Right Side (Desktop) */}
          <div className="hidden sm:flex gap-3 items-center">
            {user && (
              <Link
                to="/dashboard"
                className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-600"
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={() => logout()}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 text-white px-8 py-2 rounded-full hover:bg-amber-600"
              >
                Signin
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="sm:hidden text-3xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Slide Menu from RIGHT */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 flex flex-col gap-6">

          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl self-end mb-6"
          >
            ✕
          </button>

          {/* Menu Items without lines */}
          <nav className="flex flex-col text-lg text-gray-700 gap-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-orange-500"
            >
              Home
            </Link>

            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className="hover:text-orange-500"
            >
              Blogs
            </Link>

            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-orange-500"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="hover:text-orange-500"
            >
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="bg-gray-800 text-white py-2 rounded text-center mt-4"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={() => {
                logout()
                setMenuOpen(false)
              }}
              className="bg-red-500 text-white py-2 rounded mt-2"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-orange-500 text-white py-2 rounded text-center mt-2"
            >
              Signin
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar