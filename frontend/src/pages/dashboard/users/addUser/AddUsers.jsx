import React, { useState } from 'react';
import InputField from './../../addBook/InputField';
import SelectField from './../../addBook/SelectField';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useAddUserMutation } from '../../../../redux/features/users/userApi';

const AddUsers = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [addUser, { isLoading, isError }] = useAddUserMutation();
  const [imageFileName, setImageFileName] = useState('');

  const onSubmit = async (data) => {
    // Prepare user data
    const newUserData = {
      ...data,
      userImage: imageFileName, // Add the image file name to the data
    };

    try {
      // Send data to the database
      await addUser(newUserData).unwrap();
      Swal.fire({
        title: 'User Added',
        text: 'Your user has been added successfully!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      reset();
      setImageFileName('');
      setImageFile(null);
    } catch (error) {
    //   Swal.fire({
    //     title: 'Error',
    //     text: 'Failed to add user. Please try again.',
    //     icon: 'error',
    //     confirmButtonColor: '#d33',
    //     confirmButtonText: 'OK',
    //   });
    console.log(error)
    }
  };

  const handleUserFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  };

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New User</h2>

      {/* Form starts here */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username */}
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
            { value: 'super-admin', label: 'Super Admin' },
          ]}
          register={register}
        />

        {/* User Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">User Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUserFileChange}
            className="mb-2 w-full"
          />
          {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-bold rounded-md"
        >
          {isLoading ? <span>Adding...</span> : <span>Add User</span>}
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
