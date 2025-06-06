import express from "express";
import "dotenv/config";
import job from "./config/cron.js";

import connectDB from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRouter from "./routes/transactionsRoute.js";

const port = process.env.PORT || 5001;

const app = express();

// Run the cron job only when we're in production
if (process.env.NODE_ENV==="production") job.start();

// middleware
app.use(express.json()); // Without this middleware req.body will be undefined
app.use(ratelimiter);

app.use("/api/transactions", transactionsRouter);

app.get("/", (req, res) => {
  res.json("It's working");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server is up and running on PORT:", port);
  });
});
