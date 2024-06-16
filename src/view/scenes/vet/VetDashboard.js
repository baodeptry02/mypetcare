import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import Header from "../../Components/dashboardChart/Header";
import Sidebar from "../scenes/global/Sidebar";
const VetDashboard = () => {
  
 
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>
      <Sidebar isSidebar={isSidebar} />
      
     
    </Box>
  );
};

export default VetDashboard;
