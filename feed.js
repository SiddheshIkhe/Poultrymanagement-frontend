document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("addFeedBtn");
    if (btn) btn.addEventListener("click", addFeed);
});

async function addFeed() {
    try {
        const farmId = localStorage.getItem("farmId");

        await fetch(`${BASE_URL}/feed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: document.getElementById("fDate")?.value,
                maka: document.getElementById("maka")?.value,
                soya: document.getElementById("soya")?.value,
                dorb: document.getElementById("dorb")?.value,
                marble: document.getElementById("marble")?.value,
                fivepercent: document.getElementById("fivepercent")?.value,
                farm: { id: Number(farmId) }
            })
        });

        alert("Feed added");

    } catch {
        alert("Error adding feed");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("getFeedBtn");
    if (btn) btn.addEventListener("click", getFeed);
});
async function getFeed() {
    try {
        const farmId = localStorage.getItem("farmId");

        const url = `${BASE_URL}/feed/${farmId}/filter?from=${fFrom.value}&to=${fTo.value}`;

        console.log("Fetching:", url);

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Server error: " + res.status);
        }

        const data = await res.json();

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

        feedTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching feed");
    }
}