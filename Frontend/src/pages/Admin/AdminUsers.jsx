import axios from 'axios'
import { Edit, Edit2, Edit3, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {
  const [users, setUsers] = useState([])

  const navigate = useNavigate()

  const getAllUsers = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/user/allUsers",
        {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`

        },
      }
      )
      if (response.data.success) {
        setUsers(response.data.users)
      }
      console.log(response);

    } catch (error) {
      console.log(error.response);
      console.log(error);

    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])



  return (
    <>
    <div className='text-center '>
      <h1 className='text-2xl font-bold font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-800 to-amber-300 '>User Management</h1>
      <div className='flex justify-center items-center  py-2 '>
        <input type="text" 
        placeholder='Search....'
        className='bg-white border h-9 rounded-s-md focus:outline-none '/>
        <div className='bg-amber-600 p-2 rounded-e-md text-white'>
          <Search 
          size={19.5}
          className=' '/>
        </div>
      </div>
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-2">
        {users?.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition"
          >
            {/* User Image */}
            <div className="flex justify-center">
              <img
                src={
                  user.profilePic ||
                  "https://ui-avatars.com/api/?name=" +
                  `${user.firstName}+${user.lastName}`
                }
                alt={user.firstName}
                className="w-15 h-15 rounded-full object-cover border-2 border-gray-200"
              />
            </div>

            {/* User Details */}
            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h2>

              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => navigate(`/dashboard/users/${user._id}`)}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition flex justify-center items-center"
              >
                <Edit size={20}/>Edit
              </button>

              <button
                onClick={() => handleDelete(user._id)}
                className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </>
  )
}

export default AdminUsers
