// 🔒 Guard
let isAddingVaccination = false;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addVaccinationBtn");
    const getBtn = document.getElementById("getVaccinationBtn");

    if (addBtn) addBtn.addEventListener("click", addVaccination);
    if (getBtn) getBtn.addEventListener("click", getVaccination);
});

// ================= ADD VACCINATION =================
async function addVaccination() {
    if (isAddingVaccination) return;

    const btn = document.getElementById("addVaccinationBtn");

    try {
        isAddingVaccination = true;

        if (btn) {
            btn.disabled = true;
            btn.innerText = "Adding...";
        }

        const farmId = localStorage.getItem("farmId");
        if (!farmId) throw new Error("Farm missing");

        const date = document.getElementById("vDate")?.value;
        const vaccineName = document.getElementById("vaccineName")?.value;
        const age = document.getElementById("age")?.value;
        const birds = document.getElementById("birds")?.value;
        const batch = document.getElementById("batch")?.value;
        const nextDue = document.getElementById("nextDue")?.value;
        const cost = document.getElementById("cost")?.value;
        const admin = document.getElementById("admin")?.value;
        const remark = document.getElementById("remark")?.value;

        // ✅ Validation (minimal but important)
        if (!date || !vaccineName || !birds) {
            throw new Error("Date, Vaccine name and Birds are required");
        }

        const res = await fetch(`${BASE_URL}/vaccination`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                vaccineName,
                ageOfBirds: Number(age || 0),
                totalBirdsVaccinated: Number(birds),
                vaccineBatchNumber: batch,
                nextDueDate: nextDue,
                costOfVaccine: Number(cost || 0),
                administeredBy: admin,
                remark,
                farm: { id: Number(farmId) }
            })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to add vaccination");
        }

        alert("Vaccination added successfully");

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isAddingVaccination = false;

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Add Vaccination";
        }
    }
}

// ================= GET VACCINATION =================
async function getVaccination() {
    const btn = document.getElementById("getVaccinationBtn");

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Loading...";
        }

        const farmId = localStorage.getItem("farmId");
        if (!farmId) throw new Error("Farm missing");

        const from = document.getElementById("vFrom")?.value;
        const to = document.getElementById("vTo")?.value;

        if (!from || !to) {
            throw new Error("Select date range");
        }

        const url = `${BASE_URL}/vaccination/${farmId}/filter?from=${from}&to=${to}`;

        const res = await fetch(url);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Server error");
        }

        const data = await res.json();

        const table = document.getElementById("vaccinationTable");

        let html = `
            <tr>
                <th>Date</th>
                <th>Vaccine</th>
                <th>Age</th>
                <th>Birds</th>
                <th>Batch</th>
                <th>Next Due</th>
                <th>Cost</th>
                <th>Administered by</th>
                <th>Remark</th>
            </tr>
        `;

        if (data.length === 0) {
            html += `<tr><td colspan="9">No data found</td></tr>`;
        } else {
            data.forEach(d => {
                html += `
                    <tr>
                        <td>${d.date}</td>
                        <td>${d.vaccineName}</td>
                        <td>${d.ageOfBirds ?? 0}</td>
                        <td>${d.totalBirdsVaccinated ?? 0}</td>
                        <td>${d.vaccineBatchNumber ?? "-"}</td>
                        <td>${d.nextDueDate ?? "-"}</td>
                        <td>${d.costOfVaccine ?? 0}</td>
                        <td>${d.administeredBy ?? "-"}</td>
                        <td>${d.remark ?? "-"}</td>
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
            btn.innerText = "Get Vaccination Data";
        }
    }
}