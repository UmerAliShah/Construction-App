import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import apiClient, { setAuthToken } from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useApi from "../../hooks/useApi";
import loginImage from '../../assets/login.png';
import { login } from '../../redux/counterSlice';
import Toast from "../Toast";
import { DotLoader } from "react-spinners"; // Import DotLoader

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialValue = {
      email: "",
      password: "",
    };
    const [showToast, setShowToast] = useState(false);
    const [toastData, SetToastData] = useState({
        bg: null,
        message: null,
    });
    const [submitData, setSubmitData] = useState(initialValue);
    const [errorMessage, setErrorMessage] = useState(null);
    const { request, loading, error } = useApi((data) =>
        apiClient.post("/auth/login", data)
    );

    const handleChange = (key, value) => {
        setSubmitData({ ...submitData, [key]: value });
    };

    const showToastMessage = (message, bg) => {
        SetToastData({ message, bg });
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await request(submitData);
        if (result.status === 200) {
          showToastMessage("Login Successful", "bg-success");
          setTimeout(() => {
            setAuthToken(result?.data?.token);
            dispatch(
              login({
                token: result?.data?.token,
                userId: result?.data?.user._id,
                role: result?.data?.user.role,
              })
            );
            navigate("/");
          }, 500);
        } else if (result.status === 401) {
          showToastMessage("Invalid email or password", "bg-danger");
        }
    };

    return (
        <>
            {showToast && <Toast bg={toastData.bg} message={toastData.message} />}
            
            <div className="flex flex-col md:flex-row h-screen">
                {/* Left Side: Form Section */}
                <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center items-center p-8 relative">
                    {/* Logo */}
                    <div className="absolute top-4 left-4">
                        <img src={logo} alt="Left Logo" className="h-12" />
                    </div>

                    {/* Welcome Text */}
                    <h1 className="text-2xl font-bold text-gray-900 mt-12">Welcome Back</h1>
                    <p className="text-gray-500 mb-6">Login into your account</p>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-sm">
                            <p>{error}</p>
                        </div>
                    )}

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

                        {/* Button with Loader */}
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white p-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 flex justify-center items-center"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <DotLoader color="#fff" size={20} />
                            ) : (
                                "Log In"
                            )}
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
        </>
    );
};

export default Login;
