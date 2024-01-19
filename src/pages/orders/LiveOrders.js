// src/components/LiveOrders.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3021"); // Replace with your server URL

const LiveOrders = () => {
  const pp = useParams();
  const zone = "A";
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  console.log(pp);
  const [orders, setOrders] = useState([]);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // Connect to the socket on component mount
    socket.connect();

    // Listen for 'newOrder' and 'orderUpdate' events
    socket.on("newOrder", (newOrder) => {
      console.log(newOrder.zone);

      if (newOrder.zone === pp.zone) {
        alert("neworder");
        console.log(newOrder.zone);
        console.log(zone);
        setOrders((prevOrders) => [...prevOrders, newOrder]);
      }
    });

    socket.on("orderUpdate", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    // Fetch initial orders from the server
    // axios.get("http://localhost:3021/orders").then((response) => {
    //   setOrders(response.data);
    // });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Live Orders</h1>
      <table className="w-full">
        {/* Table headers */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Order Date</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td
                className="text-xs"
                onClick={() => navigate(`/orders/detail/${order._id}`)}
              >
                {order._id}
              </td>
              <td>{order.userId}</td>
              <td>{order.status}</td>
              <td>{order.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <ul className="flex justify-center mt-4">
        {Array.from({ length: orders.totalPages }).map((_, index) => (
          <li key={index}>
            <button
              onClick={() => paginate(index + 1)}
              className={`border px-3 py-1 ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveOrders;
