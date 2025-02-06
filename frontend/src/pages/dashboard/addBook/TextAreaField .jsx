import React from 'react';

const TextAreaField = ({ label, name, register, placeholder, rows = 4 }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        {...register(name, { required: true })}
        rows={rows}
        className="p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

export default TextAreaField;
