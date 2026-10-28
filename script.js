// ---------- Helpers ----------
const USERS_KEY = "users";
const SESSION_KEY = "currentUser";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setError(input, message) {
  const group = input.closest(".form-group");
  group.classList.remove("success");
  group.classList.add("error");
  group.querySelector(".error-msg").textContent = message;
}

function setSuccess(input) {
  const group = input.closest(".form-group");
  group.classList.remove("error");
  group.classList.add("success");
  group.querySelector(".error-msg").textContent = "";
}

function showAlert(type, message) {
  const alertBox = document.getElementById("alert");
  alertBox.className = "alert show " + type;
  alertBox.textContent = message;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- Show / Hide password ----------
document.querySelectorAll(".toggle-pass").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const input = document.getElementById(btn.dataset.target);
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.textContent = hidden ? "Hide" : "Show";
  });
});

// ---------- Sign Up ----------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirmPassword");
    let valid = true;

    if (name.value.trim().length < 3) {
      setError(name, "Naam kam az kam 3 characters ka hona chahiye");
      valid = false;
    } else setSuccess(name);

    if (!isValidEmail(email.value.trim())) {
      setError(email, "Sahi email address likhein");
      valid = false;
    } else setSuccess(email);

    if (password.value.length < 6) {
      setError(password, "Password kam az kam 6 characters ka ho");
      valid = false;
    } else setSuccess(password);

    if (confirm.value !== password.value || confirm.value === "") {
      setError(confirm, "Passwords match nahi karte");
      valid = false;
    } else setSuccess(confirm);

    if (!valid) return;

    const users = getUsers();
    const emailValue = email.value.trim().toLowerCase();

    if (users.some(function (u) { return u.email === emailValue; })) {
      showAlert("error", "Yeh email pehle se registered hai");
      return;
    }

    users.push({
      name: name.value.trim(),
      email: emailValue,
      password: password.value
    });
    saveUsers(users);

    showAlert("success", "Account ban gaya! Login page par ja rahe hain...");
    signupForm.reset();
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1500);
  });
}

// ---------- Login ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  // Remember me: email wapas bhar do
  const remembered = localStorage.getItem("rememberedEmail");
  if (remembered) {
    document.getElementById("email").value = remembered;
    document.getElementById("remember").checked = true;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let valid = true;

    if (!isValidEmail(email.value.trim())) {
      setError(email, "Sahi email address likhein");
      valid = false;
    } else setSuccess(email);

    if (password.value === "") {
      setError(password, "Password likhna zaroori hai");
      valid = false;
    } else setSuccess(password);

    if (!valid) return;

    const emailValue = email.value.trim().toLowerCase();
    const user = getUsers().find(function (u) {
      return u.email === emailValue && u.password === password.value;
    });

    if (!user) {
      showAlert("error", "Email ya password ghalat hai");
      return;
    }

    if (document.getElementById("remember").checked) {
      localStorage.setItem("rememberedEmail", emailValue);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
    showAlert("success", "Login kamyab! Dashboard khul raha hai...");
    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 1000);
  });

  document.getElementById("forgotLink").addEventListener("click", function (e) {
    e.preventDefault();
    showAlert("error", "Forgot password ke liye backend chahiye (FYP mein add karein)");
  });
}

// ---------- Dashboard ----------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  if (!session) {
    window.location.href = "login.html";
  } else {
    document.getElementById("welcome").textContent = "Welcome, " + session.name + "!";
    document.getElementById("userEmail").textContent = session.email;
  }

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  });
}
