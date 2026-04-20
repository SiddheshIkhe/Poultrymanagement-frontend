// 🔒 Guards to prevent multiple submissions
let isLoggingIn = false;
let isCreatingUser = false;

// ================= LOGIN =================
async function login() {
    if (isLoggingIn) return;

    const btn = document.getElementById("loginBtn");

    try {
        isLoggingIn = true;

        if (btn) {
            btn.disabled = true;
            btn.innerText = "Logging in...";
        }

        const username = document.getElementById("username")?.value;
        const password = document.getElementById("password")?.value;

        // ✅ Validation
        if (!username || !password) {
            throw new Error("Username and password required");
        }

        const res = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Invalid credentials");
        }

        const data = await res.json();

        localStorage.setItem("userId", data.id);
        localStorage.setItem("role", data.role);

        if (data.farmId) {
            localStorage.setItem("farmId", data.farmId);
        }

        window.location.href = "dashboard.html";

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isLoggingIn = false;

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Login";
        }
    }
}

// ================= CREATE USER =================
async function createUser() {
    if (isCreatingUser) return;

    const btn = document.getElementById("createUserBtn");

    try {
        isCreatingUser = true;

        if (btn) {
            btn.disabled = true;
            btn.innerText = "Creating...";
        }

        const farmId = Number(document.getElementById("cfarmId")?.value);
        const username = document.getElementById("cusername")?.value;
        const password = document.getElementById("cpassword")?.value;
        const role = document.getElementById("role")?.value;

        // ✅ Validation
        if (!farmId || !username || !password || !role) {
            throw new Error("All fields are required");
        }

        const res = await fetch(`${BASE_URL}/users/create/${farmId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role })
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "User creation failed");
        }

        const data = await res.json();

        console.log("Success:", data);
        alert("User Created with role: " + data.role);

    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        isCreatingUser = false;

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Create User";
        }
    }
}

// ================= LOGOUT =================
function logout() {
    // Optional: confirm before logout
    if (!confirm("Are you sure you want to logout?")) return;

    localStorage.clear();
    window.location.href = "index.html";
}