// 🔒 Guard
let isAddingSales = false;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addSalesBtn");
    const getBtn = document.getElementById("getSalesBtn");

    if (addBtn) addBtn.addEventListener("click", addSales);
    if (getBtn) getBtn.addEventListener("click", getSales);
});

// ================= ADD SALES =================
async function addSales() {
    if (isAddingSales) return;

    const btn = document.getElementById("addSalesBtn");

    try {
        isAddingSales = true;

        if (btn) {
            btn.disabled = true;
            btn.innerText = "Adding...";
        }

        const farmId = localStorage.getItem("farmId");
        if (!farmId) throw new Error("Farm missing");

        const date = document.getElementById("sDate")?.value;
        const trays = document.getElementById("sTrays")?.value;
        const rate = document.getElementById("rate")?.value;
        const payment = document.getElementById("payment")?.value;

        // ✅ Validation
        if (!date || !trays || !rate || !payment) {
            throw new Error("All fields are required");
        }

        const res = await fetch(`${BASE_URL}/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                numberOfTrays: Number(trays),
                rate: Number(rate),
                paymentMethod: payment,
                farm: { id: Number(farmId) }
            })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to add sales");
        }

        alert("Sales added successfully");

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isAddingSales = false;

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Add Sales";
        }
    }
}

// ================= GET SALES =================
async function getSales() {
    const btn = document.getElementById("getSalesBtn");

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Loading...";
        }

        const farmId = localStorage.getItem("farmId");
        if (!farmId) throw new Error("Farm ID not found");

        const from = document.getElementById("sFrom")?.value;
        const to = document.getElementById("sTo")?.value;

        if (!from || !to) {
            throw new Error("Select date range");
        }

        const url = `${BASE_URL}/sales/${farmId}/filter?from=${from}&to=${to}`;
        console.log("Fetching Sales:", url);

        const res = await fetch(url);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Server error");
        }

        const data = await res.json();

        const table = document.getElementById("salesTable");

        let html = `
            <tr>
                <th>Date</th>
                <th>Trays</th>
                <th>Rate</th>
                <th>Total Amount</th>
                <th>Payment</th>
            </tr>
        `;

        if (data.length === 0) {
            html += `<tr><td colspan="5">No data found</td></tr>`;
        } else {
            data.forEach(d => {
                html += `
                    <tr>
                        <td>${d.date}</td>
                        <td>${d.numberOfTrays ?? 0}</td>
                        <td>${d.rate ?? 0}</td>
                        <td>${d.totalAmount ?? (d.numberOfTrays * d.rate * 30)}</td>
                        <td>${d.paymentMethod ?? "-"}</td>
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
            btn.innerText = "Get Sales Data";
        }
    }
}