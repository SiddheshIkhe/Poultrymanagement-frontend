document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("createFarmBtn");

    if (!btn) return;

    btn.addEventListener("click", createFarm);
});

async function createFarm() {
    try {
        const name = document.getElementById("farmName")?.value;
        const location = document.getElementById("location")?.value;
        const capacity = document.getElementById("capacity")?.value;

        const res = await fetch(`${BASE_URL}/farms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, location, capacity })
        });

        if (!res.ok) throw new Error("Farm creation failed");

        const data = await res.json();

        localStorage.setItem("farmId", data.id);

        alert("Farm created");
        window.location.href = "createuser.html";

    } catch (err) {
        alert(err.message);
    }
}