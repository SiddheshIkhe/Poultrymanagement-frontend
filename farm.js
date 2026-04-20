document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("createFarmBtn");

    if (!btn) return;

    btn.addEventListener("click", createFarm);
});

let isSubmitting = false; // 🔒 global guard

async function createFarm() {
    if (isSubmitting) return; // 🚫 prevent multiple clicks

    const btn = document.getElementById("createFarmBtn");

    try {
        isSubmitting = true;

        // 🔒 Disable button
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Creating...";
        }

        const name = document.getElementById("farmName")?.value;
        const location = document.getElementById("location")?.value;
        const capacity = document.getElementById("capacity")?.value;

        // ✅ Basic validation
        if (!name || !location || !capacity) {
            throw new Error("All fields are required");
        }

        const res = await fetch(`${BASE_URL}/farms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, location, capacity })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Farm creation failed");
        }

        const data = await res.json();

        localStorage.setItem("farmId", data.id);

        alert("Farm created successfully",localStorage.getItem("farmId"));

        // 🚀 Redirect
        window.location.href = "createuser.html";

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isSubmitting = false;

        // 🔓 Re-enable button
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Create Farm";
        }
    }
}