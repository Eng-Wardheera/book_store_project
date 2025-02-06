import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Icons for visibility toggle

const AdminLogin = () => {
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const auth = response.data;
            
            if (auth.token) {
                localStorage.setItem('token', auth.token);
                localStorage.setItem('username', data.username); // Save username
                localStorage.setItem('profilePicture', auth.profilePicture); // Save profile picture URL
            
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('profilePicture'); // Remove profile picture
                    alert('Token has expired! Please login again.');
                    navigate('/');
                }, 3600 * 1000);
            }

            alert('Admin Login successful!');
            navigate('/dashboard');
        } catch (error) {
            setMessage('Please provide a valid email and password');
            console.error(error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <h2 className='text-xl font-semibold mb-4'>Admin Dashboard Login</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2'
                            htmlFor='username'
                        >
                            Username
                        </label>
                        <input
                            {...register('username', { required: true })}
                            type='text'
                            name='username'
                            id='username'
                            placeholder='username'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                    </div>
                    <div className='mb-4 relative'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2'
                            htmlFor='password'
                        >
                            Password
                        </label>
                        <input
                            {...register('password', { required: true })}
                            type={showPassword ? 'text' : 'password'} // Dynamically switch input type
                            name='password'
                            id='password'
                            placeholder='Password'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                        <button
                            type='button'
                            onClick={togglePasswordVisibility}
                            className='absolute right-3 top-9 text-gray-600 hover:text-gray-800'
                        >
                            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                        </button>
                    </div>
                    
                    {message && (
                        <p className='text-red-500 text-xs italic mb-3'>{message}</p>
                    )}
                    <div className='w-full'>
                        <button className='bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none'>
                            Login
                        </button>
                    </div>
                </form>

                <p className='mt-5 text-center text-gray-500 text-xs'>
                    ©2025 Book Store. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
