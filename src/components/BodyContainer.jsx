import React, { useState,useContext, useEffect } from "react";
import Sidebar from "./sidebar";
import RequestResponsePanelWrapper from "./RequestResponsePanelWrapper";
import { FiMenu } from "react-icons/fi";
import AccountWrapper from "./AccountWrapper";
import { AuthContext } from "../context/AuthContext";


const BodyContainer = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [accountFormVisible, setAccountFormVisible] = useState(false);
  const { user,setUser } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    setUser(null); // Clear user from context
  };

  useEffect(() => {
    if (user) {
      setAccountFormVisible(false);
    }
  }
  , [user]);

  return (
    <div className="flex flex-col h-screen text-black bg-gray-100">
      <nav className="flex items-center justify-between bg-white h-12 pr-4 border-b border-gray-300 shadow-sm">
      {/* Left: Sidebar Toggle Button */}
        <button 
          onClick={toggleSidebar} 
          className="text-gray-700 hover:bg-gray-200 transition-all p-2 rounded-md ml-0"
          >
          <FiMenu size={20} />
        </button>

        {/* Middle: Title */}
        <h1 className="text-md font-semibold tracking-wide text-gray-800">DevAssist</h1>

        {/* Right: User/Login Actions */}
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="font-medium text-sm text-gray-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
             onClick={() => setAccountFormVisible(true)} 
              className="bg-indigo-500 text-white hover:bg-indigo-600 px-3 py-1 rounded-md text-sm transition-all">
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Below Navbar */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        {isSidebarVisible && <Sidebar />}

        {/* Main Content */}
        <div className="flex-1 w-full">
          {accountFormVisible ?<AccountWrapper />: <RequestResponsePanelWrapper /> }
        </div>
      </div>
    </div>
  );
};

export default BodyContainer;
