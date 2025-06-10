const BASE_URL = "http://localhost:5000/api/admin";

// Signup form handling
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const data = {
      name: formData.get("name"),
      admin_id: formData.get("id"), 
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || "Signup successful!");
         window.location.href = "index.html";
      } else {
        alert(result.error || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong during signup.");
    }
  });
}


// Login form handling
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const admin_id = document.getElementById("admin_id").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id, password }),
      });

      const data = await res.json();
      console.log("Login Response from backend:", data);
      if (res.ok) {
        document.getElementById("message").innerText = "✅ Login successful!";
         localStorage.setItem("adminName", data.name);
         localStorage.setItem("adminId", data.admin_id);
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        document.getElementById("message").innerText = `❌ ${"Login failed"}`;
      }
    } catch (error) {
      document.getElementById("message").innerText = "❌ Network error";
      console.error("Login Error:", error);
    }
  });
}
