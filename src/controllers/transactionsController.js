import { sql } from "../config/db.js";

const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !category || !user_id || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category) 
            VALUES(${user_id}, ${title}, ${amount}, ${category}) RETURNING *
        `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
			SELECT * FROM transactions 
			WHERE user_id = ${userId}
			ORDER BY created_at DESC
		`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error fetching the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const response = await sql`
            DELETE FROM transactions 
            WHERE id = ${id} RETURNING *
        `;

    if (response.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchTransactionSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    // We use COALESE() because for new users, the amount will be undefined, it will be treated as 0.
    // So we don't get an error when doing SUM(amount)

    const balanceResult = await sql`
			SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions 
			WHERE user_id = ${userId}::varchar(255) 
		`;

    const incomeResult = await sql`
			SELECT COALESCE(SUM(amount), 0) AS income FROM transactions 
			WHERE user_id = ${userId}::varchar(255)  AND amount > 0
		`;

    const expensesResult = await sql`
			SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions 
			WHERE user_id = ${userId}::varchar(255)  AND amount < 0
		`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error fetching the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createTransaction,
  fetchTransactions,
  deleteTransaction,
  fetchTransactionSummary,
};
