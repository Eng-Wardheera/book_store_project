// src/components/RevenueChart.jsx
import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useGetAllOrdersQuery } from '../../redux/features/orders/ordersApi';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const { data: orders = [] } = useGetAllOrdersQuery(); // Orders API
  const [filter, setFilter] = useState('monthly'); // Filter state: 'daily', 'weekly', 'monthly', or 'yearly'

  // Calculate revenue dynamically based on filter
  const { labels, revenue } = useMemo(() => {
    const revenueData = [];
    const labelsData = [];

    if (filter === 'daily') {
      // Group by days of the week
      const dailyRevenue = new Array(7).fill(0);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const day = orderDate.getDay(); // Day of the week (0 = Sunday)
        dailyRevenue[day] += order.totalPrice || 0;
      });
      return { labels: days, revenue: dailyRevenue };
    }

    if (filter === 'weekly') {
      // Group by weeks
      const weeklyRevenue = [];
      const weekLabels = [];
      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const weekNumber = getWeekNumber(orderDate);
        const weekIndex = weekLabels.indexOf(weekNumber);
        if (weekIndex === -1) {
          weekLabels.push(weekNumber);
          weeklyRevenue.push(order.totalPrice || 0);
        } else {
          weeklyRevenue[weekIndex] += order.totalPrice || 0;
        }
      });
      return { labels: weekLabels.map((w) => `Week ${w}`), revenue: weeklyRevenue };
    }

    if (filter === 'monthly') {
      // Group by months
      const monthlyRevenue = new Array(12).fill(0);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const month = orderDate.getMonth(); // Month index (0 = January)
        monthlyRevenue[month] += order.totalPrice || 0;
      });
      return { labels: months, revenue: monthlyRevenue };
    }

    if (filter === 'yearly') {
      // Group by years
      const yearlyRevenue = {};
      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const year = orderDate.getFullYear(); // Extract year
        yearlyRevenue[year] = (yearlyRevenue[year] || 0) + (order.totalPrice || 0);
      });
      const sortedYears = Object.keys(yearlyRevenue).sort(); // Sort years
      const revenues = sortedYears.map((year) => yearlyRevenue[year]);
      return { labels: sortedYears, revenue: revenues };
    }

    return { labels: [], revenue: [] };
  }, [orders, filter]);

  const data = {
    labels,
    datasets: [
      {
        label: `Revenue (${filter.charAt(0).toUpperCase() + filter.slice(1)})`,
        data: revenue,
        backgroundColor: 'rgba(34, 197, 94, 0.7)', 
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Revenue Chart (${filter.charAt(0).toUpperCase() + filter.slice(1)})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Helper function to calculate week number
  function getWeekNumber(d) {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayNum = date.getDay() || 7;
    date.setDate(date.getDate() + 4 - dayNum);
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Revenue Chart</h2>
      <div className="flex justify-center mb-4">
        {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 mx-1 text-sm rounded ${
              filter === type ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div className="hidden md:block">
        <Bar data={data} options={options} className="" />
      </div>
    </div>
  );
};

export default RevenueChart;
