const name = localStorage.getItem("adminName") || "Admin";

const adminNameSpan = document.getElementById("adminName");
if (adminNameSpan) {
  adminNameSpan.innerText = name;
}


const formContainer = document.getElementById("formContainer");
const tableData = document.getElementById("tableData");
const tableTitle = document.getElementById("tableTitle");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const viewBtn = document.getElementById("viewBtn");
const sidebarButtons = document.querySelectorAll(".sidebar button[data-table]");

let currentTable = "departments"; // default

// Switch active table on sidebar click
sidebarButtons.forEach(btn => {
  btn.onclick = () => {
    sidebarButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTable = btn.getAttribute("data-table");
    tableTitle.innerText = capitalize(currentTable);
    clearAll();
    // Optionally auto-show view on switch
    fetchCurrentTableData();
  };
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminName");
    window.location.href = "index.html"; // Redirect to login
  });
}


// Capitalize first letter helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function clearAll() {
  formContainer.innerHTML = "";
  tableData.innerHTML = "";
}

// ----------- DEPARTMENTS MODULE ------------ //

function showAddDepartmentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Department</h3>
    <input type="text" id="deptName" placeholder="Department Name" />
    <button id="submitAddDept">Submit</button>
  `;

  document.getElementById("submitAddDept").onclick = () => {
    const name = document.getElementById("deptName").value.trim();
    if (!name) return alert("Please enter department name.");

    fetch("http://localhost:5000/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department_name: name }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Department added successfully");
        document.getElementById("deptName").value = "";
      })
      .catch((err) => console.error("Add Dept Error:", err));
  };
}

function fetchDepartments() {
  clearAll();
  fetch("http://localhost:5000/api/departments")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Unexpected data format");
      if (data.length === 0) {
        tableData.innerHTML = "<p>No departments found.</p>";
        return;
      }
      const list = data
        .map((d) => `<div>${d.dept_id}. ${d.department_name}</div>`)
        .join("");
      tableData.innerHTML = `
        <h3>List of Departments</h3>
        ${list}
      `;
    })
    .catch((err) => console.error("Fetch Dept Error:", err));
}

function showUpdateDepartmentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Department</h3>
    <input type="number" id="updateDeptId" placeholder="Enter Department ID" />
    <button id="loadDeptBtn">Load</button>
    <div id="updateFormFields" style="display:none;">
      <input type="text" id="updateDeptName" placeholder="New Department Name" />
      <button id="updateDeptSubmitBtn">Update</button>
    </div>
  `;

  document.getElementById("loadDeptBtn").onclick = () => {
    const id = document.getElementById("updateDeptId").value.trim();
    if (!id) return alert("Enter department ID");

    fetch(`http://localhost:5000/api/departments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Department not found");
        return res.json();
      })
      .then((data) => {
        document.getElementById("updateDeptName").value = data.department_name;
        document.getElementById("updateFormFields").style.display = "block";
      })
      .catch((err) => alert(err.message));
  };

  document.getElementById("updateDeptSubmitBtn").onclick = () => {
    const id = document.getElementById("updateDeptId").value.trim();
    const name = document.getElementById("updateDeptName").value.trim();
    if (!name) return alert("Enter new department name");

    fetch(`http://localhost:5000/api/departments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department_name: name }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Department updated successfully");
        clearAll();
      })
      .catch((err) => console.error("Update Dept Error:", err));
  };
}

function showDeleteDepartmentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Department</h3>
    <input type="number" id="deleteDeptId" placeholder="Enter Department ID" />
    <button id="deleteDeptBtn">Delete</button>
  `;

  document.getElementById("deleteDeptBtn").onclick = () => {
    const id = document.getElementById("deleteDeptId").value.trim();
    if (!id) return alert("Enter department ID");

    if (!confirm(`Are you sure to delete department ID ${id}?`)) return;

    fetch(`http://localhost:5000/api/departments/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        alert("Department deleted successfully");
        clearAll();
      })
      .catch((err) => alert(err.message));
  };
}

// ----------- STUDENTS MODULE ------------ //

function showAddStudentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Student</h3>
    <input type="text" id="studentName" placeholder="Student Name" />
    <input type="email" id="studentEmail" placeholder="Student Email" />
    <input type="number" id="studentDeptId" placeholder="Department ID" />
    <button id="submitAddStudent">Submit</button>
  `;

  document.getElementById("submitAddStudent").onclick = () => {
    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const deptId = document.getElementById("studentDeptId").value.trim();

    if (!name || !email || !deptId) return alert("All fields are required.");

    fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        department_id: Number(deptId),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Student added successfully");
        clearAll();
      })
      .catch((err) => console.error("Add Student Error:", err));
  };
}

function fetchStudents() {
  clearAll();
  fetch("http://localhost:5000/api/students")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Unexpected data format");
      if (data.length === 0) {
        tableData.innerHTML = "<p>No students found.</p>";
        return;
      }
      const list = data
        .map(
          (s) =>
            `<div>${s.student_id}. ${s.name} (${s.email}), Dept: ${s.department_id}</div>`
        )
        .join("");
      tableData.innerHTML = `
        <h3>List of Students</h3>
        ${list}
      `;
    })
    .catch((err) => console.error("Fetch Students Error:", err));
}

function showUpdateStudentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Student</h3>
    <input type="number" id="updateStudentId" placeholder="Enter Student ID" />
    <button id="loadStudentBtn">Load</button>
    <div id="updateStudentFields" style="display:none;">
      <input type="text" id="updateStudentName" placeholder="New Student Name" />
      <input type="email" id="updateStudentEmail" placeholder="New Student Email" />
      <input type="number" id="updateStudentDeptId" placeholder="New Department ID" />
      <button id="updateStudentSubmitBtn">Update</button>
    </div>
  `;

  document.getElementById("loadStudentBtn").onclick = () => {
    const id = document.getElementById("updateStudentId").value.trim();
    if (!id) return alert("Enter student ID");

    fetch(`http://localhost:5000/api/students/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Student not found");
        return res.json();
      })
      .then((data) => {
        document.getElementById("updateStudentName").value = data.name;
        document.getElementById("updateStudentEmail").value = data.email;
        document.getElementById("updateStudentDeptId").value = data.department_id;
        document.getElementById("updateStudentFields").style.display = "block";
      })
      .catch((err) => alert(err.message));
  };

  document.getElementById("updateStudentSubmitBtn").onclick = () => {
    const id = document.getElementById("updateStudentId").value.trim();
    const name = document.getElementById("updateStudentName").value.trim();
    const email = document.getElementById("updateStudentEmail").value.trim();
    const deptId = document.getElementById("updateStudentDeptId").value.trim();

    if (!name || !email || !deptId) return alert("All fields are required.");

    fetch(`http://localhost:5000/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        department_id: Number(deptId),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Student updated successfully");
        clearAll();
      })
      .catch((err) => console.error("Update Student Error:", err));
  };
}

function showDeleteStudentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Student</h3>
    <input type="number" id="deleteStudentId" placeholder="Enter Student ID" />
    <button id="deleteStudentBtn">Delete</button>
  `;

  document.getElementById("deleteStudentBtn").onclick = () => {
    const id = document.getElementById("deleteStudentId").value.trim();
    if (!id) return alert("Enter student ID");

    if (!confirm(`Are you sure to delete student ID ${id}?`)) return;

    fetch(`http://localhost:5000/api/students/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        alert("Student deleted successfully");
        clearAll();
      })
      .catch((err) => alert(err.message));
  };
}

// ----------- BUTTON EVENTS ------------ //

addBtn.onclick = () => {
  if (currentTable === "departments") showAddDepartmentForm();
  else if (currentTable === "students") showAddStudentForm();
};

viewBtn.onclick = () => {
  if (currentTable === "departments") fetchDepartments();
  else if (currentTable === "students") fetchStudents();
};

updateBtn.onclick = () => {
  if (currentTable === "departments") showUpdateDepartmentForm();
  else if (currentTable === "students") showUpdateStudentForm();
};

deleteBtn.onclick = () => {
  if (currentTable === "departments") showDeleteDepartmentForm();
  else if (currentTable === "students") showDeleteStudentForm();
};

// On page load, show departments view by default
tableTitle.innerText = capitalize(currentTable);
fetchDepartments();

// Helper: fetch current table data for auto-refresh on tab switch
function fetchCurrentTableData() {
  if (currentTable === "departments") fetchDepartments();
  else if (currentTable === "students") fetchStudents();
}
