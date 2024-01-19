import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router

const Sidebar = () => {
  const [menuItems, setMenuItems] = useState([
    {
      title: "Agent",
      subItems: ["Create", "Update", "Delete", "Update"],
    },
    {
      title: "Orders",
      subItems: ["List", "Update"],
    },
    {
      title: "Shipping",
      subItems: ["Create", "Update"],
    },
    {
      title: "Drops",
      subItems: ["Home", "Update"],
    },
  ]);

  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (index) => {
    if (activeMenu === index) {
      setActiveMenu(null);
    } else {
      setActiveMenu(index);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full bg-gray-800 text-white p-4">
      <ul className="mt-20">
        {menuItems.map((menuItem, index) => (
          <li
            key={index}
            className="mb-2"
            onMouseEnter={() => toggleMenu(index)}
            onMouseLeave={() => toggleMenu(index)}
          >
            <span className="cursor-pointer">{menuItem.title}</span>

            {activeMenu === index && (
              <ul className="mt-2 pl-2 space-y-2">
                {menuItem.subItems.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    {/* Use Link to navigate to specific routes */}
                    <Link
                      to={`/${menuItem.title.toLowerCase()}/${subItem.toLowerCase()}`}
                    >
                      <span className="cursor-pointer">{subItem}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
