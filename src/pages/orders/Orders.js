import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../store/authcontext";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../../firebase/firebase-config";
import Modal from "react-modal";
import io from "socket.io-client";

const Orders = () => {
  const [orders, setOrders] = useState({ docs: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedzone, setselectedzone] = useState("A");

  const getZoneBackgroundColor = (zone) => {
    switch (zone) {
      case "A":
        return "pink";
      case "B":
        return "red";
      case "C":
        return "blue";
      case "D":
        return "yellow";
      default:
        return "";
    }
  };

  const [ordersPerPage] = useState(10);
  const [role, setRole] = useState(null);
  const [houseId, setHouseId] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoneModalOpen, setZoneIsModalOpen] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    zone: "",
  });
  console.log(modalFilters);
  const [selectedOrders, setSelectedOrders] = useState([]);
  console.log(selectedOrders);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate(
      `/orders/Live/${modalFilters.status}/${modalFilters.startDate}/${modalFilters.endDate}/${modalFilters.zone}`
    );
  };
  const updateOrdersZone = async () => {
    try {
      // Make an Axios request to update zones for selected orders
      const response = await axios.put("http://192.168.29.18:3021/updateZone", {
        zones: selectedzone, // Assuming an array of zones for each order
        orderIds: selectedOrders,
      });

      console.log(response.data); // Log the response if needed

      // Close the zone modal and reset selected orders
      setZoneIsModalOpen(false);
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error updating orders' zones:", error);
      // Handle the error as needed
    }
  };

  const captureLiveOrders = () => {
    console.log("Capturing live orders...");
    openModal();
  };

  const [filters, setFilters] = useState({
    HouseId:
      localStorage.getItem("role") === "master" || "admin"
        ? ""
        : localStorage.getItem("houseid"),
    startDate: "",
    endDate: "",
    status: "",
  });

  const handleModalFilterChange = (e) => {
    const { name, value } = e.target;
    setModalFilters({
      ...modalFilters,
      [name]: value,
    });
  };

  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchRole = async () => {
      console.log("useEffect");
      const user = await firebaseApp.currentUser;

      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          console.log(idTokenResult.claims.role);
          setHouseId(idTokenResult.claims.houseid);
          setRole(idTokenResult.claims.role);
          console.log("role set");
        });
      }
    };

    fetchRole();

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://192.168.29.18:3021/orders/house",
          {
            ...filters,
            page: currentPage,
            limit: ordersPerPage,
          }
        );

        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, [currentPage, filters]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter((id) => id !== orderId);
      } else {
        return [...prevSelected, orderId];
      }
    });
  };

  const selectAllOrders = () => {
    setSelectedOrders(orders.docs.map((order) => order._id));
  };

  const toggleCheckboxesVisibility = () => {
    setShowCheckboxes((prevVisibility) => !prevVisibility);
    setSelectedOrders([]);
  };

  return (
    <div className="p-4 ml-10">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Button to toggle visibility of selection checkboxes */}
      <button
        className="bg-purple-500 text-white py-2 px-4 rounded mb-4"
        onClick={toggleCheckboxesVisibility}
      >
        {showCheckboxes ? "Hide Selection" : "Show Selection"}
      </button>
      {selectedOrders.length > 0 && (
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded mb-4"
          onClick={() => {
            setZoneIsModalOpen(true);
          }}
        >
          "Update Zone"
        </button>
      )}

      <button
        className="bg-green-500 text-white py-2 px-4 rounded"
        onClick={captureLiveOrders}
      >
        Capture Live Orders
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Capture Live Orders"
      >
        <h2>Capture Live Orders</h2>

        <select
          className="border rounded px-2 py-1 mr-2"
          name="status"
          value={modalFilters.status}
          onChange={handleModalFilterChange}
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="inspected">Inspected</option>
          <option value="ready_to_be_shipped">Ready to be Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Order Dispatched">Order Dispatched</option>
        </select>
        <select
          className="border rounded px-2 py-1 mr-2"
          name="zone"
          value={modalFilters.zone}
          onChange={handleModalFilterChange}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <input
          type="date"
          name="startDate"
          className="border rounded px-2 py-1 mr-2"
          placeholder="Start Date"
          value={modalFilters.startDate}
          onChange={handleModalFilterChange}
        />

        <input
          type="date"
          name="endDate"
          className="border rounded px-2 py-1"
          placeholder="End Date"
          value={modalFilters.endDate}
          onChange={handleModalFilterChange}
        />

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          onClick={() => {
            console.log("Submitting captured live orders...");
            closeModal();
          }}
        >
          Submit
        </button>
      </Modal>
      <Modal
        isOpen={isZoneModalOpen}
        onRequestClose={() => {
          isZoneModalOpen(!isZoneModalOpen);
        }}
        contentLabel="Capture Live Orders"
      >
        <h2>Select Zone</h2>

        <select
          className="border rounded px-2 py-1 mr-2"
          name="status"
          value={selectedzone}
          onChange={(e) => {
            const { value } = e.target;
            setselectedzone(value);
          }}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          onClick={() => {
            setZoneIsModalOpen(!isZoneModalOpen);
            alert(selectedzone);
            updateOrdersZone();
            toggleCheckboxesVisibility();
          }}
        >
          Submit
        </button>
      </Modal>

      <div className="flex mb-4">
        <select
          className="border rounded px-2 py-1 mr-2"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="inspected">Inspected</option>
          <option value="ready_to_be_shipped">Ready to be Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Order Dispatched">Order Dispatched</option>
        </select>

        {authContext.role === "master" ? (
          <input
            type="text"
            name="HouseId"
            className="border rounded px-2 py-1 mr-2"
            placeholder="House ID"
            value={filters.HouseId}
            onChange={handleFilterChange}
          />
        ) : (
          <div className="text-gray-600">House ID: {authContext.houseid}</div>
        )}

        <input
          type="date"
          name="startDate"
          className="border rounded px-2 py-1 mr-2"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="endDate"
          className="border rounded px-2 py-1"
          placeholder="End Date"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
      </div>

      <table className="w-full">
        <thead>
          <tr>
            {showCheckboxes && (
              <th>
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.docs.length}
                  onChange={selectAllOrders}
                />
              </th>
            )}
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Zone</th>
          </tr>
        </thead>
        <tbody>
          {orders.docs &&
            orders.docs.map((order) => (
              <tr key={order._id}>
                {showCheckboxes && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleOrderSelection(order._id)}
                    />
                  </td>
                )}
                <td
                  className="text-xs"
                  onClick={() => navigate(`/orders/detail/${order._id}`)}
                >
                  {order._id}
                </td>
                <td>{order.userId}</td>
                <td>{order.status}</td>
                <td>{order.createdAt}</td>
                <td
                  style={{
                    backgroundColor: getZoneBackgroundColor(order.zone),
                  }}
                >
                  {order.zone}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

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

export default Orders;
