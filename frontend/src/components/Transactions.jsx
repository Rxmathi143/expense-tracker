import { useEffect, useState } from "react";
import api from "../api/api";
import "./Transactions.css";
import EditTransaction from "./EditTransaction";

function Transactions({ onLogout, onTransactionChanged }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Categories error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        onLogout();
      }
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (search.trim()) {
        params.search = search;
      }

      if (type) {
        params.transaction_type = type;
      }

      if (category) {
        params.category = category;
      }

      const response = await api.get("transactions/");

      let filteredTransactions = response.data;

      if (search.trim()) {
        filteredTransactions = filteredTransactions.filter((transaction) =>
          transaction.title.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (type) {
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.transaction_type === type,
        );
      }

      if (category) {
        filteredTransactions = filteredTransactions.filter(
          (transaction) => String(transaction.category) === String(category),
        );
      }

      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Transactions error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        onLogout();
        return;
      }

      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [search, type, category]);

  const getCategoryName = (categoryId) => {
    const foundCategory = categories.find((item) => item.id === categoryId);

    return foundCategory ? foundCategory.name : "Unknown";
  };

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleDelete = async (transactionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`firestore/transactions/${transactionId}/`);

      await fetchTransactions();

      if (onTransactionChanged) {
        onTransactionChanged();
      }
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        onLogout();
        return;
      }

      alert("Failed to delete transaction.");
    }
  };

  const handleEditSuccess = async () => {
    setEditingTransaction(null);

    await fetchTransactions();

    if (onTransactionChanged) {
      onTransactionChanged();
    }
  };

  return (
    <div className="transactions-container">
      {/* =========================
                Filters
            ========================= */}

      <div className="transaction-filters">
        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>

          <option value="income">Income</option>

          <option value="expense">Expense</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* =========================
                Loading
            ========================= */}

      {loading && (
        <div className="transaction-message">Loading transactions...</div>
      )}

      {/* =========================
                Error
            ========================= */}

      {error && (
        <div className="transaction-message error-message">{error}</div>
      )}

      {/* =========================
                Table
            ========================= */}

      {!loading && !error && (
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-transactions">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const isIncome = transaction.transaction_type === "income";

                  return (
                    <tr key={transaction.id}>
                      {/* Date */}

                      <td>
                        <span className="transaction-date">
                          {transaction.date}
                        </span>
                      </td>

                      {/* Transaction */}

                      <td>
                        <div className="transaction-title">
                          <div
                            className={`transaction-icon ${
                              isIncome ? "income-icon" : "expense-icon"
                            }`}
                          >
                            {isIncome ? "↗" : "↘"}
                          </div>

                          <div className="transaction-text">
                            <strong>{transaction.title}</strong>

                            {transaction.description && (
                              <small>{transaction.description}</small>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}

                      <td>
                        <span className="category-badge">
                          {getCategoryName(transaction.category)}
                        </span>
                      </td>

                      {/* Type */}

                      <td>
                        <span
                          className={`type-badge ${
                            isIncome ? "income-badge" : "expense-badge"
                          }`}
                        >
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>

                      {/* Amount */}

                      <td>
                        <span
                          className={`transaction-amount ${
                            isIncome ? "income-amount" : "expense-amount"
                          }`}
                        >
                          {isIncome ? "+" : "-"}₹
                          {formatAmount(transaction.amount)}
                        </span>
                      </td>

                      {/* Actions */}

                      <td>
                        <div className="transaction-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => setEditingTransaction(transaction)}
                            aria-label="Edit transaction"
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleDelete(transaction.id)}
                            aria-label="Delete transaction"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================
                Edit Modal
            ========================= */}

      {editingTransaction && (
        <EditTransaction
          transaction={editingTransaction}
          categories={categories}
          onClose={() => setEditingTransaction(null)}
          onSuccess={handleEditSuccess}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}

export default Transactions;
