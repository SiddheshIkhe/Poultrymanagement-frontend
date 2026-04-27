// dashboard.js

// ================= INIT =================

document.addEventListener("DOMContentLoaded", () => {
    loadTodayDashboardData();
});

// ================= LOAD DASHBOARD DATA =================

async function loadTodayDashboardData() {

    try {

        const farmId = localStorage.getItem("farmId");

        if (!farmId) {
            throw new Error("Farm ID not found");
        }

        // show farm id
        document.getElementById("fid").innerText =
            `Farm ID : ${farmId}`;

        // today's date
        const today = new Date().toISOString().split("T")[0];

        // ================= FETCH DATA =================

        const eggRes = await fetch(
            `${BASE_URL}/egg-production/${farmId}/filter?from=${today}&to=${today}`
        );

        const birdRes = await fetch(
            `${BASE_URL}/chicken-stock/${farmId}/date?date=${today}`
        );

        const feedRes = await fetch(
            `${BASE_URL}/feed/${farmId}/filter?from=${today}&to=${today}`
        );

        const stockRes = await fetch(
            `${BASE_URL}/egg-production/${farmId}/filter?from=${today}&to=${today}`
        );

        // ================= RESPONSE CHECK =================

        if (!eggRes.ok) {
            throw new Error("Failed to fetch egg data");
        }

        if (!birdRes.ok) {
            throw new Error("Failed to fetch bird data");
        }

        if (!feedRes.ok) {
            throw new Error("Failed to fetch feed data");
        }

        if (!stockRes.ok) {
            throw new Error("Failed to fetch stock data");
        }

        // ================= CONVERT JSON =================

        const eggData = await eggRes.json();
        const birdData = await birdRes.json();
        const feedData = await feedRes.json();
        const stockData = await stockRes.json();

        console.log("Egg Data:", eggData);
        console.log("Bird Data:", birdData);
        console.log("Feed Data:", feedData);
        console.log("Stock Data:", stockData);

        // ================= TOTAL EGGS =================

        let totalEggsToday = 0;

        if (Array.isArray(eggData)) {

            eggData.forEach(e => {

                totalEggsToday +=
                    Number(
                        e.totalEggs ||
                        ((e.numberOfTrays || 0) * 30)
                    );

            });

        }

        // ================= TOTAL BIRDS =================

        let totalBirds = 0;

        if (Array.isArray(birdData)) {

            birdData.forEach(b => {

                totalBirds += Number(
                    b.totalBirds ||
                    b.quantity ||
                    b.numberOfBirds ||
                    0
                );

            });

        }

        // ================= TOTAL FEED =================

        let totalFeed = 0;

        if (Array.isArray(feedData)) {

            feedData.forEach(f => {

                totalFeed += Number(
                    f.quantity ||
                    f.feedQuantity ||
                    0
                );

            });

        }

        // ================= TOTAL STOCK =================

        let totalStock = 0;

        if (Array.isArray(stockData)) {

            stockData.forEach(s => {

                totalStock += Number(
                    s.numberOfTrays || 0
                );

            });

        }

        // ================= UPDATE UI =================

        document.getElementById("totalEggs").innerText =
            totalEggsToday;

        document.getElementById("totalBirds").innerText =
            totalBirds;

        document.getElementById("totalFeed").innerText =
            `${totalFeed} KG`;

        document.getElementById("eggStock").innerText =
            `${totalStock} Tray`;

    }

    catch (err) {

        console.error("Dashboard Error:", err);

        alert(err.message);

    }

}