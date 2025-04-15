import React, { useState, useEffect, useContext, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiClock,
  FiFolder,
  FiCode,
  FiHeart,
  FiChevronDown,
  FiEdit2,
  FiCheck,
} from "react-icons/fi";
import {
  getCollections,
  getCollectionWithRequests,
  createCollection,
  deleteCollection,
} from "../services/collectionService";
import {
  getEnvironments,
  updateEnvironment,
  deleteEnvironment,
} from "../services/envService";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  initialState,
  requestReducer,
} from "./requestPanelComponents/requestReducer";
import { useEnvironment } from "../context/EnvironmentContext";
import { toast } from "react-hot-toast";
import { getHistory } from "../services/historyService";
import { MdDelete } from "react-icons/md";

// PayPalDonation Component
const PayPalDonation = ({ isVisible, onClose }) => {
  const handleDonateClick = () => {
    // Redirect to your web donation page
    window.open("http://127.0.0.1:5500/index.html", "_blank");

    // Close the donation panel
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="bg-gray-50/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200 mx-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FiHeart className="text-rose-500" size={16} />
              <h4 className="text-sm font-medium text-gray-700">
                Support Development
              </h4>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Help us improve this tool with your contribution
          </p>
          <button
            onClick={handleDonateClick}
            className="w-full h-10 bg-[#0070ba] hover:bg-[#003087] text-white rounded flex items-center justify-center text-sm font-medium transition-colors"
          >
            Donate with PayPal
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ToggleButton Component
const ToggleButton = ({ option, selectedOption, handleOptionSelect }) => {
  const icons = {
    History: <FiClock size={16} className="opacity-70" />,
    Collection: <FiFolder size={16} className="opacity-70" />,
    Variable: <FiCode size={16} className="opacity-70" />,
  };

  return (
    <motion.button
      className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-medium rounded-lg transition-all duration-200 ${
        selectedOption === option
          ? "bg-gray-100 text-gray-900"
          : "text-gray-500 hover:bg-gray-50"
      }`}
      onClick={() => handleOptionSelect(option)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {icons[option]}
      <span>{option}</span>
    </motion.button>
  );
};

// ListItem Component
const ListItem = ({
  item,
  selectedOption,
  getMethodColor,
  onClick,
  onDelete,
}) => (
  <motion.div
    className="p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-150 mb-2 cursor-pointer group"
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -10 }}
    whileHover={{ translateX: 1 }}
    onClick={() => onClick(item)}
  >
    <div className="flex items-center justify-between">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-medium text-gray-800 text-sm truncate">
            {item.name || item.method}
          </h3>
          {selectedOption === "History" && (
            <span
              className={`px-2 py-1 text-[10px] font-medium rounded ${getMethodColor(
                item.method
              )}`}
            >
              {item.method}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate">
          {selectedOption === "History" && item.url}
          {selectedOption === "Collection" && item.description}
          {selectedOption === "Variable" && `Value: ${item.value}`}
        </p>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering onClick for the item
          onDelete();
        }}
        className="bg-gray-50 p-2 m-0 ml-3 cursor-pointer text-gray-400 opacity-100
             hover:bg-red-100 hover:text-red-600 transition-all duration-300 ease-in-out rounded-sm"
        title="Delete"
      >
        <MdDelete className="transition-transform duration-300 " />
      </button>
    </div>
  </motion.div>
);

const Sidebar = ({
  onNewRequest,
  isSidebarVisible,
  requests = [],
  onRequestClick,
}) => {
  const { user } = useContext(AuthContext);
  const {
    environments,
    selectedEnvironment,
    setSelectedEnvironment,
    refreshEnvironments,
  } = useEnvironment();
  const [selectedOption, setSelectedOption] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collectionRequests, setCollectionRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newEnvironmentName, setNewEnvironmentName] = useState("");
  const [environmentVariables, setEnvironmentVariables] = useState([
    { key: "", value: "" },
  ]);
  const [state, dispatch] = useReducer(requestReducer, initialState);
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!user) return;

      try {
        const response = await getCollections();
        if (response.success) {
          setCollections(response.data);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, [user]);

  useEffect(() => {
    const fetchCollectionRequests = async () => {
      if (!selectedCollection || !user) {
        setCollectionRequests([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getCollectionWithRequests(selectedCollection);
        if (response.success) {
          console.log(
            "response:",
            response,
            "response.data : ",
            response.data,
            "response.data.requests",
            response.data.requests
          );
          setCollectionRequests(response.data.requests);
        }
      } catch (error) {
        console.error("Error fetching collection requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollectionRequests();
  }, [selectedCollection, user]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedOption === "History" && user) {
        setIsHistoryLoading(true);
        try {
          const response = await getHistory();
          if (response.success) {
            setHistory(response.data);
          }
        } catch (error) {
          console.error("Error fetching history:", error);
        } finally {
          setIsHistoryLoading(false);
        }
      }
    };
    fetchHistory();
  }, [selectedOption, user]);

  const handleOptionSelect = (option) => {
    setSelectedOption(selectedOption === option ? "" : option);
    if (option !== "Collection") {
      setSelectedCollection("");
      setCollectionRequests([]);
    }
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-green-50 text-green-700",
      POST: "bg-blue-50 text-blue-700",
      PUT: "bg-amber-50 text-amber-700",
      DELETE: "bg-rose-50 text-rose-700",
    };
    return colors[method.toUpperCase()] || "bg-gray-50 text-gray-700";
  };

  const handleRequestClick = (request) => {
    if (onRequestClick) {
      onRequestClick(request);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    try {
      const response = await createCollection({
        name: newCollectionName.trim(),
      });
      if (response.success) {
        setCollections([...collections, response.data]);
        setNewCollectionName("");
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const handleEditVariable = (envId, varIndex) => {
    setEditingVar({ envId, varIndex });
  };

  const handleUpdateVariable = async (envId, varIndex, newKey, newValue) => {
    try {
      const env = environments.find((e) => e._id === envId);
      if (!env) return;

      const updatedVariables = [...env.variables];
      updatedVariables[varIndex] = { key: newKey, value: newValue };

      const response = await updateEnvironment(envId, {
        variables: updatedVariables,
      });

      if (response.success) {
        setEnvironments(
          environments.map((e) => (e._id === envId ? response.data : e))
        );
        setEditingVar(null);
      }
    } catch (error) {
      console.error("Error updating variable:", error);
    }
  };

  const handleDeleteVariable = async (envId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this environment and all its variables?"
      )
    ) {
      try {
        await deleteEnvironment(envId);
        refreshEnvironments(); // This will update the environments list
        toast.success("Environment deleted successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete environment"
        );
      }
    }
  };

  const sidebarVariants = {
    open: {
      width: isMobile ? "280px" : "300px",
      transition: { type: "spring", damping: 25 },
    },
    closed: { width: "0px", transition: { type: "spring", damping: 25 } },
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/request/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Refresh the lists based on current view
      if (selectedOption === "History") {
        const response = await getHistory();
        if (response.success) {
          setHistory(response.data);
        }
      } else if (selectedOption === "Collection" && selectedCollection) {
        const response = await getCollectionWithRequests(selectedCollection);
        if (response.success) {
          setCollectionRequests(response.data.requests);
        }
      }

      dispatch({
        type: "SET_SUCCESS",
        payload: "Request deleted successfully",
      });
      setTimeout(() => dispatch({ type: "CLEAR_SUCCESS" }), 3000);
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to delete request",
      });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
    }
  };

  const handleCreateEnvironment = async () => {
    if (!newEnvironmentName.trim()) {
      toast.error("Environment name is required");
      return;
    }

    try {
      const response = await createEnvironment({
        name: newEnvironmentName,
        variables: environmentVariables.filter((v) => v.key && v.value),
      });

      if (response.success) {
        toast.success("Environment created successfully");
        setNewEnvironmentName("");
        setEnvironmentVariables([{ key: "", value: "" }]);
        refreshEnvironments(); // Use the context's refresh function
      }
    } catch (error) {
      toast.error(error.message || "Failed to create environment");
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this collection and all its requests?"
      )
    ) {
      try {
        await deleteCollection(collectionId);
        // Refresh collections list
        const response = await getCollections();
        if (response.success) {
          setCollections(response.data);
          // If the deleted collection was selected, clear the selection
          if (selectedCollection === collectionId) {
            setSelectedCollection("");
            setCollectionRequests([]);
          }
        }
        toast.success("Collection deleted successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete collection"
        );
      }
    }
  };

  const renderEnvironmentVariables = () => {
    const selectedEnv = environments.find(
      (env) => env._id === selectedEnvironment
    );
    if (!selectedEnv) return null;

    return (
      <div className="space-y-2">
        {selectedEnv.variables.map((variable, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-700">
              {variable.key}
            </span>
            <span className="text-xs text-gray-500">{variable.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isSidebarVisible && (
          <motion.div
            className="h-full bg-white/95 backdrop-blur-sm border-r border-gray-100 flex flex-col overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-5 pb-4 border-b border-gray-100">
                <div className="flex justify-center mb-5">
                  <img
                    src="/images/DevAssist-Logo.png"
                    alt="Logo"
                    className="h-10 w-auto opacity-90"
                  />
                </div>

                <motion.button
                  onClick={() => requests.length < 20 && onNewRequest()}
                  className={`w-full py-2.5 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    requests.length >= 20
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  whileHover={requests.length < 20 ? { y: -1 } : {}}
                  whileTap={requests.length < 20 ? { scale: 0.98 } : {}}
                  disabled={requests.length >= 20}
                >
                  <FiPlus size={16} />
                  <span>New Request</span>
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col overflow-hidden p-4 pt-3">
                {/* Toggle Buttons */}
                <div className="flex gap-1.5 mb-4 bg-gray-50 p-1 rounded-lg">
                  {["History", "Collection", "Variable"].map((option) => (
                    <ToggleButton
                      key={option}
                      option={option}
                      selectedOption={selectedOption}
                      handleOptionSelect={handleOptionSelect}
                    />
                  ))}
                </div>

                {/* Collection Dropdown */}
                {selectedOption === "Collection" && (
                  <div className="space-y-3 mb-4">
                    {user ? (
                      <>
                        <div className="relative">
                          <select
                            value={selectedCollection}
                            onChange={(e) =>
                              setSelectedCollection(e.target.value)
                            }
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 appearance-none bg-white"
                          >
                            <option value="">Select Collection</option>
                            {collections.map((collection) => (
                              <option
                                key={collection._id}
                                value={collection._id}
                              >
                                {collection.name}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={14}
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="New collection name"
                            className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300"
                            value={newCollectionName}
                            onChange={(e) =>
                              setNewCollectionName(e.target.value)
                            }
                          />
                          <button
                            onClick={handleCreateCollection}
                            className="px-3 py-2 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        {selectedCollection && (
                          <button
                            onClick={() =>
                              handleDeleteCollection(selectedCollection)
                            }
                            className="w-full px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <FiX size={14} />
                            Delete Collection
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
                        Please login to access collections
                      </div>
                    )}
                    <FiChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={14}
                    />
                  </div>
                )}

                {/* Variable Section */}
                {selectedOption === "Variable" && (
                  <div className="space-y-3 mb-4">
                    {user ? (
                      environments.length > 0 ? (
                        <>
                          <div className="text-xs text-gray-400 mb-2 flex justify-between px-1">
                            <span>
                              {environments.reduce(
                                (total, env) => total + env.variables.length,
                                0
                              )}{" "}
                              variables
                            </span>
                          </div>
                          {environments.map((env) => (
                            <div key={env._id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xs font-medium text-gray-700">
                                  {env.name}
                                </h4>
                                <button
                                  onClick={() => handleDeleteVariable(env._id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                              {env.variables.map((variable, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-gray-700 truncate">
                                      {variable.key}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                      {variable.value}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </>
                      ) : (
                        <motion.div
                          className="flex flex-col items-center justify-center py-8 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <FiCode className="text-gray-400" size={18} />
                          </div>
                          <p className="text-gray-500 text-sm">
                            No variables created yet
                          </p>
                        </motion.div>
                      )
                    ) : (
                      <div className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
                        Please login to access variables
                      </div>
                    )}
                  </div>
                )}

                {/* Results */}
                <div className="text-xs text-gray-400 mb-2 flex justify-between px-1">
                  <span>
                    {selectedOption
                      ? selectedOption === "Collection" && selectedCollection
                        ? `${collectionRequests.length} requests`
                        : selectedOption === "Variable"
                        ? ""
                        : selectedOption === "History"
                        ? `${history.length} requests`
                        : `${selectedOption.toLowerCase()}`
                      : ""}
                  </span>
                  {selectedOption && selectedOption !== "Variable" && (
                    <span className="text-gray-400">{selectedOption}</span>
                  )}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  <AnimatePresence>
                    {selectedOption ? (
                      selectedOption === "Collection" ? (
                        !user ? (
                          <motion.div
                            className="flex flex-col items-center justify-center py-8 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                              <FiFolder className="text-gray-400" size={18} />
                            </div>
                            <p className="text-gray-500 text-sm">
                              Please login to view collections
                            </p>
                          </motion.div>
                        ) : isLoading ? (
                          <motion.div
                            className="flex flex-col items-center justify-center py-8 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mb-2"></div>
                            <p className="text-gray-500 text-sm">
                              Loading requests...
                            </p>
                          </motion.div>
                        ) : selectedCollection ? (
                          collectionRequests.length > 0 ? (
                            collectionRequests.map((request) => (
                              <ListItem
                                key={request._id}
                                item={request}
                                selectedOption={selectedOption}
                                getMethodColor={getMethodColor}
                                onClick={handleRequestClick}
                                onDelete={() => handleDelete(request._id)}
                              />
                            ))
                          ) : (
                            <motion.div
                              className="flex flex-col items-center justify-center py-8 text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <div className="bg-gray-100 p-3 rounded-full mb-3">
                                <FiFolder className="text-gray-400" size={18} />
                              </div>
                              <p className="text-gray-500 text-sm">
                                No requests in this collection
                              </p>
                            </motion.div>
                          )
                        ) : (
                          <motion.div
                            className="flex flex-col items-center justify-center py-8 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                              <FiFolder className="text-gray-400" size={18} />
                            </div>
                            <p className="text-gray-500 text-sm">
                              Select a collection
                            </p>
                          </motion.div>
                        )
                      ) : selectedOption === "History" ? (
                        !user ? (
                          <motion.div
                            className="flex flex-col items-center justify-center py-8 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                              <FiClock className="text-gray-400" size={18} />
                            </div>
                            <p className="text-gray-500 text-sm">
                              Please login to view history
                            </p>
                          </motion.div>
                        ) : isHistoryLoading ? (
                          <motion.div
                            className="flex flex-col items-center justify-center py-8 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mb-2"></div>
                            <p className="text-gray-500 text-sm">
                              Loading history...
                            </p>
                          </motion.div>
                        ) : history.length > 0 ? (
                          history.map((request) => (
                            <ListItem
                              key={request._id}
                              item={request}
                              selectedOption={selectedOption}
                              getMethodColor={getMethodColor}
                              onClick={handleRequestClick}
                              onDelete={() => handleDelete(request._id)}
                            />
                          ))
                        ) : (
                          <motion.div
                            className="flex flex-col items-center justify-center py-8 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                              <FiClock className="text-gray-400" size={18} />
                            </div>
                            <p className="text-gray-500 text-sm">
                              No history available
                            </p>
                          </motion.div>
                        )
                      ) : null
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>

              {/* Donation Panel */}
              <PayPalDonation
                isVisible={showDonation}
                onClose={() => setShowDonation(false)}
              />

              {/* Donation Toggle */}
              <div className="p-4 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowDonation(!showDonation)}
                  className={`w-full py-2 text-xs flex items-center justify-center gap-2 rounded-lg transition-colors ${
                    showDonation
                      ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FiHeart size={14} />
                  <span>Support Development</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Donation Button */}
      {!isSidebarVisible && (
        <motion.button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg z-10"
          onClick={() => setShowDonation(!showDonation)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <FiHeart size={18} />
        </motion.button>
      )}

      {/* Floating Donation Panel */}
      <AnimatePresence>
        {!isSidebarVisible && showDonation && (
          <motion.div
            className="fixed bottom-20 right-6 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <PayPalDonation
              isVisible={true}
              onClose={() => setShowDonation(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
