import express, { Request, Response } from "express";
import { fetchTokenDetails } from "./index.js";
import { configDotenv } from "dotenv";
import { execArgv } from "process";

configDotenv();

interface TokenRequestBody {
  address: string;
  chain: string;
  historical: boolean;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// API Route to fetch token details
app.post(
  "/api/token",
  async (
    req: Request<{}, {}, TokenRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      const { address, chain, historical } = req.body;

      if (!address || !chain) {
        res.status(400).json({ error: "Missing address or chain parameter" });
      }

      if (typeof historical === "undefined") {
        res.status(400).json({ error: "Missing historical parameter" });
      }
      const data = await fetchTokenDetails(address, chain, historical);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error fetching token data:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});