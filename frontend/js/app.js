const API_BASE = "/api";



const state = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  classes: [],
};

// ---------- helpers ----------

async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: "Bearer " + state.token } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const body = await res.json();
      message = body.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res;
}

function isAdmin() {
  return state.user && state.user.role === "admin";
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function classOptionsHTML() {
  return state.classes
    .map((c) => `<option value="${c._id}">${c.name}${c.section ? " - " + c.section : ""}</option>`)
    .join("");
}

// ---------- auth ----------

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const userBadge = document.getElementById("user-badge");

function showApp() {
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  userBadge.classList.remove("hidden");
  document.getElementById("user-name").textContent = state.user.name;
  document.getElementById("user-role").textContent = state.user.role;

  if (!isAdmin()) {
    document.getElementById("admin-only-class-form").classList.add("hidden");
    document.getElementById("admin-only-student-form").classList.add("hidden");
  }

  loadClasses();
}

function showLogin() {
  loginScreen.classList.remove("hidden");
  appScreen.classList.add("hidden");
  userBadge.classList.add("hidden");
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  errorEl.classList.add("hidden");

  try {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    state.token = data.token;
    state.user = { name: data.name, email: data.email, role: data.role, _id: data._id };
    localStorage.setItem("token", state.token);
    localStorage.setItem("user", JSON.stringify(state.user));
    showApp();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove("hidden");
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  state.token = null;
  state.user = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showLogin();
});

// ---------- tabs ----------

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ---------- classes ----------

async function loadClasses() {
  try {
    state.classes = await api("/classes");
    renderClassesList();
    const selects = [
      "att-class-select",
      "student-class-select",
      "students-filter-select",
      "report-class-select",
      "monthly-class-select",
      "export-class-select",
    ];
    selects.forEach((id) => {
      document.getElementById(id).innerHTML = classOptionsHTML();
    });
    if (state.classes.length) loadRoster();
  } catch (err) {
    console.error(err);
  }
}

function renderClassesList() {
  const el = document.getElementById("classes-list");
  if (!state.classes.length) {
    el.innerHTML = '<p class="hint-line">No classes yet. Add one above to get started.</p>';
    return;
  }
  el.innerHTML = state.classes
    .map(
      (c) => `<div class="ledger-row">
        <span>${c.name}${c.section ? " - " + c.section : ""}</span>
        <span class="ledger-meta">${c._id.slice(-6)}</span>
      </div>`
    )
    .join("");
}

document.getElementById("class-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("class-name").value;
  const section = document.getElementById("class-section").value;
  try {
    await api("/classes", { method: "POST", body: JSON.stringify({ name, section }) });
    e.target.reset();
    loadClasses();
  } catch (err) {
    alert(err.message);
  }
});

// ---------- students ----------

