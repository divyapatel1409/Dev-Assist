import React, { useState, useContext, useEffect } from "react";
import SidebarWrapper from "./SidebarWrapper";
import RequestResponsePanelWrapper from "./RequestResponsePanelWrapper";
import { FiMenu } from "react-icons/fi";
import AccountWrapper from "./AccountWrapper";
import { AuthContext } from "../context/AuthContext";
import RegexHelperWrapper from "./RegexHelperWrapper";
import { TabsConstants } from '../constants/Common';

const BodyContainer = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(TabsConstants.API_HELPER);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile or tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-hide sidebar on mobile, auto-show on desktop
      if (mobile) {
        setIsSidebarVisible(false);
      } else if (!mobile && activeTab === TabsConstants.API_HELPER) {
        // Only auto-show sidebar when on API_HELPER tab and not on mobile
        setIsSidebarVisible(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [activeTab]); // Added activeTab as dependency

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    setUser(null); // Clear user from context
  };

  // Function to create a new request
  const handleNewRequest = () => {
    console.log("New request created");
    // You can add logic here to create a new request
    
    // Auto-hide sidebar on mobile after creating a new request
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  const getComponent = () => {
    switch (activeTab) {
      case TabsConstants.ACCOUNT:
        return <AccountWrapper />;
      case TabsConstants.API_HELPER:
        return <RequestResponsePanelWrapper isSidebarVisible={isSidebarVisible} />;
      case TabsConstants.REGEX_HELPER:
        return <RegexHelperWrapper />;
      default:
        return <RegexHelperWrapper />;
    }
  };

  useEffect(() => {
    if (user) {
      setActiveTab(TabsConstants.API_HELPER);
    }
  }, [user]);

  useEffect(() => {
    // Auto-hide sidebar when switching to non-API_HELPER tabs on mobile
    if (isMobile && activeTab !== TabsConstants.API_HELPER && isSidebarVisible) {
      setIsSidebarVisible(false);
    }
  }, [activeTab, isMobile, isSidebarVisible]);

  return (
    <div className="flex flex-col h-screen text-black">
      <nav className="flex items-center justify-between bg-white h-12 px-4 border-b border-gray-300 shadow-sm">
        {/* Left: Sidebar Toggle Button + Tabs */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 hover:bg-gray-200 transition-all p-2 rounded-md"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex border-b overflow-x-auto hide-scrollbar">
            <button
              className={`px-4 py-2 whitespace-nowrap ${
                activeTab === TabsConstants.API_HELPER
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TabsConstants.API_HELPER)}
            >
              API Helper
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap ${
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
        <h1 className="text-md font-semibold tracking-wide text-gray-800 mx-auto hidden sm:block">
          DevAssist
        </h1>

        {/* Right: User/Login Actions */}
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="font-medium text-sm text-gray-700 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="d-btn-small d-btn-secondary text-xs sm:text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab(TabsConstants.ACCOUNT)}
              className="d-btn-small d-btn-primary text-xs sm:text-sm"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Below Navbar */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar */}
        {activeTab === TabsConstants.API_HELPER && (
          <SidebarWrapper 
            activeTab={activeTab} 
            onNewRequest={handleNewRequest} 
            isSidebarVisible={isSidebarVisible} 
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 w-full transition-all duration-300 ${isMobile && isSidebarVisible ? 'ml-0' : ''}`}>
          {getComponent()}
        </div>
      </div>
    </div>
  );
};

export default BodyContainer;