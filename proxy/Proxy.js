import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());


app.get("/api/debtors", async (req, res) => {
  const url = process.env.TARGET_URL || "http://nasiya.mxsoft.uz/demo_nasiya/hs/GPScontrol/apigps/getdebtors?page=1&count=500";
  const username = process.env.API_USERNAME || "api";
  const password = process.env.API_PASSWORD || "123";
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
