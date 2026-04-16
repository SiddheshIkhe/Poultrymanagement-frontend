const BASE_URL = "https://poultrymanagementsystemproject.onrender.com/api";

// ================= LOGIN =================
async function login() {
    try {
        const res = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        });

        if (!res.ok) {
            throw new Error("Invalid credentials");
        }

        const data = await res.json();

        console.log("Login Response:", data);

        // ✅ STORE USER DATA
        localStorage.setItem("userId", data.id);
        localStorage.setItem("role", data.role);

        // ✅ STORE FARM ID
        if (data.farmId) {
            localStorage.setItem("farmId", data.farmId);
        } else {
            alert("No farm assigned to this user");
            return;
        }

        alert("Login successful");
        window.location.href = "dashboard.html";

    } catch (err) {
        console.error("Login Error:", err);
        alert(err.message || "Login failed");
    }
}

// ================= FARM =================
async function createFarm() {
    try {
        const loc = document.getElementById("location").value;
        const res = await fetch(`${BASE_URL}/farms`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },


            body: JSON.stringify({
                name: farmName.value,
                location: loc,
                capacity: capacity.value
            })
        });

        if (!res.ok) throw new Error("Farm creation failed");

        const data = await res.json();

        // ✅ Store farmId for later use
        localStorage.setItem("farmId", data.id);

        alert("Farm Created ID: " + data.id);
        window.location.href = "createuser.html";

    } catch (err) {
        console.error(err);
        alert("Error creating farm");
    }
}

// ================= USER =================
async function createUser() {
    try {
        const farmId = Number(cfarmId.value);

        if (!farmId) {
            alert("Please enter valid Farm ID");
            return;
        }

        const res = await fetch(`${BASE_URL}/users/create/${farmId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: cusername.value,
                password: cpassword.value,
                role: role.value
            })
        });

        // ✅ Handle error properly
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Backend Error:", errorText);
            alert("Error: " + errorText);
            return;
        }

        // ✅ Only read JSON once
        const data = await res.json();

        console.log("Success:", data);
        alert("User Created with role: " + data.role);

    } catch (err) {
        console.error(err);
        alert("Error creating user");
    }
}

// ================= CHICKEN =================
async function addChicken() {
    console.log("date:", document.getElementById("date"));
    console.log("totalBirds:", document.getElementById("totalBirds"));
    console.log("mortality:", document.getElementById("mortality"));
    try {
        const farmId = localStorage.getItem("farmId");

        console.log("Farm ID:", farmId);  // 🔥 DEBUG

        if (!farmId) {
            alert("Farm ID missing. Please login again.");
            return;
        }

        const res = await fetch(`${BASE_URL}/chicken-stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: document.getElementById("date").value,
                totalBirds: document.getElementById("totalBirds").value,
                mortality: document.getElementById("mortality").value,
                // ✅ VERY IMPORTANT
                farm: {
                    id: Number(farmId)
                }
            })
        });


        if (!res.ok) throw new Error();

        alert("Chicken Stock Added");

    } catch (err) {
        console.error(err);
        alert("Error adding chicken stock");
    }
}


async function getChicken() {
    try {
        const farmId = localStorage.getItem("farmId");

        const url = `${BASE_URL}/chicken-stock/${farmId}/filter?from=${from.value}&to=${to.value}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Server error: " + res.status);

        const data = await res.json();

        // ✅ Added mortality column
        let html = "<tr><th>Date</th><th>Total Birds</th><th>Mortality</th></tr>";

        data.forEach(d => {
            html += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.totalBirds}</td>
                    <td>${d.mortality}</td>
                </tr>
            `;
        });

        chickenTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching chicken data");
    }
}

// ================= FEED =================
async function addFeed() {
    const farmId = localStorage.getItem("farmId");

    await fetch(`${BASE_URL}/feed`, {   // ✅ FIXED URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            date: fDate.value,
            maka: maka.value,           // ✅ FIXED FIELD NAME
            soya: soya.value,
            dorb: dorb.value,
            marble: marble.value,
            fivepercent: fivepercent.value,
            farm: { id: farmId }        // ✅ IMPORTANT
        })
    });

    alert("Feed added");
}

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
// ================= EGG =================
async function addEgg() {
    try {
        const farmId = localStorage.getItem("farmId");

        const res = await fetch(`${BASE_URL}/egg-production`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: eDate.value,
                numberOfTrays: trays.value,
                farm: {
                    id: farmId
                }
            })
        });

        if (!res.ok) throw new Error();

        alert("Egg added");

    } catch {
        alert("Error adding egg");
    }
}

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

