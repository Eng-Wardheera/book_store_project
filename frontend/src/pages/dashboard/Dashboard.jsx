import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md'
import RevenueChart from './RevenueChart';
import axios from './../../../node_modules/axios/lib/axios';
import { useFetchAllUsersQuery } from '../../redux/features/users/userApi';
import { getUserImgUrl } from '../../utils/getUserImgUrl';
import PieChart from './PieChart';
import { useGetAllOrdersQuery } from '../../redux/features/orders/ordersApi';
import { HiOutlineUser } from 'react-icons/hi';


const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [username, setUsername] = useState('');

    const [searchTerm, setSearchTerm] = useState("");

    const { data: users = [] } = useFetchAllUsersQuery();
    const { data: orders = [] } = useGetAllOrdersQuery();

    const [currentPage, setCurrentPage] = useState(1); // Default page is 1
    const itemsPerPage = 5; // Number of items per page

    const navigate = useNavigate();

    // Filter users by search term
    const filteredUsers = users.filter((user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter orders by search term
    const filteredUserOrders = orders.filter((order) =>
      order.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredUserOrders.length / itemsPerPage);

    // Calculate the current items to display
    const currentItems = filteredUserOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    useEffect(() => {
      // Check if token and username are available
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');

      if (!token || !storedUsername) {
          alert('Session expired! Please login again.');
          navigate('/');
      } else {
          setUsername(storedUsername); // Set username for display
      }
  }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =  await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })

                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData();
    }, []);

      // Tirinta guud ee `productIds`
  const totalProducts = useMemo(() => {
    return orders.reduce((count, order) => count + (order.productIds?.length || 0), 0);
  }, [orders]);

    // console.log(data)

    if(loading) return <Loading/>

  return (
    <>
    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
             <div className="flex items-center p-8 bg-white shadow rounded-lg">
               <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
               <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                 </svg>
               </div>
               <div>
                 <span className="block text-2xl font-bold">{data?.totalBooks}</span>
                 <span className="block text-gray-500">Products</span>
               </div>
             </div>
             <div className="flex items-center p-8 bg-white shadow rounded-lg">
               <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                 <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
               </div>
               <div>
                 <span className="block text-2xl font-bold">${data?.totalSales.toFixed(2)}</span>
                 <span className="block text-gray-500">Total Sales</span>
               </div>
             </div>

             <div className="flex items-center p-8 bg-white shadow rounded-lg">
               <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                 <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                 </svg>
               </div>

               <div>

                <span className="inline-block text-2xl font-bold">{totalProducts}</span>
                 {/* <span className="inline-block text-xl text-gray-500 font-semibold">(13%)</span> */}
                 <span className="block text-gray-500">Trending Books in This Month</span>
               </div>
             </div>

             <div className="flex items-center p-8 bg-white shadow rounded-lg">
               <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
               <MdIncompleteCircle className='size-6'/>
               </div>
               <div>
                 <span className="block text-2xl font-bold">{data?.totalOrders}</span>
                 <span className="block text-gray-500">Total Orders</span>
               </div>
             </div>
           </section>

           <section className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6">
             <div className="flex flex-col md:col-span-2 md:row-span-2 bg-white shadow rounded-lg">
               <div className="px-6 py-5 font-semibold border-b border-gray-100">The number of orders per month</div>
               <div className="p-4 flex-grow">
                 <div className="flex items-center justify-center h-full px-4 py-16 text-gray-400 text-3xl font-semibold bg-gray-100 border-2 border-gray-200 border-dashed rounded-md">
                 <RevenueChart />
                 </div>
               </div>
             </div>

           

             <div className="row-span-2 bg-white shadow rounded-lg">
               <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
                 {/* <span>Users by average order</span> */}
                 <button type="button" className="inline-flex justify-center rounded-md px-1 -mr-1 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-600" id="options-menu" aria-haspopup="true" aria-expanded="true">
                   Descending
                   <svg className="-mr-1 ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                 </button>
   
               </div>
              
               <div className="w-full xl:w-8/6 mb-12 xl:mb-0 px-2 mx-auto mt-2">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                  <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex justify-between items-center">
                      {/* <h3 className="font-semibold text-base text-blueGray-700">User List</h3> */}
                      <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-md px-3 py-1 text-sm text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
                    <ul className="p-6 space-y-6">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <li key={user._id} className="flex items-center">
                            <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                              <img
                                src={getUserImgUrl(`${user.userImage}`)}
                                alt={`${user.username}`}
                              />
                            </div>
                            <span className="text-gray-600">{user.username}</span>
                            <span className="ml-auto font-semibold">{user.role}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-600">No users found</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

             </div>

            {/* Orders */}
            <div className="row-span-2 bg-white shadow rounded-lg">
              <div className="flex justify-between px-6 py-5 font-semibold border-b border-gray-100">
                <span>Total Orders: {filteredUserOrders.length}</span>
              </div>
              <div className="w-full xl:w-8/6 mb-12 xl:mb-0 px-2 mx-auto mt-2">
                <div className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
                  <ul className="p-6 space-y-6">
                    {filteredUserOrders.slice(0, 3).map((order) => (
                      <li key={order._id} className="flex flex-col items-start">
                        <div className="flex items-center">
                          <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                            <HiOutlineUser className="size-9" />
                          </div>
                          <span className="text-gray-600 font-semibold">
                            {order.name}
                          </span>
                        </div>
                        <div className="text-gray-500 ml-12 text-sm">
                          Total Balance: ${order.totalPrice.toFixed(2)}
                        </div>
                        <div className="text-gray-500 ml-12 text-sm">
                          District: {order.address?.state || "Unknown"}
                        </div>
                        <div className="text-gray-500 ml-12 text-sm">
                          Date: {order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : "No Date"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>


     
           </section>
         
   </>
  )
}

export default Dashboard