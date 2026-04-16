
// ================= PAGE LOAD =================
window.onload = function () {
    const farmId = localStorage.getItem("farmId");

    if (!farmId) {
        alert("Farm ID missing");
        window.location.href = "index.html";
        return;
    }

    loadEggChart();
    loadFeedChart();
    loadSalesChart();
    loadBirdChart();
};

// ================= EGG CHART =================
async function loadEggChart() {
    try {
        const farmId = localStorage.getItem("farmId");

        const res = await fetch(`${BASE_URL}/egg-production/${farmId}`);

        if (!res.ok) {
            console.error("Egg API failed:", res.status);
            return;
        }

        const data = await res.json();

        if (!data || data.length === 0) {
            console.warn("No egg data");
            return;
        }

        const labels = data.map(d => d.date);
        const trays = data.map(d => d.numberOfTrays);

        new Chart(document.getElementById("eggChart"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Egg Trays",
                    data: trays,
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: { responsive: true }
        });

    } catch (err) {
        console.error("Egg Chart Error:", err);
    }
}

// ================= FEED CHART =================
async function loadFeedChart() {
    try {
        const farmId = localStorage.getItem("farmId");

        const res = await fetch(`${BASE_URL}/feed/${farmId}`);

        if (!res.ok) {
            console.error("Feed API failed:", res.status);
            return;
        }

        const data = await res.json();

        if (!data || data.length === 0) {
            console.warn("No feed data");
            return;
        }

        const labels = data.map(d => d.date);

        const totalFeed = data.map(d =>
            (d.maka || 0) +
            (d.soya || 0) +
            (d.marble || 0) +
            (d.dorb || 0) +
            (d.fivepercent || 0)
        );

        new Chart(document.getElementById("feedChart"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Total Feed (kg)",
                    data: totalFeed,
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: { responsive: true }
        });

    } catch (err) {
        console.error("Feed Chart Error:", err);
    }
}

// ================= SALES CHART =================
async function loadSalesChart() {
    try {
        const farmId = localStorage.getItem("farmId");

        const res = await fetch(`${BASE_URL}/sales/${farmId}`);

        if (!res.ok) {
            console.error("Sales API failed:", res.status);
            return;
        }

        const data = await res.json();

        if (!data || data.length === 0) {
            console.warn("No sales data");
            return;
        }

        const labels = data.map(d => d.date);
        const trays = data.map(d => d.numberOfTrays);

        new Chart(document.getElementById("salesChart"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Trays Sold",
                    data: trays,
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: { responsive: true }
        });

    } catch (err) {
        console.error("Sales Chart Error:", err);
    }
}

// ================= BIRD CHART =================
async function loadBirdChart() {
    try {
        const farmId = localStorage.getItem("farmId");

        if (!farmId) {
            console.error("Farm ID missing");
            return;
        }

        const res = await fetch(`${BASE_URL}/chicken-stock/${farmId}`);

        if (!res.ok) {
            console.error("Bird API failed:", res.status);
            return;
        }

        const data = await res.json();

        if (!data || data.length === 0) {
            console.warn("No bird data");
            return;
        }

        const labels = data.map(d => d.date);
        const totalBirds = data.map(d => d.totalBirds);
        const mortality = data.map(d => d.mortality);

        new Chart(document.getElementById("birdChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Total Birds",
                        data: totalBirds
                    },
                    {
                        label: "Mortality",
                        data: mortality
                    }
                ]
            },
            options: {
                responsive: true
            }
        });

    } catch (err) {
        console.error("Bird Chart Error:", err);
    }
}