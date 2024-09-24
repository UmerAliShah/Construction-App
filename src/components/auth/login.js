import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import apiClient, { setAuthToken } from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useApi from "../../hooks/useApi";
import loginImage from '../../assets/login.png'; // Assuming the image is in 'src/assets/'
import { login } from '../../redux/counterSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialValue = {
      email: "",
      password: "",
    };
    const handleChange = (key, value) => {
        setSubmitData({ ...submitData, [key]: value });
      };
    const [submitData, setSubmitData] = useState(initialValue);
    const { request, loading, error } = useApi((data) =>
        apiClient.post("/auth/login", data)
      );

      const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await request(submitData);
        if (result.status === 200) {
            setAuthToken(result?.data?.token);
            console.log(result, 'login')
            dispatch(
              login({
                token: result?.data?.token,
                userId: result?.data?.user._id,
                role: result?.data?.user.role,
                //active: result?.data?.active,
              })
            );
            navigate("/");
            //if (result.data.role === "foundation") {
            //  navigate("/dashboard");
            //} else if (result.data.role === "store") {
            //  navigate("/store/dashboard");
            //} else if (result.data.role === "admin") {
            //  navigate("/admin/dashboard");
            //}
        }
      };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side: Form Section */}
      <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center items-center p-8 relative">
        {/* Logos */}
        <div className="absolute top-4 left-4">
          <img src={logo} alt="Left Logo" className="h-12" />
        </div>

        {/* Welcome Text */}
        <h1 className="text-2xl font-bold text-gray-900 mt-12">Welcome Back</h1>
        <p className="text-gray-500 mb-6">Login into your account</p>

        {/* Form */}
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-orange-500" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-orange-500 hover:underline text-sm">
              Recover Password
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>

      {/* Right Side: Image Section */}
      <div className="hidden md:flex md:w-1/2">
        <img
          src={loginImage}
          alt="Login"
          className="object-cover w-full h-screen"
        />
      </div>
    </div>
  );
};

export default Login;
