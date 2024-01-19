import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Stopwatch from "../../Components/Drops/Stopwatch";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => <div className="loader">Loading...</div>;

function Detail() {
  const { dropId } = useParams();
  const [drop, setDrop] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Change this as needed
  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3025/drops/get-by-id/${dropId}`
        );
        setDrop(response.data);
        if (response.data.resourceallocated)
          fetchProducts(response.data.dropsName);
      } catch (error) {
        console.log(error.message);
        setError("Error fetching drop details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dropId]);

  useEffect(() => {
    if (currentPage !== 1) {
      fetchProducts(drop.dropsName);
    }
  }, [currentPage]);

  const fetchProducts = async (name) => {
    try {
      const productsResponse = await axios.get(
        `http://localhost:3025/drops/resourceallocation/get-all-with-pagination`,
        {
          params: {
            page: currentPage,
            limit: productsPerPage,
            collectionName: name,
          },
        }
      );
      console.log(productsResponse.data.docs);
      setProducts(productsResponse.data.docs);

      setCurrentPage(productsResponse.data.page);
      setTotalPages(productsResponse.data.totalPages);
    } catch (error) {
      console.error("Error fetching drops data:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleResourceAllocation = () => {
    setIsModalOpen(true);
  };

  const confirmResourceAllocation = async () => {
    try {
      setIsAllocating(true);

      const response = await axios.post(
        `http://localhost:3025/drops/resourceallocation/createCollection`,
        {
          collectionName: drop.dropsName,
          dropId: drop._id,
        }
      );

      console.log("Resource allocated successfully:", response.data);
      alert("Resource allocated successfully:");

      setDrop((prevDrop) => ({ ...prevDrop, resourceallocated: true }));
    } catch (error) {
      console.error("Error allocating resources:", error.message);
      alert(error.message);
    } finally {
      setIsAllocating(false);
      setIsModalOpen(false);
    }
  };
  const handleDeleteCollection = async () => {
    // Prompt the user for confirmation
    const confirmation = window.confirm(
      "Are you sure you want to delete the collection? Please enter '12345' to confirm."
    );

    // Check if the user confirmed and entered the correct value
    if (confirmation) {
      const userInput = prompt("To confirm, please enter '12345':");

      if (userInput === "12345") {
        try {
          const response = await axios.delete(
            `http://localhost:3025/drops/${drop.dropsName}/${drop._id}`
          );

          // You might want to update the UI or show a notification after successfully deleting the collection
          alert(response.data.message);
          window.location.reload();
        } catch (error) {
          console.error("Error deleting collection:", error);
          alert(error.response?.data?.error || "Error deleting collection");
        }
      } else {
        alert("Invalid input. Deletion canceled.");
      }
    } else {
      alert("Deletion canceled.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  async function goLiveRequest() {
    try {
      const url = `http://localhost:3025/resource/golive/${drop.dropsName}`;
      const payload = {
        dropid: drop._id,
      };

      const response = await axios.put(url, payload);

      // Handle the response here, if needed
      alert("Drop is live");
      console.log("Response:", response.data);
      window.location.reload();

      return response.data;
    } catch (error) {
      // Handle errors here
      console.error("Error making the API request:", error.message);
      throw error; // You might want to handle or propagate the error accordingly
    }
  }
  async function ExitLiveRequest() {
    try {
      const url = `http://localhost:3025/resource/exitlive/${drop.dropsName}`;
      const payload = {
        dropid: drop._id,
      };

      const response = await axios.put(url, payload);

      // Handle the response here, if needed
      alert("Drop is not live");
      console.log("Response:", response.data);
      window.location.reload();

      return response.data;
    } catch (error) {
      // Handle errors here
      console.error("Error making the API request:", error.message);
      throw error; // You might want to handle or propagate the error accordingly
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:3025/drops/resourceallocation/deleteProduct/${drop.dropsName}/${productId}`
      );

      // After deleting, refresh the product list and remove the deleted product
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Pagination

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center mt-8">Error: {error}</div>;
  }

  if (!drop) {
    return <div className="text-center mt-8">Drop not found</div>;
  }

  return (
    <div className=" h-screen  p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Drop Name: {drop.dropsName}</h2>
        <p className="text-gray-700">Drop To Be Live: {drop.dropToBeLive}</p>
      </div>
      <div className="flex flex-row">
        {drop.resourceallocated && (
          <div className="mx-24">
            <button
              onClick={() => {
                navigate(`/drops/${dropId}/${drop.dropsName}/create`);
              }}
              className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Product
            </button>
          </div>
        )}
        {!drop.resourceallocated && (
          <div className="mx-24">
            <button
              onClick={handleResourceAllocation}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Allocate Resources
            </button>
          </div>
        )}
        {drop.resourceallocated && (
          <div className="">
            <button
              onClick={handleDeleteCollection}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Collection
            </button>
          </div>
        )}
        {drop.resourceallocated ? (
          <>
            {drop.resourceallocated && !drop.islive ? (
              <div className="mx-24">
                <button
                  onClick={() => {
                    // Handle "Go Live" functionality here
                    goLiveRequest();
                  }}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Go Live
                </button>
              </div>
            ) : (
              <div className="mx-24">
                {" "}
                <button
                  onClick={() => {
                    // Handle "Go Live" functionality here
                    ExitLiveRequest();
                  }}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Exit Live
                </button>{" "}
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>

      {drop.dropToBeLive && !drop.islive && (
        <Stopwatch liveTimestamp={drop.dropToBeLive} />
      )}

      {/* Simple Modal for confirmation */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded-lg z-10">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to allocate resources?
            </p>
            <div className="flex justify-between">
              <button
                onClick={confirmResourceAllocation}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Display */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!drop.islive ? (
            <>
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border p-4 rounded-md relative"
                  onClick={() => {
                    navigate(
                      `/drops/${dropId}/${drop.dropsName}/${product._id}`
                    );
                  }}
                >
                  <h4 className="text-lg font-semibold">
                    {product.productName}
                  </h4>
                  <img
                    src={product.imageUrl[0]}
                    alt={product.name}
                    className="mt-2 h-32 object-cover"
                  />
                  <p className="mt-2 text-gray-700">{product.description}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click on the product item
                      handleDeleteProduct(product._id);
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 absolute top-2 right-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <div>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`mx-2 px-4 py-2 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700 hover:bg-blue-400"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p>Please visit the main product page when the drop is live.</p>
          )}
        </div>

        {/* Pagination */}
      </div>

      {/* Loading spinner */}
      {isAllocating && <LoadingSpinner />}
    </div>
  );
}

export default Detail;
