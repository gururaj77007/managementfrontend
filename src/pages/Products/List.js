import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const navigate = useNavigate();

  // State to keep track of selected product IDs
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  useEffect(() => {
    console.log(currentPage, itemsPerPage);
    // Fetch product data based on the current page
    axios
      .post(`http://localhost:3015/products`, {
        page: currentPage,
        limit: itemsPerPage,
      })
      .then((response) => {
        setProducts(response.data.docs);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.totalPages);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentPage]);

  // Function to handle pagination button clicks
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to toggle the selection of a product
  const toggleProductSelection = (productId) => {
    if (selectedProductIds.includes(productId)) {
      // Product is selected, so remove it from the selection
      setSelectedProductIds((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    } else {
      // Product is not selected, so add it to the selection
      setSelectedProductIds((prevSelected) => [...prevSelected, productId]);
    }
  };

  // Function to handle the "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedProductIds.length === products.length) {
      // All products are already selected, so clear the selection
      setSelectedProductIds([]);
    } else {
      // Not all products are selected, so select all
      setSelectedProductIds(products.map((product) => product._id));
    }
  };

  // Function to delete selected products
  const handleDeleteSelected = async () => {
    try {
      await axios.delete("http://localhost:3015/products", {
        data: { productIds: selectedProductIds },
      });

      // After deleting, refresh the product list and remove the deleted products
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => !selectedProductIds.includes(product._id)
        )
      );

      // Clear the selection
      setSelectedProductIds([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>

      {/* Product list */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={
              selectedProductIds.length === products.length &&
              products.length > 0
            }
            onChange={handleSelectAll}
          />
          <span className="ml-2">Select All</span>
        </label>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <li
            key={product._id}
            className="border p-4 rounded-lg shadow-md relative"
            onClick={() => navigate(`/Product/${product._id}`)}
          >
            <h3 className="text-lg font-semibold mb-2">
              {product.productName}
            </h3>
            <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="mt-2 h-36 object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent click on the product item
                toggleProductSelection(product._id);
              }}
              className={`${
                selectedProductIds.includes(product._id)
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white font-bold py-2 px-4 rounded mt-2 absolute top-2 right-2`}
            >
              {selectedProductIds.includes(product._id) ? "Deselect" : "Select"}
            </button>
          </li>
        ))}
      </ul>

      {/* Delete selected products button */}
      {selectedProductIds.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;
