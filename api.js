window.BASE_URL = "https://poultrymanagementsystemproject-production.up.railway.app/api";

// dashboard.js

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    loadTodayDashboardData();
});

// ================= LOAD TODAY DATA =================
async function loadTodayDashboardData() {

    try {

        const farmId = localStorage.getItem("farmId");

        if (!farmId) {
            throw new Error("Farm ID not found");
        }

        // today's date
        const today = new Date().toISOString().split("T")[0];

        // ================= FETCH TODAY DATA =================

        const eggRes = await fetch(
            `${BASE_URL}/egg-production/${farmId}/filter?from=${today}&to=${today}`
        );

        const birdRes = await fetch(
            `${BASE_URL}/birds/${farmId}`
        );

        const feedRes = await fetch(
            `${BASE_URL}/feed/${farmId}/filter?from=${today}&to=${today}`
        );

        const stockRes = await fetch(
            `${BASE_URL}/egg-stock/${farmId}`
        );

        // ================= RESPONSE CHECK =================

        if (!eggRes.ok) throw new Error("Failed to fetch egg data");

        if (!birdRes.ok) throw new Error("Failed to fetch bird data");

        if (!feedRes.ok) throw new Error("Failed to fetch feed data");

        if (!stockRes.ok) throw new Error("Failed to fetch stock data");

        // ================= JSON =================

        const eggData = await eggRes.json();
        const birdData = await birdRes.json();
        const feedData = await feedRes.json();
        const stockData = await stockRes.json();

        // ================= CALCULATE TODAY VALUES =================

        // eggs today
        let totalEggsToday = 0;

        eggData.forEach(e => {
            totalEggsToday += e.totalEggs || (e.numberOfTrays * 30);
        });

        // birds
        const totalBirds = birdData.totalBirds || birdData.length || 0;

        // feed today
        let totalFeed = 0;

        feedData.forEach(f => {
            totalFeed += f.quantity || 0;
        });

        // egg stock
        const totalStock =
            stockData.totalTrays || 0;

        // ================= UPDATE CARDS =================

        // update farm id
        document.getElementById("fid").innerText =
            `Farm ID : ${farmId}`;

        // update cards
        document.getElementById("totalEggs").innerText =
            totalEggsToday;

        document.getElementById("totalBirds").innerText =
            totalBirds;

        document.getElementById("totalFeed").innerText =
            `${totalFeed} KG`;

        document.getElementById("eggStock").innerText =
            `${totalStock} Tray`;
    } catch (err) {

        console.error(err);
        alert(err.message);

    }
}