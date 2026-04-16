document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("addVaccinationBtn");
    if (btn) btn.addEventListener("click", addVaccination);
});

async function addVaccination() {
    try {
        const farmId = localStorage.getItem("farmId");

        await fetch(`${BASE_URL}/vaccination`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: document.getElementById("vDate")?.value,
                vaccineName: document.getElementById("vaccineName")?.value,
                ageOfBirds: document.getElementById("age")?.value,
                totalBirdsVaccinated: document.getElementById("birds")?.value,
                vaccineBatchNumber: document.getElementById("batch")?.value,
                nextDueDate: document.getElementById("nextDue")?.value,
                costOfVaccine: document.getElementById("cost")?.value,
                administeredBy: document.getElementById("admin")?.value,
                remark: document.getElementById("remark")?.value,
                farm: { id: Number(farmId) }
            })
        });

        alert("Vaccination added");

    } catch {
        alert("Error adding vaccination");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("getVaccinationBtn");
    if (btn) btn.addEventListener("click", getVaccination);
});
async function getVaccination() {
    try {
        const farmId = localStorage.getItem("farmId");

        const url = `${BASE_URL}/vaccination/${farmId}/filter?from=${vFrom.value}&to=${vTo.value}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Server error: " + res.status);

        const data = await res.json();

        if (data.length === 0) {
            vaccinationTable.innerHTML = "<tr><td colspan='9'>No data found</td></tr>";
            return;
        }

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

        data.forEach(d => {
            html += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.vaccineName}</td>
                    <td>${d.ageOfBirds}</td>
                    <td>${d.totalBirdsVaccinated}</td>
                    <td>${d.vaccineBatchNumber}</td>
                    <td>${d.nextDueDate}</td>
                    <td>${d.costOfVaccine}</td>
                    <td>${d.administeredBy}</td>
                    <td>${d.remark}</td>
                </tr>
            `;
        });

        vaccinationTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching vaccination data");
    }
}