async function loadStudents(classId) {
  const el = document.getElementById("students-list");
  if (!classId) {
    el.innerHTML = '<p class="hint-line">Pick a class to see its roster.</p>';
    return;
  }
  try {
    const students = await api("/students?classId=" + classId);
    if (!students.length) {
      el.innerHTML = '<p class="hint-line">No students in this class yet.</p>';
      return;
    }
    el.innerHTML = students
      .map(
        (s) => `<div class="ledger-row">
          <span>${s.name} <span class="ledger-meta">${s.rollNumber}</span></span>
          <span class="ledger-meta">${s.guardianContact || ""}</span>
        </div>`
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("students-filter-select").addEventListener("change", (e) => {
  loadStudents(e.target.value);
});

document.getElementById("student-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("student-name").value;
  const rollNumber = document.getElementById("student-roll").value;
  const classId = document.getElementById("student-class-select").value;
  const guardianContact = document.getElementById("student-contact").value;
  try {
    await api("/students", {
      method: "POST",
      body: JSON.stringify({ name, rollNumber, class: classId, guardianContact }),
    });
    e.target.reset();
    document.getElementById("students-filter-select").value = classId;
    loadStudents(classId);
  } catch (err) {
    alert(err.message);
  }
});

// ---------- attendance ----------

// ---------- attendance ----------

const attDateInput = document.getElementById("att-date");
attDateInput.value = todayStr();
document.getElementById("report-date").value = todayStr();

let rosterStudents = [];
const marks = {};

async function loadRoster() {
  const classId = document.getElementById("att-class-select").value;

  if (!classId) return;

  const el = document.getElementById("att-roster");
  el.innerHTML = '<p class="hint-line">Loading roster...</p>';

  try {
    rosterStudents = await api("/students?classId=" + classId);

    Object.keys(marks).forEach((k) => delete marks[k]);

    const date = attDateInput.value;

    let existing = [];

    try {
      existing = await api(
        `/attendance?classId=${classId}&date=${date}`
      );
    } catch (e) {
      console.log("No existing attendance");
    }

    existing.forEach((r) => {
      if (r.student && r.student._id) {
        marks[r.student._id] = r.status;
      }
    });

    renderRoster();

    document.getElementById("att-submit-row").style.display =
      rosterStudents.length ? "flex" : "none";

  } catch (err) {
    el.innerHTML =
      `<p class="error-line">${err.message}</p>`;
  }
}


function renderRoster() {

  const el = document.getElementById("att-roster");

  if (!rosterStudents.length) {
    el.innerHTML =
      '<p class="hint-line">No students in this class yet.</p>';
    return;
  }


  el.innerHTML = rosterStudents.map((s)=>{

    const current = marks[s._id];

    return `
    <div class="roster-row">

      <span class="roster-name">
        ${s.name}
        <span class="roster-roll">
          ${s.rollNumber}
        </span>
      </span>

      <div class="stamp-group">

        <button 
        type="button"
        class="stamp-btn ${current==="present"?"selected":""}"
        data-status="present"
        data-student="${s._id}">
        P
        </button>


        <button 
        type="button"
        class="stamp-btn ${current==="absent"?"selected":""}"
        data-status="absent"
        data-student="${s._id}">
        A
        </button>


        <button 
        type="button"
        class="stamp-btn ${current==="late"?"selected":""}"
        data-status="late"
        data-student="${s._id}">
        L
        </button>

      </div>

    </div>
    `;

  }).join("");


  el.querySelectorAll(".stamp-btn")
  .forEach(btn=>{

    btn.addEventListener("click",()=>{

      const id = btn.dataset.student;

      if(!id) return;

      marks[id] = btn.dataset.status;

      renderRoster();

    });

  });

}



document
.getElementById("att-class-select")
.addEventListener("change",loadRoster);


attDateInput
.addEventListener("change",loadRoster);



document
.getElementById("att-load-btn")
.addEventListener("click",loadRoster);



document
.getElementById("att-mark-all-present")
.addEventListener("click",()=>{

  rosterStudents.forEach(s=>{
    if(s._id){
      marks[s._id]="present";
    }
  });

  renderRoster();

});



document
.getElementById("att-submit-btn")
.addEventListener("click",async()=>{


const classId =
document.getElementById("att-class-select").value;


const date =
attDateInput.value;



const records =
Object.entries(marks)
.filter(([studentId,status])=>{

return (
studentId &&
studentId !== "null" &&
studentId !== "undefined" &&
status
);

})
.map(([studentId,status])=>({

studentId,
status

}));


console.log(
"Sending attendance:",
records
);



const statusEl =
document.getElementById("att-status");



if(!records.length){

statusEl.textContent =
"No valid students selected";

return;

}



try{


await api("/attendance",{

method:"POST",

body:JSON.stringify({

classId,
date,
records

})

});



statusEl.textContent =
`Saved attendance for ${records.length} student(s).`;



}catch(err){

console.error(err);

statusEl.textContent =
err.message;

}


});


// ---------- reports ----------

document.getElementById("daily-report-btn").addEventListener("click", async () => {
  const classId = document.getElementById("report-class-select").value;
  const date = document.getElementById("report-date").value;
  const out = document.getElementById("daily-report-out");
  if (!classId || !date) return;

  try {
    const data = await api(`/reports/daily?classId=${classId}&date=${date}`);
    out.innerHTML = `
      <div class="summary-chips">
        <span class="summary-chip present">Present ${data.present}</span>
        <span class="summary-chip absent">Absent ${data.absent}</span>
        <span class="summary-chip late">Late ${data.late}</span>
      </div>
      <table>
        <tr><th>Student</th><th>Roll</th><th>Status</th></tr>
        ${data.records
          .map(
            (r) =>
              `<tr><td>${r.student.name}</td><td>${r.student.rollNumber}</td><td>${r.status}</td></tr>`
          )
          .join("")}
      </table>`;
  } catch (err) {
    out.innerHTML = `<p class="error-line">${err.message}</p>`;
  }
});

document.getElementById("monthly-report-btn").addEventListener("click", async () => {
  const classId = document.getElementById("monthly-class-select").value;
  const monthVal = document.getElementById("monthly-month").value; // "2026-08"
  const out = document.getElementById("monthly-report-out");
  if (!classId || !monthVal) return;
  const [year, month] = monthVal.split("-");

  try {
    const data = await api(`/reports/monthly?classId=${classId}&year=${year}&month=${Number(month)}`);
    out.innerHTML = `
      <table>
        <tr><th>Student</th><th>Roll</th><th>Present</th><th>Absent</th><th>Late</th><th>Total</th></tr>
        ${data.summary
          .map(
            (s) =>
              `<tr><td>${s.student}</td><td>${s.rollNumber}</td><td>${s.present}</td><td>${s.absent}</td><td>${s.late}</td><td>${s.total}</td></tr>`
          )
          .join("")}
      </table>`;
  } catch (err) {
    out.innerHTML = `<p class="error-line">${err.message}</p>`;
  }
});

document.getElementById("export-btn").addEventListener("click", () => {
  const classId = document.getElementById("export-class-select").value;
  const start = document.getElementById("export-start").value;
  const end = document.getElementById("export-end").value;
  if (!classId || !start || !end) return;

  const url = `${API_BASE}/reports/export?classId=${classId}&startDate=${start}&endDate=${end}&token=${state.token}`;
  // Attach token via header isn't possible on a plain navigation, so fetch and download as a blob instead.
  fetch(`${API_BASE}/reports/export?classId=${classId}&startDate=${start}&endDate=${end}`, {
    headers: { Authorization: "Bearer " + state.token },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `attendance_${classId}_${start}_to_${end}.csv`;
      link.click();
    })
    .catch((err) => alert(err.message));
});

// ---------- init ----------

if (state.token && state.user) {
  showApp();
} else {
  showLogin();
}

