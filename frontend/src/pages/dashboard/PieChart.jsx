import React from 'react'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFetchAllUsersQuery } from '../../redux/features/users/userApi';

// Register Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { data: users = [] } = useFetchAllUsersQuery();

  // Count admins and users
  const adminCount = users.filter((user) => user.role === 'Admin').length;
  const userCount = users.filter((user) => user.role === 'User').length;

  // Pie chart data
  const data = {
    labels: ['Admins', 'Users'],
    datasets: [
      {
        label: 'User Distribution',
        data: [adminCount, userCount],
        backgroundColor: ['#FF6384', '#36A2EB'], // Admin = Red, User = Blue
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div className="w-full h-full">
      {users.length > 0 ? (
        <Pie data={data} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-lg font-semibold">
          No Data Available
        </div>
      )}
    </div>
  );
};

export default PieChart;
