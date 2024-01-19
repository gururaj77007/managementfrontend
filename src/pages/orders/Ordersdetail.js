import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, seterror] = useState(null);

  // Use the useParams hook to get the orderId from the URL
  const { orderId } = useParams();

  // Retrieve the order details from the server
  useEffect(() => {
    axios
      .get(`http://192.168.29.18:3021/orders/${orderId}`)
      .then((response) => {
        setOrder(response.data);
        setIsLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setIsLoading(false);
        seterror(error);
      });
  }, [orderId]);

  // Handle status update
  const handleStatusUpdate = () => {
    axios
      .put(`http://192.168.29.18:3021/orders/${orderId}`, { status: newStatus })
      .then((response) => {
        setOrder({ ...order, status: newStatus });
        console.log("Order status updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }
  if (error) {
    alert(error);
  }
  if (order) {
    return (
      <div className="container mx-auto p-4 flex">
        {/* Left side (order details) */}
        <div className="w-2/3 p-4">
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>
          <div className="mb-4">
            // <strong>User ID:</strong> {order.userId}
          </div>
          <div className="mb-4">
            <strong>Status:</strong> {order.status}
          </div>

          {/* Display address details */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
            <div>
              <strong>Full Name:</strong> {order.shippingAddress.fullName}
            </div>
            <div>
              <strong>Email:</strong> {order.shippingAddress.email}
            </div>
            <div>
              <strong>Phone Number:</strong> {order.shippingAddress.phoneNumber}
            </div>
            <div>
              <strong>Address Line 1:</strong>{" "}
              {order.shippingAddress.addressLine1}
            </div>
            <div>
              <strong>Address Line 2:</strong>{" "}
              {order.shippingAddress.addressLine2}
            </div>
            <div>
              <strong>City:</strong> {order.shippingAddress.city}
            </div>
            <div>
              <strong>State:</strong> {order.shippingAddress.state}
            </div>
            <div>
              <strong>Postal Code:</strong> {order.shippingAddress.postalCode}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Payment Details</h2>
            {order.paymentMethod && (
              <div>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </div>
            )}
            {order.paymentId && (
              <div>
                <strong>Payment ID:</strong>
                <div>
                  <strong>Razorpay Order ID:</strong>{" "}
                  {order.paymentId.razorpay_order_id}
                </div>
                <div>
                  <strong>Razorpay Payment ID:</strong>{" "}
                  {order.paymentId.razorpay_payment_id}
                </div>
                <div>
                  <strong>Razorpay Signature:</strong>{" "}
                  {order.paymentId.razorpay_signature}
                </div>
              </div>
            )}
          </div>

          <div className=" p-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="inspected">Inspected</option>
              <option value="ready_to_be_shipped">Ready to be Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
              <option value="Order Dispatched">Order Dispatched</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
            >
              Update Status
            </button>
          </div>
        </div>

        {/* Right side (product details) */}
        <div className="w-1/3 p-4 bg-gray-200">
          <h2 className="text-xl font-bold mb-2">Product Details</h2>
          <ul>
            {order.products.map((product, index) => (
              <li key={index}>
                <strong>Product Name:</strong> {product.product.productName}
                <br />
                <strong>Price:</strong> ₹{product.selectedVariant.price}
                <br />
                <strong>Selectedvariant:</strong> {product.selectedVariant.name}
                <br />
                <strong>Quantity:</strong> {product.quantity}
                <br />
                <strong>Discount:</strong> ₹{product.selectedVariant.discount}
                <br />
                <strong>GrandTotal:</strong>{" "}
                {product.selectedVariant.price * product.quantity -
                  product.selectedVariant.discount}
              </li>
            ))}
          </ul>
        </div>

        {/* Update status dropdown */}
      </div>
    );
  }
};

export default OrderDetailPage;
