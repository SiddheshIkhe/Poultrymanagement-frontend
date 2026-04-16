document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("addChickenBtn");
    if (btn) btn.addEventListener("click", addChicken);
});

async function addChicken() {
    try {
        const farmId = localStorage.getItem("farmId");

        if (!farmId) {
            alert("Farm missing");
            return;
        }

        const res = await fetch(`${BASE_URL}/chicken-stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: document.getElementById("date")?.value,
                totalBirds: document.getElementById("totalBirds")?.value,
                mortality: document.getElementById("mortality")?.value,
                farm: { id: Number(farmId) }
            })
        });

        if (!res.ok) throw new Error("Failed");

        alert("Chicken added");

    } catch (err) {
        alert(err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("getChickenBtn");
    if (btn) btn.addEventListener("click", getChicken);
});
async function getChicken() {
    try {
        const farmId = localStorage.getItem("farmId");

        const url = `${BASE_URL}/chicken-stock/${farmId}/filter?from=${from.value}&to=${to.value}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Server error: " + res.status);

        const data = await res.json();

        // ✅ Added mortality column
        let html = "<tr><th>Date</th><th>Total Birds</th><th>Mortality</th></tr>";

        data.forEach(d => {
            html += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.totalBirds}</td>
                    <td>${d.mortality}</td>
                </tr>
            `;
        });

        chickenTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching chicken data");
    }
}