import React, { useEffect, useState } from "react";
import { auth, database } from "../../Components/firebase/firebase";
import { ref, get, onValue } from "firebase/database";
import { tokens } from "../../theme";

let updatedDataTeam = [];
export let mockDataTeam = [];
export let mockTransactions = [];
export let mockLineData = [
  {
    id: "User",
    color: tokens("dark").greenAccent[500],
    data: Array.from({ length: 12 }, (_, i) => ({
      x: (i + 1).toString(),
      y: 0,
    })),
  },
];

const getMockTransactions = () => {
  let transactions = [];
  mockDataTeam.forEach((user) => {
    for (const bookingId in user.bookings) {
      const booking = user.bookings[bookingId];
      transactions.push({
        bookingID: booking.bookingId,
        user: user.username,
        date: booking.date,
        status: booking.status,
        cost: booking.totalPaid || 0,
      });
    }
  });
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  return transactions;
};

const fetchUsers = () => {
  const usersRef = ref(database, "users");

  onValue(
    usersRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        updatedDataTeam = [];

        for (const userId in usersData) {
          if (usersData.hasOwnProperty(userId)) {
            const user = usersData[userId];
            const bookings = user.bookings || {};
            updatedDataTeam.push({
              id: userId,
              ...user,
              bookings: bookings,
            });
          }
        }

        mockDataTeam = updatedDataTeam;
        mockTransactions = getMockTransactions(); // Update mockTransactions after fetching users
        getMonthsRevenue();
      } else {
        console.log("No data available");
      }
    },
    (error) => {
      console.error("Error fetching data: ", error);
    }
  );
};

const getMonthsRevenue = () => {
  const currentYear = new Date().getFullYear();
  const monthlyTotals = Array(12).fill(0);

  updatedDataTeam.forEach((user) => {
    for (const bookingId in user.bookings) {
      if (user.bookings.hasOwnProperty(bookingId)) {
        const booking = user.bookings[bookingId];
        const bookingDate = new Date(booking.date);
        if (bookingDate.getFullYear() === currentYear) {
          const month = bookingDate.getMonth();
          const totalPaid = booking.totalPaid || 0;
          monthlyTotals[month] += totalPaid;
        }
      }
    }
  });
  mockLineData[0].data = monthlyTotals.map((total, index) => ({
    x: (index + 1).toString(),
    y: total.toString(),
  }));
  // Print the totalPaid for each month
  monthlyTotals.forEach((total, index) => {
    // console.log(`Month ${index + 1} = ${total}`);
  });
};

fetchUsers();

export const mockBarData = [];
export const mockDataContacts = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    age: 35,
    phone: "(665)121-5454",
    address: "0912 Won Street, Alabama, SY 10001",
    city: "New York",
    zipCode: "10001",
    registrarId: 123512,
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    age: 42,
    phone: "(421)314-2288",
    address: "1234 Main Street, New York, NY 10001",
    city: "New York",
    zipCode: "13151",
    registrarId: 123512,
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    age: 45,
    phone: "(422)982-6739",
    address: "3333 Want Blvd, Estanza, NAY 42125",
    city: "New York",
    zipCode: "87281",
    registrarId: 4132513,
  },
  {
    id: 4,
    name: "Anya Stark",
    email: "anyastark@gmail.com",
    age: 16,
    phone: "(921)425-6742",
    address: "1514 Main Street, New York, NY 22298",
    city: "New York",
    zipCode: "15551",
    registrarId: 123512,
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    email: "daenerystargaryen@gmail.com",
    age: 31,
    phone: "(421)445-1189",
    address: "11122 Welping Ave, Tenting, CD 21321",
    city: "Tenting",
    zipCode: "14215",
    registrarId: 123512,
  },
  {
    id: 6,
    name: "Ever Melisandre",
    email: "evermelisandre@gmail.com",
    age: 150,
    phone: "(232)545-6483",
    address: "1234 Canvile Street, Esvazark, NY 10001",
    city: "Esvazark",
    zipCode: "10001",
    registrarId: 123512,
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    email: "ferraraclifford@gmail.com",
    age: 44,
    phone: "(543)124-0123",
    address: "22215 Super Street, Everting, ZO 515234",
    city: "Evertin",
    zipCode: "51523",
    registrarId: 123512,
  },
  {
    id: 8,
    name: "Rossini Frances",
    email: "rossinifrances@gmail.com",
    age: 36,
    phone: "(222)444-5555",
    address: "4123 Ever Blvd, Wentington, AD 142213",
    city: "Esteras",
    zipCode: "44215",
    registrarId: 512315,
  },
  {
    id: 9,
    name: "Harvey Roxie",
    email: "harveyroxie@gmail.com",
    age: 65,
    phone: "(444)555-6239",
    address: "51234 Avery Street, Cantory, ND 212412",
    city: "Colunza",
    zipCode: "111234",
    registrarId: 928397,
  },
  {
    id: 10,
    name: "Enteri Redack",
    email: "enteriredack@gmail.com",
    age: 42,
    phone: "(222)444-5555",
    address: "4123 Easer Blvd, Wentington, AD 142213",
    city: "Esteras",
    zipCode: "44215",
    registrarId: 533215,
  },
  {
    id: 11,
    name: "Steve Goodman",
    email: "stevegoodmane@gmail.com",
    age: 11,
    phone: "(444)555-6239",
    address: "51234 Fiveton Street, CunFory, ND 212412",
    city: "Colunza",
    zipCode: "1234",
    registrarId: 92197,
  },
];

export const mockDataInvoices = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    cost: "21.24",
    phone: "(665)121-5454",
    date: "03/12/2022",
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    cost: "1.24",
    phone: "(421)314-2288",
    date: "06/15/2021",
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    cost: "11.24",
    phone: "(422)982-6739",
    date: "05/02/2022",
  },
  {
    id: 4,
    name: "Anya Stark",
    email: "anyastark@gmail.com",
    cost: "80.55",
    phone: "(921)425-6742",
    date: "03/21/2022",
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    email: "daenerystargaryen@gmail.com",
    cost: "1.24",
    phone: "(421)445-1189",
    date: "01/12/2021",
  },
  {
    id: 6,
    name: "Ever Melisandre",
    email: "evermelisandre@gmail.com",
    cost: "63.12",
    phone: "(232)545-6483",
    date: "11/02/2022",
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    email: "ferraraclifford@gmail.com",
    cost: "52.42",
    phone: "(543)124-0123",
    date: "02/11/2022",
  },
  {
    id: 8,
    name: "Rossini Frances",
    email: "rossinifrances@gmail.com",
    cost: "21.24",
    phone: "(222)444-5555",
    date: "05/02/2021",
  },
];

export const mockPieData = [
  {
    id: "hack",
    label: "hack",
    value: 239,
    color: "hsl(104, 70%, 50%)",
  },
  {
    id: "make",
    label: "make",
    value: 170,
    color: "hsl(162, 70%, 50%)",
  },
  {
    id: "go",
    label: "go",
    value: 322,
    color: "hsl(291, 70%, 50%)",
  },
  {
    id: "lisp",
    label: "lisp",
    value: 503,
    color: "hsl(229, 70%, 50%)",
  },
  {
    id: "scala",
    label: "scala",
    value: 584,
    color: "hsl(344, 70%, 50%)",
  },
];
