import { useState } from "react";
import api from "../api/api";
import "./AddTransaction.css";

function EditTransaction({
  transaction,
  categories,
  onClose,
  onSuccess,
  onLogout,
}) {
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);

  const [transactionType, setTransactionType] = useState(
    transaction.transaction_type,
  );

  const [category, setCategory] = useState(String(transaction.category));

  const [description, setDescription] = useState(transaction.description || "");

  const [date, setDate] = useState(transaction.date);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.put(`transactions/${transaction.id}/`, {
        title,
        amount,
        transaction_type: transactionType,
        category_id: Number(category),
        description,
        date,
      });

      onSuccess();
    } catch (error) {
      console.error("Update error:", error);

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
        setError("Failed to update transaction.");
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
            <h2>Edit Transaction</h2>

            <p>Update your transaction details</p>
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
              {loading ? "Updating..." : "Update Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransaction;
