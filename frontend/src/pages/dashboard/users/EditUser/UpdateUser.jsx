import React, { useEffect, useState } from 'react';
import { useFetchUserByIdQuery } from '../../../../redux/features/users/userApi';
import axios from './../../../../../node_modules/axios/lib/axios';
import Loading from './../../../../components/Loading';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputField from './../../addBook/InputField';
import SelectField from './../../addBook/SelectField';
import getBaseUrl from './../../../../utils/baseURL';
import Swal from 'sweetalert2';

const UpdateUser = () => {
    const { id } = useParams();
    const { data: userData, isLoading, isError, refetch } = useFetchUserByIdQuery(id);
    const { register, handleSubmit, setValue } = useForm();
    const [imageFile, setImageFile] = useState(null);
    const [imageFileName, setImageFileName] = useState('');
    
  
    useEffect(() => {
      if (userData) {
        setValue('username', userData.username);
        setValue('password', userData.password);
        setValue('role', userData.role);
        setValue('userImage', userData.userImage);
      }
    }, [userData, setValue]);

    
  
    const onSubmit = async (data) => {
      try {
        const updateUserData = {
          username: data.username,
          password: data.password,
          role: data.role,
          userImage: data.userImage || bookData.userImage,
        };
  
        const response = await axios.put(
          `${getBaseUrl()}/api/auth/edit-user/${id}`,
          updateUserData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        if (response.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: 'User updated successfully!',
            icon: 'success',
          });
          refetch();
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to update the User.',
          icon: 'error',
        });
      }
    };
  
    if (isLoading) return <Loading />;
    if (isError) return <div>Error fetching book data</div>;

    const handleUserFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImageFile(file);
          setImageFileName(file.name);
        }
      };
  
  return (
  <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update User</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
         label="Username"
         name="username"
         type="text"
         placeholder="Enter username"
        register={register}
      />

        {/* Password */}
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter a password"
          register={register}
        />

        {/* Role */}
        <SelectField
          label="Role"
          name="role"
          options={[
            { value: '', label: 'Choose A Role' },
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
          ]}
          register={register}
        />

         {/* User Image Upload */}
         <InputField
          label="User Image URL"
          name="userImage"
          type="text"
          placeholder="Cover Image URL"
          register={register}
        />

        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">
          Update Book
        </button>
      </form>
    </div>
  )
}

export default UpdateUser