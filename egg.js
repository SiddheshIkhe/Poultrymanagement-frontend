// 🔒 Guards
let isAddingEgg = false;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addEggBtn");
    const getBtn = document.getElementById("getEggBtn");

    if (addBtn) addBtn.addEventListener("click", addEgg);
    if (getBtn) getBtn.addEventListener("click", getEgg);
});

// ================= ADD EGG =================
async function addEgg() {
    if (isAddingEgg) return;

    const btn = document.getElementById("addEggBtn");

    try {
        isAddingEgg = true;

        if (btn) {
            btn.disabled = true;
            btn.innerText = "Adding...";
        }

        const farmId = localStorage.getItem("farmId");

        if (!farmId) throw new Error("Farm missing");

        const date = document.getElementById("eDate")?.value;
        const trays = document.getElementById("trays")?.value;

        // ✅ Validation
        if (!date || !trays) {
            throw new Error("All fields are required");
        }

        const res = await fetch(`${BASE_URL}/egg-production`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                numberOfTrays: Number(trays),
                farm: { id: Number(farmId) }
            })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to add egg");
        }

        alert("Egg added successfully");

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isAddingEgg = false;

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Add Egg";
        }
    }
}

// ================= GET EGG =================
async function getEgg() {
    const btn = document.getElementById("getEggBtn");

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Loading...";
        }

        const farmId = localStorage.getItem("farmId");

        if (!farmId) {
            throw new Error("Farm ID not found");
        }

        const from = document.getElementById("eFrom")?.value;
        const to = document.getElementById("eTo")?.value;

        if (!from || !to) {
            throw new Error("Select date range");
        }

        const url = `${BASE_URL}/egg-production/${farmId}/filter?from=${from}&to=${to}`;

        console.log("Fetching Egg:", url);

        const res = await fetch(url);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Server error");
        }

        const data = await res.json();

        const table = document.getElementById("eggTable");

        let html = `
<tr>
    <th>Date</th>
    <th>Trays</th>
    <th>Total Eggs</th>
</tr>
`;

        if (data.length === 0) {
            html += `<tr><td colspan="3">No data found</td></tr>`;
        } else {
            data.forEach(d => {
                html += `
<tr>
    <td>${d.date}</td>
    <td>${d.numberOfTrays ?? 0}</td>
    <td>${d.totalEggs ?? (d.numberOfTrays * 30)}</td>
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
            btn.innerText = "Get Egg Data";
        }
    }
}