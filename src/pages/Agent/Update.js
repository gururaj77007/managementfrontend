import React, { useState, useEffect } from "react";
import AgentList from "../../Components/Agent/create/AgentList";
import AgentDetails from "../../Components/Agent/create/AgentDetails";
import Sidebar from "../../Components/Home/Sidebar";

function Update() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [maxAgentListHeight, setMaxAgentListHeight] = useState("50vh"); // Initially set to half of the viewport height

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      setMaxAgentListHeight(`${windowHeight / 2}px`);
    };

    // Listen for window resize events to dynamically update the height
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize the height

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleAgentSelection = (event) => {
    console.log(event);
    const agentId = event;

    setSelectedAgent(agentId);
    console.log(selectedAgent);
  };

  return (
    <div className="vertical-layout  flex">
      <div className="flex-row">
        <div>
          <Sidebar />
        </div>
        <div className="flex-1 ml-28 h-2/3 w-screen border-2 ">
          <div
            className="p-4 mb-4"
            style={{
              maxHeight: maxAgentListHeight,
              overflowY: "scroll",
              borderRight: "1px solid #ccc", // Add border style
            }}
          >
            <AgentList onAgentSelect={handleAgentSelection} />
          </div>
        </div>
        <div className=" grow ml-28 h-1/3 w-screen  ">
          <div className=" mb-4">
            {selectedAgent !== null && (
              <AgentDetails
                agentId={selectedAgent}
                profileId={selectedAgent}
                style={{ borderLeft: "1px solid #ccc" }} // Add border style
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update;
