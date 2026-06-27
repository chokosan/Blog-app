import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from "../utils/api"
import { useAuth } from '../context/Authcontext'

const Signup = () => {

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  })

  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setloading] = useState(false)

  const onChangehandler = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value })
  }

  const filehandler = (e) => {
    setformdata({ ...formdata, image: e.target.files[0] })
  }

  const submithandler = async (e) => {
    e.preventDefault()

    try {
      const data = new FormData()
      data.append("name", formdata.name)
      data.append("email", formdata.email)
      data.append("password", formdata.password)
      data.append("image", formdata.image)

      setloading(true)

      const response = await api.post('/user/register', data)

      if (response.data.success) {
        toast.success(response.data.message)
        // backend register does not return token, so auto-login after signup
        await login({ email: formdata.email, password: formdata.password })
        navigate('/')
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || error)
    } finally {
      setloading(false)
    }
  }

  return (
    <div className='w-full bg-white py-12 mx-auto flex items-center justify-center'>
      <div className='w-full bg-white max-w-md p-5 mx-auto py-6 border-2 border-gray-200 shadow-md'>
        <h1 className='text-lg font-bold text-center text-gray-700'>
          Create your account!
        </h1>

        <form onSubmit={submithandler} autoComplete="off" className='flex flex-col w-full mt-5 gap-5'>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formdata.name}
            onChange={onChangehandler}
            autoComplete="new-name"
            required
            className='w-full p-2 border-2 border-gray-300 rounded outline-none'
          />

          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formdata.email}
            onChange={onChangehandler}
            autoComplete="new-email"
            required
            className='w-full p-2 border-2 border-gray-300 rounded outline-none'
          />

          <input
            type="password"
            name="password"
            placeholder="Your password"
            value={formdata.password}
            onChange={onChangehandler}
            autoComplete="new-password"
            required
            className='w-full p-2 border-2 border-gray-300 rounded outline-none'
          />

          <input
            type="file"
            accept="image/*"
            onChange={filehandler}
            required
            className='w-full p-2 border-2 border-gray-300 rounded outline-none'
          />

          <button
            disabled={loading}
            className='bg-orange-500 px-4 py-2 rounded hover:bg-amber-600 duration-300 hover:text-white'
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p className='text-center mt-2'>
          Already have an account?
          <Link to='/login' className='text-blue-500 hover:text-blue-800 ml-1'>
            Login Here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup