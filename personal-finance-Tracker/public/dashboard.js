document.getElementById("type-input").addEventListener("change", function () {
    const type = this.value;

    if (type === "income") {
        document.getElementById("income-category").style.display = "inline-block";
        document.getElementById("expense-category").style.display = "none";
    } else if (type === "expense") {
        document.getElementById("income-category").style.display = "none";
        document.getElementById("expense-category").style.display = "inline-block";
    }
});

async function addTransaction() {
    let title = document.getElementById('title-input').value;
    let amount = document.getElementById('amount-input').value;
    let type = document.getElementById('type-input').value;

    let category = (type === "income")
        ? document.getElementById('income-category').value
        : document.getElementById('expense-category').value;

    let token = localStorage.getItem("token");

    await axios.post("http://localhost:3000/transactions", {
        transaction: {
            title,
            amount,
            type,
            category
        }
    }, {
        headers: {
            Authorization: token
        }
    });

    alert("Transaction added successfully!");
    displayTransactions();
}
async function displayTransactions() {
    let token = localStorage.getItem("token");
    let response = await axios.get("http://localhost:3000/transactions", {
        headers: {
            Authorization: token
        }
    });

    console.log("Transaction response:", response.data); // 🐞 Debug line

    // Defensive fallback
    let transactions = response.data.Transaction;
    if (!Array.isArray(transactions)) {
        console.error("Expected an array, got:", transactions);
        return;
    }

    let container = document.querySelector(".transaction-display");
    container.innerHTML = "";

    transactions.forEach(txn => {
        const div = document.createElement("div");
        div.className = "transaction-card";
        div.innerHTML = `
            <p><strong>Title:</strong> ${txn.title}</p>
            <p><strong>Amount:</strong> ₹${txn.amount}</p>
            <p><strong>Type:</strong> ${txn.type}</p>
            <p><strong>Category:</strong> ${txn.category}</p>
            <p><strong>Date:</strong> ${txn.date}</p>
            <button onclick="deleteTransaction('${txn.id}')">Delete</button>
        `;
        container.appendChild(div);
    });
}
async function deleteTransaction(id) {
    let token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/transactions/${id}`, {
        headers: {
            Authorization: token
        }
    });
    displayTransactions();
}

// Optional: call this once on load
window.onload = () => {
    const token = localStorage.getItem("token");
    if (token) {
        displayTransactions();
    }
};
document.querySelector(".toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
