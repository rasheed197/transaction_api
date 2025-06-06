import express from "express";

import {
  createTransaction,
  fetchTransactions,
  deleteTransaction,
  fetchTransactionSummary,
} from "../controllers/transactionsController.js";

const transactionsRouter = express.Router();

transactionsRouter.get("/list/:userId", fetchTransactions);
transactionsRouter.post("/create", createTransaction);
transactionsRouter.get("/summary/:userId", fetchTransactionSummary);
transactionsRouter.delete("/remove/:id", deleteTransaction);

export default transactionsRouter;
