import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useNavigate } from "react-router-dom";
import ShortUniqueId from "short-unique-id";

export function AddTransaction() {
    const uid = new ShortUniqueId({ length: 10 });
    const navigate = useNavigate();
    
    const { addTransaction } = useTransactions();
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("Income");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        
        if (!amount || !category || !date) {
            alert("Please fill in all required fields");
            return;
        }

        const newTx = {
            id: uid.rnd(),
            amount: parseFloat(amount),
            category,
            type,
            date,
            note
        }
        
        addTransaction(newTx);
        
        // Reset form
        setAmount("");
        setCategory("");
        setType("Income");
        setDate("");
        setNote("");
        
        // Navigate back to dashboard
        navigate("/");
    }

    return (
        <div className="add-transaction-container">
            <h1 className="form-title">Add New Transaction</h1>
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                    <label htmlFor="amount">Amount *</label>
                    <input 
                        type="number" 
                        id="amount"
                        className="form-input"
                        placeholder="Enter amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <input 
                        type="text" 
                        id="category"
                        className="form-input"
                        placeholder="e.g., Food, Transport, Salary" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select 
                        name="type" 
                        id="type" 
                        className="form-select"
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input 
                        type="date" 
                        id="date"
                        className="form-input"
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="note">Note (Optional)</label>
                    <input 
                        type="text" 
                        id="note"
                        className="form-input"
                        placeholder="Add a note..." 
                        value={note} 
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Add Transaction
                </button>
            </form>
        </div>
    )
}
