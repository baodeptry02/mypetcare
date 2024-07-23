import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../../../theme";
import { mockDataTeam } from "../../../data/mockData";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import Header from "../../../../Components/dashboardChart/Header";
import StatBox from "../../../../Components/dashboardChart/StatBox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
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

  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTotalPaid = (date, type) => {
    let totalPaid = 0;

    mockDataTeam.forEach((user) => {
      for (const bookingId in user.bookings) {
        const booking = user.bookings[bookingId];

        if (!["Paid", "Checked-in", "Rated"].includes(booking.status)) continue;

        let inputStr = booking.bookingId;
        let strippedStr = inputStr.slice(2);
        let day = strippedStr.slice(0, 2);
        let month = strippedStr.slice(2, 4);
        let formattedDate = `${new Date().getFullYear()}-${month}-${day}`;

        let bookingTotalPaid = booking.totalPaid || 0;

        // if (booking.status === "Cancelled") {
        //   bookingTotalPaid *= 0.25;
        // }

        if (type === "month" && formattedDate.startsWith(date)) {
          totalPaid += bookingTotalPaid;
        } else if (type === "year" && formattedDate.startsWith(date)) {
          totalPaid += bookingTotalPaid;
        }
      }
    });

    return totalPaid;
  };

  useEffect(() => {
    const updateRevenue = () => {
      const currentMonth = `${selectedYear}-${String(selectedMonth).padStart(
        2,
        "0"
      )}`;
      const currentYear = selectedYear.toString();

      // Monthly Revenue
      const totalPaidForMonth = getTotalPaid(currentMonth, "month");
      setMonthlyRevenue(totalPaidForMonth);

      // Yearly Revenue
      const totalPaidForYear = getTotalPaid(currentYear, "year");
      setYearlyRevenue(totalPaidForYear);
    };

    updateRevenue();
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const getMonthlyRevenue = () => {
    const revenueByMonth = Array(12).fill(0);

    mockDataTeam.forEach((user) => {
      for (const bookingId in user.bookings) {
        const booking = user.bookings[bookingId];

        if (!["Paid", "Checked-in", "Rated"].includes(booking.status)) continue;

        let inputStr = booking.bookingId;
        let strippedStr = inputStr.slice(2);
        let day = strippedStr.slice(0, 2);
        let month = strippedStr.slice(2, 4);
        let formattedDate = `${new Date().getFullYear()}-${month}-${day}`;

        let bookingTotalPaid = booking.totalPaid || 0;

        if (formattedDate.startsWith(`${new Date().getFullYear()}-`)) {
          let monthIndex = parseInt(month) - 1; // Convert month to zero-based index
          revenueByMonth[monthIndex] += bookingTotalPaid;
        }
      }
    });

    return revenueByMonth;
  };
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
      const name = "Pet Health Care Center";
      const title = "Monthly and Yearly Report";
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

      const revenueByMonth = getMonthlyRevenue();
      const totalYearlyRevenue = revenueByMonth.reduce(
        (acc, curr) => acc + curr,
        0
      );
      pdf.setFontSize(18);
      pdf.text(`Revenue per month of ${selectedYear}`, 65, 90);
      // Add single-column table with monthly revenue values
      pdf.autoTable({
        startY: 60 + pdfHeight + 20, // Start Y position of the table
        head: [["Month", "Revenue"]], // Column headers
        body: [
          [
            "January",
            `${(revenueByMonth[0] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "February",
            `${(revenueByMonth[1] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "March",
            `${(revenueByMonth[2] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "April",
            `${(revenueByMonth[3] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "May",
            `${(revenueByMonth[4] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "June",
            `${(revenueByMonth[5] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "July",
            `${(revenueByMonth[6] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "August",
            `${(revenueByMonth[7] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "September",
            `${(revenueByMonth[8] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "October",
            `${(revenueByMonth[9] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "November",
            `${(revenueByMonth[10] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "December",
            `${(revenueByMonth[11] * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
          [
            "Total",
            `${(totalYearlyRevenue * 1000).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })} VND`,
          ],
        ],
        columnStyles: { 0: { fontStyle: "bold" } },
        headStyles: { fillColor: colors.blueAccent[700], fontSize: 14 },
        bodyStyles: { fillColor: colors.grey[200], fontSize: 12 },
      });

      pdf.save(`Year_Month Report-${dateNow}.pdf`);
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

      {/* GRID & CHARTS */}
      <div id="dashboard-content">
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
          mt="20px"
        >
          {/* MONTHLY REVENUE */}
          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Box position="absolute" left="10px">
              <Typography variant="h6" mb="10px">
                Select Month:
              </Typography>
              <select value={selectedMonth} onChange={handleMonthChange}>
                {[...Array(12).keys()].map((month) => (
                  <option key={month + 1} value={month + 1}>
                    {month + 1}
                  </option>
                ))}
              </select>
            </Box>
            <StatBox
              title={`${(monthlyRevenue * 1000).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })} VND`}
              subtitle="Monthly Revenue"
              icon={
                <PointOfSaleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          {/* YEARLY REVENUE */}
          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Box position="absolute" right="10px">
              <Typography variant="h6" mb="10px">
                Select Year:
              </Typography>
              <select value={selectedYear} onChange={handleYearChange}>
                {[...Array(10).keys()].map((year) => (
                  <option key={year + 2020} value={year + 2020}>
                    {year + 2020}
                  </option>
                ))}
              </select>
            </Box>
            <StatBox
              title={`${(yearlyRevenue * 1000).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })} VND`}
              subtitle="Yearly Revenue"
              icon={
                <PointOfSaleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default Dashboard;
