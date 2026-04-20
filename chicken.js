// 🔒 Guards
let isAddingChicken = false;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addChickenBtn");
    const getBtn = document.getElementById("getChickenBtn");

    if (addBtn) addBtn.addEventListener("click", addChicken);
    if (getBtn) getBtn.addEventListener("click", getChicken);
});

// ================= ADD CHICKEN =================
async function addChicken() {
    if (isAddingChicken) return;

    const btn = document.getElementById("addChickenBtn");

    try {
        isAddingChicken = true;

        if (btn) {
            btn.disabled = true;
            btn.innerText = "Adding...";
        }

        const farmId = localStorage.getItem("farmId");

        if (!farmId) throw new Error("Farm missing");

        const date = document.getElementById("date")?.value;
        const totalBirds = document.getElementById("totalBirds")?.value;
        const mortality = document.getElementById("mortality")?.value;

        // ✅ Validation
        if (!date || !totalBirds || !mortality) {
            throw new Error("All fields are required");
        }

        const res = await fetch(`${BASE_URL}/chicken-stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                totalBirds: Number(totalBirds),
                mortality: Number(mortality),
                farm: { id: Number(farmId) }
            })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to add chicken");
        }

        alert("Chicken added successfully");

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isAddingChicken = false;

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Add Chicken";
        }
    }
}

// ================= GET CHICKEN =================
async function getChicken() {
    const btn = document.getElementById("getChickenBtn");

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Loading...";
        }

        const farmId = localStorage.getItem("farmId");

        if (!farmId) throw new Error("Farm missing");

        const from = document.getElementById("from")?.value;
        const to = document.getElementById("to")?.value;

        if (!from || !to) {
            throw new Error("Select date range");
        }

        const url = `${BASE_URL}/chicken-stock/${farmId}/filter?from=${from}&to=${to}`;

        const res = await fetch(url);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Server error");
        }

        const data = await res.json();

        const table = document.getElementById("chickenTable");

        let html = "<tr><th>Date</th><th>Total Birds</th><th>Mortality</th></tr>";

        if (data.length === 0) {
            html += `<tr><td colspan="3">No data found</td></tr>`;
        } else {
            data.forEach(d => {
                html += `
                    <tr>
                        <td>${d.date}</td>
                        <td>${d.totalBirds}</td>
                        <td>${d.mortality}</td>
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
            btn.innerText = "Get Chicken Data";
        }
    }
}