document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("addExpenseBtn");
    if (btn) btn.addEventListener("click", addExpense);
});

async function addExpense() {
    try {
        const farmId = localStorage.getItem("farmId");

        await fetch(`${BASE_URL}/expense`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: document.getElementById("dDate")?.value,
                descriptionOfExpense: document.getElementById("desc")?.value,
                amount: document.getElementById("amount")?.value,
                farm: { id: Number(farmId) }
            })
        });

        alert("Expense added");

    } catch {
        alert("Error adding expense");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("getExpenseBtn");
    if (btn) btn.addEventListener("click", getExpense);
});
async function getExpense() {
    try {
        const farmId = localStorage.getItem("farmId");

        const url = `${BASE_URL}/expense/${farmId}/filter?from=${dFrom.value}&to=${dTo.value}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Server error: " + res.status);

        const data = await res.json();

        if (data.length === 0) {
            expenseTable.innerHTML = "<tr><td colspan='3'>No data found</td></tr>";
            return;
        }

        let html = `
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        `;

        data.forEach(d => {
            html += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.descriptionOfExpense}</td>
                    <td>${d.amount}</td>
                </tr>
            `;
        });

        expenseTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching expense");
    }
}
