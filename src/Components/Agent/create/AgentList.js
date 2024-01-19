import React, { useEffect, useState } from "react";
import axios from "axios";

function AgentList({ onAgentSelect }) {
  // State to hold agent data and pagination information
  const [agents, setAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State to hold the maximum height
  const [maxHeight, setMaxHeight] = useState("300px"); // Default height for larger screens

  // Media query to change the maxHeight for smaller screens
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;

      // Set maxHeight based on the window height
      if (mediaQuery.matches) {
        setMaxHeight(`${windowHeight / 2}px`); // Half of the window height for smaller screens
      } else {
        setMaxHeight("300px"); // Default height for larger screens
      }
    };

    // Listen for window resize events to dynamically update the height
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize the height

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mediaQuery]);

  const handleAgentSelection = (event) => {
    console.log(event.target.value);
    onAgentSelect(event.target.value); // Pass the selected agent ID to the parent component
  };

  useEffect(() => {
    // Function to fetch agents from the API with pagination
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `http://192.168.29.18:3023/agent?page=${currentPage}&limit=10`
        ); // Replace with your API endpoint
        const { agents, totalPages } = response.data;
        console.log(agents);

        setAgents(agents);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents(); // Fetch agents when the component mounts or when currentPage changes
  }, [currentPage]);

  useEffect(() => {
    // Function to fetch agent roles from the API and add them to the agents
    const fetchAgentRoles = async () => {
      try {
        const agentRolesPromises = agents.map(async (agent) => {
          const response = await axios.get(
            `http://192.168.29.18:3023/agent/role/${agent.profileID}`
          ); // Replace with your API endpoint for agent roles
          return { ...agent, role: response.data.role };
        });

        const agentsWithRoles = await Promise.all(agentRolesPromises);
        setAgents(agentsWithRoles);
      } catch (error) {
        console.error("Error fetching agent roles:", error);
      }
    };

    if (agents.length > 0) {
      fetchAgentRoles();
    }
  }, [agents]);

  return (
    <div className="table-container">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Select
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent PhoneNumber
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent HouseId
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
          </tr>
        </thead>
        <tbody className={`max-h-${maxHeight} overflow-y-auto overflow-x-auto`}>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="radio"
                  name="selectedAgent"
                  value={agent.profileID}
                  onChange={handleAgentSelection}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {agent.profileID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {agent.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {agent.phonenumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {agent.houseID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {agent.role || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AgentList;
