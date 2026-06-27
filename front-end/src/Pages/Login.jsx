import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/Authcontext'

const Login = () => {

  const [formdata, setformdata] = useState({
    email: "",
    password: ""
  })
  const { login, status: authStatus } = useAuth()
  const navigate = useNavigate()

  const onChangehandler = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value })
  }

  const submithandler = async (e) => {
    e.preventDefault()

    try {
      const result = await login(formdata)
      toast.success(result.message || "Logged in")
      navigate('/')

    } catch (error) {
      toast.error(error || "Login failed")
    }
  }

  return (
    <div className='w-full bg-white py-12 mx-auto flex items-center justify-center'>
      <div className='w-full bg-white max-w-md p-5 mx-auto py-6 border-2 border-gray-200 shadow-md'>
        <h1 className='text-lg font-bold text-center text-gray-700'>
          Login into your account!
        </h1>

        <form onSubmit={submithandler} autoComplete="off" className='flex flex-col w-full mt-5 gap-5'>
          <input
            type="email"
            name="email"
            value={formdata.email}
            onChange={onChangehandler}
            placeholder="Your email"
            autoComplete="new-email"
            required
            className='w-full p-2 border-2 border-gray-300 rounded outline-none'
          />

          <input
            type="password"
            name="password"
            value={formdata.password}
            onChange={onChangehandler}
            placeholder="Your password"
            autoComplete="new-password"
            required
            className='w-full p-2 border-2 border-gray-300 rounded outline-none'
          />

          <button
            disabled={authStatus === "loading"}
            className='bg-orange-500 px-4 py-2 rounded hover:bg-amber-600 duration-300 hover:text-white'
          >
            {authStatus === "loading" ? "Signing in..." : "Signin"}
          </button>
        </form>

        <p className='text-center mt-2'>
          Don't have an account?
          <Link to='/register' className='text-blue-500 hover:text-blue-800 ml-1'>
            Register Here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login