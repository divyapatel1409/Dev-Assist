import React from "react";
import Sidebar from "./Sidebar";
import {TabsConstants} from '../constants/Common'

const SidebarWrapper = ({activeTab}) => {
  return activeTab===TabsConstants.API_HELPER ?<Sidebar />:"";
};

export default SidebarWrapper;
