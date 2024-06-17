

const express = require("express");
const cors = require("cors");
const axios = require('axios');
const moment = require('moment-timezone');

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({});
});

app.get("/transactions", async (req, res) => {
  let taikhoanmb = "DUYBAO0312";
  let deviceIdCommon = "f1wegonh-mbib-0000-0000-2024052023591852";
  let sessionId = "2e8afe73-a5b6-4559-bb8c-9ec1a742f4f1";
  let sotaikhoanmb = "0000418530364";

  const fromDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
    .split("/")
    .join("/");

  const toDate = new Date()
    .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
    .split("/")
    .join("/");

  const time2 = moment().tz("Asia/Ho_Chi_Minh").format("YYYYMMDDHHmmssSS");

  const proxyUrl = 'http://localhost:5000'; // Địa chỉ của proxy CORS của bạn
const targetUrl = 'https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history';
const url = proxyUrl + '/' + targetUrl;
  const data = {
      accountNo: sotaikhoanmb,
      deviceIdCommon: deviceIdCommon,
      fromDate: fromDate,
      refNo: `${taikhoanmb}-${time2}`,
      sessionId: sessionId,
      toDate: toDate,
  };

  try {
    const response = await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Authorization': 'Basic QURNSU46QURNSU4=',
            'Connection': 'keep-alive',
            'Host': 'online.mbbank.com.vn',
            'Origin': 'https://online.mbbank.com.vn',
            'Referer': 'https://online.mbbank.com.vn/information-account/source-account',
            'sec-ch-ua': '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
            'DNT': '1',
            'Deviceid': deviceIdCommon,
            'RefNo': `${taikhoanmb}-${time2}`,
            'X-Request-Id': `${taikhoanmb}-${time2}`,
            'elastic-apm-traceparent': '00-88166d8e47d20c4f80ec12bcf81505f5-6b706d62d8ca3ab8-01'
        }
    });

    const transactionHistoryList = response.data.transactionHistoryList;
    const descriptions = transactionHistoryList.map(transaction => transaction.description);
    res.json(descriptions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching transactions' });
  }
});

app.listen(5000, () => {
  console.log("Server is running at port 5000");
});
