document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("addEggBtn");
    if (btn) btn.addEventListener("click", addEgg);
});

async function addEgg() {
    try {
        const farmId = localStorage.getItem("farmId");

        await fetch(`${BASE_URL}/egg-production`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: document.getElementById("eDate")?.value,
                numberOfTrays: document.getElementById("trays")?.value,
                farm: { id: Number(farmId) }
            })
        });

        alert("Egg added");

    } catch {
        alert("Error adding egg");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("getEggBtn");
    if (btn) btn.addEventListener("click", getEgg);
});

async function getEgg() {
    try {
        const farmId = localStorage.getItem("farmId");

        if (!farmId) {
            alert("Farm ID not found. Please create/select farm.");
            return;
        }

        const url = `${BASE_URL}/egg-production/${farmId}/filter?from=${eFrom.value}&to=${eTo.value}`;

        console.log("Fetching Egg:", url);   // 🔥 DEBUG

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Server error: " + res.status);
        }

        const data = await res.json();

        if (data.length === 0) {
            eggTable.innerHTML = "<tr><td colspan='2'>No data found</td></tr>";
            return;
        }

        let html = `
<tr>
    <th>Date</th>
    <th>Trays</th>
    <th>Total Eggs</th>
</tr>
`;

        data.forEach(d => {
            html += `
        <tr>
            <td>${d.date}</td>
            <td>${d.numberOfTrays ?? 0}</td>
            <td>${d.totalEggs ?? (d.numberOfTrays * 30)}</td>
        </tr>
    `;
        });

        eggTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching egg");
    }
}