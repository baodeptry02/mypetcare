import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import {
  Box,
  Typography,
  useTheme,
  Button,
  IconButton,
  Pagination,
} from "@mui/material";
import { tokens } from "../../../../theme";
import Header from "../../../../Components/dashboardChart/Header";
import "react-datepicker/dist/react-datepicker.css";
import Alert from "@mui/material/Alert";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

const Dashboard = () => {
  return(
    <div>hello</div>
  )
};

export default Dashboard;
