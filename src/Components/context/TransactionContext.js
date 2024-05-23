import React, { createContext, useState } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [descriptions, setDescriptions] = useState([]);
  const [times, setTimes] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://oauth.casso.vn/v2/transactions?pageSize=100', {
        method: 'GET',
        headers: {
          'Authorization': 'Apikey AK_CS.39242b10173211ef9e7e3bff706c3b3e.KHq0K9EzQdvg7X1sGXxowVyMA2sFU6FQfp0b6r3Fsgr5FLLDEx2qq2NJXOcAkrzXtCEgKeTs',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      const newDescriptions = result.data.records.map(record => record.description);
      const newTimes = result.data.records.map(record => record.when);
      console.log('Fetched descriptions:', newDescriptions);
      setDescriptions(newDescriptions);
      setTimes(newTimes);
      console.log(newDescriptions);
      console.log(newTimes);
  
      return { descriptions: newDescriptions, times: newTimes };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return { descriptions: [], times: [] }; // Ensure an object containing descriptions and times is returned
    }
  };

  return (
    <TransactionContext.Provider value={{ descriptions, times, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};