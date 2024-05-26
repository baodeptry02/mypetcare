import React, { useEffect, useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

const TransactionHistory = () => {
  const { setDescriptions, setAmounts } = useContext(TransactionContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://oauth.casso.vn/v2/transactions', {
          method: 'GET',
          headers: {
            'Authorization': 'Apikey AK_CS.39242b10173211ef9e7e3bff706c3b3e.KHq0K9EzQdvg7X1sGXxowVyMA2sFU6FQfp0b6r3Fsgr5FLLDEx2qq2NJXOcAkrzXtCEgKeTs',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const descriptions = result.data.records.map(record => record.description);
        console.log(descriptions)
        const amounts = result.data.records.map(record => record.amount);
        console.log(amounts)
        setDescriptions(descriptions);
        setAmounts(amounts)
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [setDescriptions, setAmounts]);

  return null;
};

export default TransactionHistory;