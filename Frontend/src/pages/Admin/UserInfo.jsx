import axios from "axios";
import { ArrowLeftCircleIcon, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UserInfo = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getUser = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/getUserById/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data.success) {
        const userData = response.data.user;

        setUser(userData);

        reset({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          address: userData.address || "",
          city: userData.city || "",
          zipCode: userData.zipCode || "",
          role: userData.role || "user",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const onSubmit = async (data) => {
    console.log("submit click");
    console.log(data);
    console.log("before axios");
    try {
      setIsLoading(true)
      const response = await axios.post(
        `http://localhost:3000/api/user/updateProfile/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );


      // console.log("after axios");
      console.log(response);

      if (response.data.success) {
        toast("User Updated SuccessFully")
        const userData = response.data.user;

        setUser(userData);

        reset({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          address: userData.address || "",
          city: userData.city || "",
          zipCode: userData.zipCode || "",
          role: userData.role || "user",
        });
      }
    } catch (error) {
      console.log(error.response);
      console.log(error);
      // console.log("Inside catch");
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="max-w-4xl mx-auto  text-sm ">
      <div>
        <button onClick={() => navigate(-1)}>
          <ArrowLeftCircleIcon

            className="text-amber-700 cursor-pointer " />
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6 flex gap-3 justify-between">

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <img
            src={
              user?.profilePic ||
              "https://ui-avatars.com/api/?name=User"
            }
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-amber-600 shadow-2xl"
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* First Name */}
          <div>
            <label className="font-medium">First Name</label>
            <input
              {...register("firstName")}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="font-medium">Last Name</label>
            <input
              {...register("lastName")}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium">Email</label>
            <input
              disabled
              {...register("email")}
              className="w-full border rounded-lg p-3 mt-1 bg-gray-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-medium">Phone Number</label>
            <input
              {...register("phoneNumber")}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          {/* Address */}
          <div>
            <label className="font-medium">Address</label>
            <input
              {...register("address")}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          {/* City */}
          <div>
            <label className="font-medium">City</label>
            <input
              {...register("city")}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="font-medium">Zip Code</label>
            <input
              {...register("zipCode")}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          {/* Role */}
          <div>
            <label className="font-medium">Role</label>

            <select
              {...register("role")}
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* User Id */}
          <div className="md:col-span-2">
            <label className="font-medium">User ID</label>
            <input
              value={user?._id || ""}
              disabled
              className="w-full border rounded-lg p-3 mt-1 bg-gray-100"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-amber-600 font-bold text-white px-6 py-3 rounded-lg hover:bg-amber-800"
            >
              {isLoading ? <Loader2 className="animate-spin"/> : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;