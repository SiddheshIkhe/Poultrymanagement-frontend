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

        console.log("Egg Data:", eggData);
        console.log("Bird Data:", birdData);
        console.log("Feed Data:", feedData);
        console.log("Stock Data:", stockData);

        // ================= CALCULATE TODAY VALUES =================

        // ================= EGGS TODAY =================

        let totalEggsToday = 0;

        if (Array.isArray(eggData)) {

            eggData.forEach(e => {

                if (e.totalEggs) {
                    totalEggsToday += e.totalEggs;
                }

                else if (e.numberOfTrays) {
                    totalEggsToday += e.numberOfTrays * 30;
                }

            });
        }

        // ================= TOTAL BIRDS =================

        let totalBirds = 0;

        if (Array.isArray(birdData)) {
            totalBirds = birdData.length;
        }
        else {
            totalBirds =
                birdData.totalBirds ||
                birdData.count ||
                birdData.total ||
                0;
        }

        // ================= FEED =================

        let totalFeed = 0;

        if (Array.isArray(feedData)) {

            feedData.forEach(f => {

                totalFeed +=
                    Number(f.quantity || f.feedQuantity || 0);

            });
        }

        // ================= STOCK =================

        let totalStock = 0;

        if (Array.isArray(stockData)) {

            stockData.forEach(s => {

                totalStock +=
                    Number(s.trays || s.totalTrays || 0);

            });

        } else {

            totalStock =
                stockData.totalTrays ||
                stockData.trays ||
                0;
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
    } catch (err) {

        console.error(err);
        alert(err.message);

    }
}