// ================= SALES =================
async function addSales() {
    try {
        const farmId = localStorage.getItem("farmId");

        const res = await fetch(`${BASE_URL}/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: sDate.value,
                numberOfTrays: sTrays.value,
                rate: rate.value,
                paymentMethod: payment.value,
                farm: {
                    id: farmId
                }
            })
        });

        if (!res.ok) throw new Error();

        alert("Sales added");

    } catch {
        alert("Error adding sales");
    }
}

async function getSales() {
    try {
        const farmId = localStorage.getItem("farmId");

        if (!farmId) {
            alert("Farm ID not found");
            return;
        }

        const url = `${BASE_URL}/sales/${farmId}/filter?from=${sFrom.value}&to=${sTo.value}`;

        console.log("Fetching Sales:", url);

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Server error: " + res.status);
        }

        const data = await res.json();

        console.log("Sales Data:", data); // 🔥 DEBUG

        if (data.length === 0) {
            salesTable.innerHTML = "<tr><td colspan='5'>No data found</td></tr>";
            return;
        }

        let html = `
            <tr>
                <th>Date</th>
                <th>Trays</th>
                <th>Rate</th>
                <th>Total Amount</th>
                <th>Payment</th>
            </tr>
        `;

        data.forEach(d => {
            html += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.numberOfTrays ?? 0}</td>   <!-- ✅ FIX -->
                    <td>${d.rate ?? 0}</td>
                    <td>${d.totalAmount ?? (d.numberOfTrays * d.rate *30)}</td>
                    <td>${d.paymentMethod ?? "-"}</td>
                </tr>
            `;
        });

        salesTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching sales");
    }
}

// ================= EXPENSE =================
async function addExpense() {
    try {
        const farmId = localStorage.getItem("farmId");

        const res = await fetch(`${BASE_URL}/expense`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: dDate.value,
                descriptionOfExpense: desc.value,
                amount: amount.value,
                farm: {
                    id: farmId
                }
            })
        });

        if (!res.ok) throw new Error("Failed to add expense");

        alert("Expense added successfully");

    } catch (err) {
        console.error(err);
        alert("Error adding expense");
    }
}

async function getExpense() {
    try {
        const farmId = localStorage.getItem("farmId");

        const url = `${BASE_URL}/expense/${farmId}/filter?from=${dFrom.value}&to=${dTo.value}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Server error: " + res.status);

        const data = await res.json();

        if (data.length === 0) {
            expenseTable.innerHTML = "<tr><td colspan='3'>No data found</td></tr>";
            return;
        }

        let html = `
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        `;

        data.forEach(d => {
            html += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.descriptionOfExpense}</td>
                    <td>${d.amount}</td>
                </tr>
            `;
        });

        expenseTable.innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error fetching expense");
    }
}

// ================= VACCINATION =================
async function addVaccination() {
    try {
        const farmId = localStorage.getItem("farmId");

        const res = await fetch(`${BASE_URL}/vaccination`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: vDate.value,
                vaccineName: vaccineName.value,
                ageOfBirds: age.value,
                totalBirdsVaccinated: birdsVac.value,
                vaccineBatchNumber: batch.value,
                nextDueDate: nextDue.value,
                costOfVaccine: cost.value,
                administeredBy: admin.value,
                remark: remark.value,
                farm: {
                    id: farmId
                }
            })
        });

        if (!res.ok) throw new Error("Failed to add vaccination");

        alert("Vaccination added successfully");

    } catch (err) {
        console.error(err);
        alert("Error adding vaccination");
    }
}

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
// window.onload = function () {
//     const user = localStorage.getItem("user");

//     if (!user) {
//         alert("Please login first");
//         window.location.href = "index.html";
//     }
// };
document.getElementById("logoutBtn").addEventListener("click", logout);
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
window.onload = function () {
    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
        document.getElementById("adminSection").style.display = "none";
    }
};