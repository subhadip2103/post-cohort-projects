import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

const TransactionContext = createContext();


export function TransactionContextProvider({ children }) {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem("transactions");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions])

    function addTransaction(tx) {
        setTransactions([...transactions, tx])
    }
    function deleteTransaction(id) {
        setTransactions(transactions.filter(txn => txn.id !== id))

    }

    return <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
        {children}
    </TransactionContext.Provider>
}

export function useTransactions() {
    return useContext(TransactionContext)

}