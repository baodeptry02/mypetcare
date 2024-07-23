import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../../../theme";
import { mockTransactions, mockDataTeam } from "../../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import Header from "../../../../Components/dashboardChart/Header";
import StatBox from "../../../../Components/dashboardChart/StatBox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [dailyRevenueChange, setDailyRevenueChange] = useState("0%");
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTotalPaid = (date, type) => {
    let totalPaid = 0;
    let currentYear = new Date().getFullYear();

    mockDataTeam.forEach((user) => {
      for (const bookingId in user.bookings) {
        const booking = user.bookings[bookingId];

        if (!["Paid", "Checked-in", "Rated"].includes(booking.status)) continue;

        let inputStr = booking.bookingId;
        let strippedStr = inputStr.slice(2);
        let day = strippedStr.slice(0, 2);
        let month = strippedStr.slice(2, 4);
        let formattedDate = `${currentYear}-${month}-${day}`;

        let bookingTotalPaid = booking.totalPaid || 0;

        // if (booking.status === "Cancelled") {
        //   bookingTotalPaid *= 0.25;
        // }

        if (type === "date" && date === formattedDate) {
          totalPaid += bookingTotalPaid;
        }
      }
    });

    return totalPaid;
  };

  const getPreviousDay = () => {
    const currentDate = new Date();
    const previousDay = new Date(
      currentDate.setDate(currentDate.getDate() - 1)
    );
    const year = previousDay.getFullYear();
    const month = String(previousDay.getMonth() + 1).padStart(2, "0");
    const day = String(previousDay.getDate()).padStart(2, "0");
    return { year, month, day, previousDay: `${year}-${month}-${day}` };
  };

  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    return formatDate(date);
  };

  useEffect(() => {
    const updateRevenue = () => {
      const currentDate = getCurrentDate();
      if (isCustomDateSelected && selectedDate !== currentDate) {
        const totalPaidForSelectedDate = getTotalPaid(selectedDate, "date");
        setDailyRevenue(totalPaidForSelectedDate);
        return;
      }

      const previousDay = getPreviousDay();

      const totalPaidForDate = getTotalPaid(currentDate, "date");

      setDailyRevenue(totalPaidForDate);
    };

    updateRevenue();

    const intervalId = setInterval(updateRevenue, 1000);

    return () => clearInterval(intervalId);
  }, [isCustomDateSelected, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate === getCurrentDate()) {
        setIsCustomDateSelected(false);
      } else {
        setIsCustomDateSelected(true);
      }
    } else {
      setIsCustomDateSelected(false);
    }
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredTransactions = mockTransactions.filter(
    (transaction) =>
      formatTransactionDate(transaction.formattedDate) === selectedDate
  );

  const generatePDF = () => {
    const content = document.getElementById("dashboard-content");

    html2canvas(content).then((canvas) => {
      const dateNow = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const title = "Daily Report";
      const name = "Pet Health Care Center";
      const pageWidth = pdf.internal.pageSize.getWidth();
      const titleWidth =
        (pdf.getStringUnitWidth(title) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;

      pdf.setFontSize(22);
      pdf.setTextColor("red");
      pdf.text(name, 68, 16);

      pdf.setFontSize(18);
      pdf.text(title, titleX, 26);

      pdf.addImage(imgData, "PNG", 0, 40, pdfWidth, pdfHeight);

      pdf.line(
        10,
        45 + pdfHeight + 10,
        pdf.internal.pageSize.getWidth() - 10,
        45 + pdfHeight + 10
      );
      pdf.text("Detailed Transactions", 75, 155);
      const statusOrder = [
        "Paid",
        "Checked-in",
        "Rated",
        "Pending Payment",
        "Cancelled",
      ];

      const sortedTransactions = filteredTransactions.sort((a, b) => {
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });

      const transactionData = sortedTransactions.map((transaction) => [
        transaction.bookingID,
        transaction.user,
        transaction.time + " " + transaction.date,
        transaction.status,
        `${(transaction.cost * 1000).toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })} VND`,
      ]);

      const totalCost = sortedTransactions.reduce((sum, transaction) => {
        if (["Paid", "Checked-in", "Rated"].includes(transaction.status)) {
          return sum + transaction.cost * 1000;
        }
        return sum;
      }, 0);

      transactionData.push([
        {
          content: "Total",
          colSpan: 4,
          styles: { halign: "right", fontStyle: "bold" },
        },
        `${totalCost.toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })} VND`,
      ]);

      pdf.autoTable({
        startY: 40 + pdfHeight + 40,
        head: [["Booking ID", "User", "Time", "Status", "Cost"]],
        body: transactionData,
        columnStyles: { 0: { fontStyle: "bold" } },
        headStyles: { fillColor: colors.blueAccent[700], fontSize: 14 },
        bodyStyles: { fillColor: colors.grey[200], fontSize: 12 },
      });

      pdf.save(`Daily Report-${dateNow}.pdf`);
    });
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={generatePDF}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>
      <div className="date-filter-container">
        <h1>Filter by day:</h1>
        <input
          className="date-Filter-Revenue"
          type="date"
          onChange={handleDateChange}
          value={selectedDate}
        ></input>
      </div>
      {/* GRID & CHARTS */}
      <div id="dashboard-content">
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 12"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={`${(dailyRevenue * 1000).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })} VND`}
              subtitle="Daily Revenue"
              icon={
                <PointOfSaleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          {/* ROW 2 */}

          {/* ROW 3 */}

          <Box
            gridColumn="span 12"
            gridRow="span 3"
            backgroundColor={colors.primary[400]}
            overflow="auto"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p="15px"
              position="sticky"
              top="0"
              backgroundColor={colors.primary[400]}
            >
              <Typography
                color={colors.grey[100]}
                variant="h5"
                fontWeight="600"
              >
                Recent Transactions
              </Typography>
            </Box>
            {filteredTransactions.length === 0 ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p="180px"
              >
                <Typography
                  color={colors.grey[100]}
                  variant="h6"
                  fontWeight="700"
                  fontSize="20px"
                >
                  None transaction on {selectedDate}
                </Typography>
              </Box>
            ) : (
              filteredTransactions.map((transaction, i) => (
                <Box
                  key={`${transaction.bookingId}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box flex="1">
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                      fontSize={"2rem"}
                    >
                      {transaction.bookingID}
                    </Typography>
                    <Typography color={colors.grey[100]} fontSize={"2rem"}>
                      {transaction.user}
                    </Typography>
                  </Box>
                  <Box flex="1" textAlign="center">
                    <Typography color={colors.grey[100]} fontSize={"2rem"}>
                      {transaction.time + " " + transaction.date}
                    </Typography>
                  </Box>
                  <Box flex="1" textAlign="center">
                    <Typography
                      color={
                        transaction.status === "Checked-in"
                          ? colors.blueAccent[500]
                          : transaction.status === "Rated"
                          ? "yellow"
                          : transaction.status === "Pending Payment"
                          ? "rgb(255, 219, 194)"
                          : transaction.status === "Cancelled"
                          ? colors.redAccent[500]
                          : colors.greenAccent[500]
                      }
                      fontSize={"2rem"}
                    >
                      {transaction.status}
                    </Typography>
                  </Box>
                  <Box
                    flex=".5"
                    textAlign="center"
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 5px"
                    borderRadius="4px"
                    fontSize={"2rem"}
                  >
                    {`${(transaction.cost * 1000).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })} VND`}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default Dashboard;
