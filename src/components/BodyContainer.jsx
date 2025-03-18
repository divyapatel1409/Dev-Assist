import React, { useState, useContext, useEffect } from "react";
import SidebarWrapper from "./SidebarWrapper";
import RequestResponsePanelWrapper from "./RequestResponsePanelWrapper";
import { FiMenu } from "react-icons/fi";
import AccountWrapper from "./AccountWrapper";
import { AuthContext } from "../context/AuthContext";
import RegexHelperWrapper from "./RegexHelperWrapper";
import {TabsConstants} from '../constants/Common'

const BodyContainer = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(TabsConstants.API_HELPER);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    setUser(null); // Clear user from context
  };

  const getComponent = () => {
    switch (activeTab) {
      case TabsConstants.ACCOUNT:
        return <AccountWrapper />;
      case TabsConstants.API_HELPER:
        return <RequestResponsePanelWrapper />;
      case TabsConstants.REGEX_HELPER:
        return <RegexHelperWrapper />;
      default:
        return <RegexHelperWrapper />;
    }
  }

  useEffect(() => {
    if (user) {
      setActiveTab(TabsConstants.API_HELPER);
    }
  }, [user]);

  return (
    <div className="flex flex-col h-screen text-black">
      <nav className="flex items-center justify-between bg-white h-12 px-4 border-b border-gray-300 shadow-sm">
        {/* Left: Sidebar Toggle Button + Tabs */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 hover:bg-gray-200 transition-all p-2 rounded-md"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === TabsConstants.API_HELPER
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TabsConstants.API_HELPER)}
            >
              API Helper
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === TabsConstants.REGEX_HELPER
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TabsConstants.REGEX_HELPER)}
            >
              Regex Helper
            </button>
          </div>
        </div>

        {/* Middle: Title (Header) */}
        <h1 className="text-md font-semibold tracking-wide text-gray-800 mx-auto">
          DevAssist
        </h1>

        {/* Right: User/Login Actions */}
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="font-medium text-sm text-gray-700">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="d-btn-small d-btn-secondary"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab(TabsConstants.ACCOUNT)}
              className="d-btn-small d-btn-primary"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Below Navbar */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        {isSidebarVisible && <SidebarWrapper activeTab={activeTab} />}

        {/* Main Content */}
        <div className="flex-1 w-full">
         {getComponent()}
        </div>
      </div>
    </div>
  );
};

export default BodyContainer;
