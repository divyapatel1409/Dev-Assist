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
  const [requests, setRequests] = useState([]);
  const [activeRequestId, setActiveRequestId] = useState(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarVisible(false);
      } else if (!mobile && activeTab === TabsConstants.API_HELPER) {
        setIsSidebarVisible(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [activeTab]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleNewRequest = () => {
    if (requests.length >= 20) return;
    
    const newRequest = {
      id: `req-${Date.now()}`,
      method: 'GET',
      url: '',
      headers: [{ key: '', value: '', checked: false }],
      params: [{ key: '', value: '', checked: false }],
      body: '',
      isExpanded: true
    };
    
    setRequests([...requests, newRequest]);
    setActiveRequestId(newRequest.id);
    
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  const getComponent = () => {
    switch (activeTab) {
      case TabsConstants.ACCOUNT:
        return <AccountWrapper />;
      case TabsConstants.API_HELPER:
        return (
          <RequestResponsePanelWrapper 
            isSidebarVisible={isSidebarVisible}
            requests={requests}
            setRequests={setRequests}
            activeRequestId={activeRequestId}
            setActiveRequestId={setActiveRequestId}
            onNewRequest={handleNewRequest}
          />
        );
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
    if (isMobile && activeTab !== TabsConstants.API_HELPER && isSidebarVisible) {
      setIsSidebarVisible(false);
    }
  }, [activeTab, isMobile, isSidebarVisible]);

  return (
    <div className="flex flex-col h-screen text-black">
      <nav className="flex items-center justify-between bg-white h-12 px-4 border-b border-gray-300 shadow-sm">
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

        <h1 className="text-md font-semibold tracking-wide text-gray-800 mx-auto hidden sm:block">
          DevAssist
        </h1>

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

      <div className="flex flex-1 relative overflow-hidden">
        {activeTab === TabsConstants.API_HELPER && (
          <SidebarWrapper 
            activeTab={activeTab} 
            onNewRequest={handleNewRequest} 
            isSidebarVisible={isSidebarVisible}
            requests={requests}
          />
        )}

        <div className={`flex-1 w-full transition-all duration-300 ${isMobile && isSidebarVisible ? 'ml-0' : ''}`} style={{ overflow: 'hidden' }}>
          {getComponent()}
        </div>
      </div>
    </div>
  );
};

export default BodyContainer;