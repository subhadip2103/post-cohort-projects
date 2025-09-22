import { useTransactions } from "../context/TransactionContext"
import { Link } from "react-router-dom"

export function Dashboard() {
    const { transactions, deleteTransaction } = useTransactions();
    
    const totalIncome = transactions.filter(tx => tx.type === "Income");
    const totalExpenses = transactions.filter(tx => tx.type === "Expense");
    
    const totalIncomeValue = totalIncome.reduce(
        (acc, tx) => acc + Number(tx.amount),
        0
    );
    const totalExpensesValue = totalExpenses.reduce(
        (acc, tx) => acc + Number(tx.amount),
        0
    );

    const balance = totalIncomeValue - totalExpensesValue;

    return (
        <div className="dashboard">
            {/* Summary Cards */}
            <div className="summary">
                <div className="summary-card income-card">
                    <h3>Total Income</h3>
                    <div className="amount">₹{totalIncomeValue.toLocaleString()}</div>
                </div>
                <div className="summary-card expense-card">
                    <h3>Total Expenses</h3>
                    <div className="amount">₹{totalExpensesValue.toLocaleString()}</div>
                </div>
                <div className="summary-card balance-card">
                    <h3>Balance</h3>
                    <div className="amount">₹{balance.toLocaleString()}</div>
                </div>
            </div>

            {/* Transactions List */}
            {transactions.length === 0 ? (
                <div className="no-transactions">
                    <div className="no-transactions-icon">📊</div>
                    <h3>No transactions yet</h3>
                    <p>Start tracking your finances by adding your first transaction</p>
                    <Link to="/add" className="add-first-transaction">
                        Add Your First Transaction
                    </Link>
                </div>
            ) : (
                <div className="transactions-grid">
                    {transactions.map(tx => (
                        <div key={tx.id} className={`transaction-card ${tx.type.toLowerCase()}`}>
                            <div className="transaction-header">
                                <div className={`transaction-amount ${tx.type.toLowerCase()}`}>
                                    {tx.type === "Income" ? "+" : "-"}₹{Number(tx.amount).toLocaleString()}
                                </div>
                                <div className={`transaction-type ${tx.type.toLowerCase()}`}>
                                    {tx.type}
                                </div>
                            </div>
                            <div className="transaction-details">
                                <div className="transaction-detail">
                                    <span className="label">Category:</span>
                                    <span className="value">{tx.category}</span>
                                </div>
                                <div className="transaction-detail">
                                    <span className="label">Date:</span>
                                    <span className="value">
                                        {new Date(tx.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </span>
                                </div>
                                {tx.note && (
                                    <div className="transaction-detail">
                                        <span className="label">Note:</span>
                                        <span className="value">{tx.note}</span>
                                    </div>
                                )}
                            </div>
                            <button 
                                className="delete-btn" 
                                onClick={() => deleteTransaction(tx.id)}
                            >
                                Delete Transaction
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
