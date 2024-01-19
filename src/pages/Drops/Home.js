import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Home/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [dropsData, setDropsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchDropsData = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:3025/drops/get-all?page=${page}`
      );
      setDropsData(response.data.docs);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching drops data:", error);
    }
  };

  useEffect(() => {
    fetchDropsData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold m-4">Drops</h1>
      <div className="flex justify-end content-end">
        <div className="ml-auto p-5 relative">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              navigate("/drops/create");
            }}
          >
            Create Drops
          </button>
        </div>
      </div>

      <div className="flex-grow mt-5 ml-5 mr-32">
        {console.log(dropsData)}
        {dropsData.map((drop) => (
          <div
            key={drop._id}
            className="border p-3 mb-3 rounded"
            onClick={() => {
              navigate(`/drops/${drop._id}`);
            }}
          >
            <h3 className="text-xl font-semibold">{drop.dropsName}</h3>
            <p className="text-gray-500">{drop.dropToBeLive}</p>
            <p className="text-gray-500">{drop.resourceallocated.toString()}</p>
            <p className="text-gray-500">{drop._id}</p>

            {/* Additional information you want to display */}
          </div>
        ))}

        <div className="flex justify-center mt-5">
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
        </div>
      </div>
    </div>
  );
}

export default Home;
