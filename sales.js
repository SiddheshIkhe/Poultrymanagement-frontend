document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("addSalesBtn");
    if (btn) btn.addEventListener("click", addSales);
});

async function addSales() {
    try {
        const farmId = localStorage.getItem("farmId");

        await fetch(`${BASE_URL}/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: document.getElementById("sDate")?.value,
                numberOfTrays: document.getElementById("sTrays")?.value,
                rate: document.getElementById("rate")?.value,
                paymentMethod: document.getElementById("payment")?.value,
                farm: { id: Number(farmId) }
            })
        });

        alert("Sales added");

    } catch {
        alert("Error adding sales");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("getSalesBtn");
    if (btn) btn.addEventListener("click", getSales);
});
async function getSales() {
    try {
        const farmId = localStorage.getItem("farmId");

        if (!farmId) {
            alert("Farm ID not found");
            return;
        }

        const url = `${BASE_URL}/sales/${farmId}/filter?from=${sFrom.value}&to=${sTo.value}`;

        console.log("Fetching Sales:", url);

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Server error: " + res.status);
        }

        const data = await res.json();

        console.log("Sales Data:", data); // 🔥 DEBUG

        if (data.length === 0) {
            salesTable.innerHTML = "<tr><td colspan='5'>No data found</td></tr>";
            return;
        }

        let html = `
            <tr>
                <th>Date</th>
                <th>Trays</th>
                <th>Rate</th>
                <th>Total Amount</th>
                <th>Payment</th>
            </tr>
        `;

        data.forEach(d => {
            html += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.numberOfTrays ?? 0}</td>   <!-- ✅ FIX -->
                    <td>${d.rate ?? 0}</td>
                    <td>${d.totalAmount ?? (d.numberOfTrays * d.rate *30)}</td>
                    <td>${d.paymentMethod ?? "-"}</td>
                </tr>
            `;
        });

        salesTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching sales");
    }
}
