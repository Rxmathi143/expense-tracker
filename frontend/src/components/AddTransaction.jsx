import { useEffect, useState } from "react";
import api from "../api/api";
import "./AddTransaction.css";

function AddTransaction({ onClose, onTransactionAdded, onLogout }) {
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchCategories();
  }, [onLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("transactions/", {
        title,
        amount,
        transaction_type: transactionType,
        category_id: Number(category),
        description,
        date,
      });
      onTransactionAdded();
      onClose();
    } catch (error) {
      console.error("Add transaction error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        onLogout();
        return;
      }

      const responseData = error.response?.data;

      if (responseData) {
        const firstError = Object.values(responseData)[0];

        if (Array.isArray(firstError)) {
          setError(firstError[0]);
        } else {
          setError(String(firstError));
        }
      } else {
        setError("Failed to add transaction.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="transaction-modal">
        <div className="modal-header">
          <div>
            <h2>Add Transaction</h2>
            <p>Record a new income or expense</p>
          </div>

          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              placeholder="e.g. Grocery shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label>Amount</label>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          {/* Type */}
          <div className="form-group">
            <label>Transaction Type</label>

            <div className="type-selection">
              <button
                type="button"
                className={
                  transactionType === "expense"
                    ? "type-option active-expense"
                    : "type-option"
                }
                onClick={() => setTransactionType("expense")}
              >
                Expense
              </button>

              <button
                type="button"
                className={
                  transactionType === "income"
                    ? "type-option active-income"
                    : "type-option"
                }
                onClick={() => setTransactionType("income")}
              >
                Income
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>

              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          {/* Error */}
          {error && <div className="form-error">{error}</div>}

          {/* Buttons */}
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
