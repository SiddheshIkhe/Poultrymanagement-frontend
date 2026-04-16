async function login() {
    try {
        const username = document.getElementById("username")?.value;
        const password = document.getElementById("password")?.value;

        const res = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error("Invalid credentials");

        const data = await res.json();

        localStorage.setItem("userId", data.id);
        localStorage.setItem("role", data.role);
        if (data.farmId) localStorage.setItem("farmId", data.farmId);

        window.location.href = "dashboard.html";

    } catch (err) {
        alert(err.message);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}