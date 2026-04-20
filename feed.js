// 🔒 Guard
let isAddingFeed = false;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addFeedBtn");
    const getBtn = document.getElementById("getFeedBtn");

    if (addBtn) addBtn.addEventListener("click", addFeed);
    if (getBtn) getBtn.addEventListener("click", getFeed);
});

// ================= ADD FEED =================
async function addFeed() {
    if (isAddingFeed) return;

    const btn = document.getElementById("addFeedBtn");

    try {
        isAddingFeed = true;

        if (btn) {
            btn.disabled = true;
            btn.innerText = "Adding...";
        }

        const farmId = localStorage.getItem("farmId");

        if (!farmId) throw new Error("Farm missing");

        const date = document.getElementById("fDate")?.value;
        const maka = document.getElementById("maka")?.value;
        const soya = document.getElementById("soya")?.value;
        const dorb = document.getElementById("dorb")?.value;
        const marble = document.getElementById("marble")?.value;
        const fivepercent = document.getElementById("fivepercent")?.value;

        // ✅ Validation
        if (!date) throw new Error("Date is required");

        const res = await fetch(`${BASE_URL}/feed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                maka: Number(maka || 0),
                soya: Number(soya || 0),
                dorb: Number(dorb || 0),
                marble: Number(marble || 0),
                fivepercent: Number(fivepercent || 0),
                farm: { id: Number(farmId) }
            })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to add feed");
        }

        alert("Feed added successfully");

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isAddingFeed = false;

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Add Feed";
        }
    }
}

// ================= GET FEED =================
async function getFeed() {
    const btn = document.getElementById("getFeedBtn");

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Loading...";
        }

        const farmId = localStorage.getItem("farmId");

        if (!farmId) throw new Error("Farm missing");

        const from = document.getElementById("fFrom")?.value;
        const to = document.getElementById("fTo")?.value;

        if (!from || !to) {
            throw new Error("Select date range");
        }

        const url = `${BASE_URL}/feed/${farmId}/filter?from=${from}&to=${to}`;

        console.log("Fetching:", url);

        const res = await fetch(url);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Server error");
        }

        const data = await res.json();

        const table = document.getElementById("feedTable");

        let html = `
            <tr>
                <th>Date</th>
                <th>Maka</th>
                <th>Soya</th>
                <th>Dorb</th>
                <th>Marble</th>
                <th>5%</th>
            </tr>
        `;

        if (data.length === 0) {
            html += `<tr><td colspan="6">No data found</td></tr>`;
        } else {
            data.forEach(d => {
                html += `
                    <tr>
                        <td>${d.date}</td>
                        <td>${d.maka ?? 0}</td>
                        <td>${d.soya ?? 0}</td>
                        <td>${d.dorb ?? 0}</td>
                        <td>${d.marble ?? 0}</td>
                        <td>${d.fivepercent ?? 0}</td>
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
            btn.innerText = "Get Feed Data";
        }
    }
}