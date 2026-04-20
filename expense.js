// 🔒 Guard
let isAddingExpense = false;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const getBtn = document.getElementById("getExpenseBtn");

    if (addBtn) addBtn.addEventListener("click", addExpense);
    if (getBtn) getBtn.addEventListener("click", getExpense);
});

// ================= ADD EXPENSE =================
async function addExpense() {
    if (isAddingExpense) return;

    const btn = document.getElementById("addExpenseBtn");

    try {
        isAddingExpense = true;

        if (btn) {
            btn.disabled = true;
            btn.innerText = "Adding...";
        }

        const farmId = localStorage.getItem("farmId");

        if (!farmId) throw new Error("Farm missing");

        const date = document.getElementById("dDate")?.value;
        const desc = document.getElementById("desc")?.value;
        const amount = document.getElementById("amount")?.value;

        // ✅ Validation
        if (!date || !desc || !amount) {
            throw new Error("All fields are required");
        }

        const res = await fetch(`${BASE_URL}/expense`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                descriptionOfExpense: desc,
                amount: Number(amount),
                farm: { id: Number(farmId) }
            })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to add expense");
        }

        alert("Expense added successfully");

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isAddingExpense = false;

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Add Expense";
        }
    }
}

// ================= GET EXPENSE =================
async function getExpense() {
    const btn = document.getElementById("getExpenseBtn");

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Loading...";
        }

        const farmId = localStorage.getItem("farmId");

        if (!farmId) throw new Error("Farm missing");

        const from = document.getElementById("dFrom")?.value;
        const to = document.getElementById("dTo")?.value;

        if (!from || !to) {
            throw new Error("Select date range");
        }

        const url = `${BASE_URL}/expense/${farmId}/filter?from=${from}&to=${to}`;

        const res = await fetch(url);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Server error");
        }

        const data = await res.json();

        const table = document.getElementById("expenseTable");

        let html = `
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        `;

        if (data.length === 0) {
            html += `<tr><td colspan="3">No data found</td></tr>`;
        } else {
            data.forEach(d => {
                html += `
                    <tr>
                        <td>${d.date}</td>
                        <td>${d.descriptionOfExpense}</td>
                        <td>${d.amount}</td>
                    </tr>
                `;
            });
        }

        table.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Get Expense Data";
        }
    }
}