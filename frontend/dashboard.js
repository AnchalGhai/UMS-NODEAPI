const name = localStorage.getItem("adminName") || "Admin";

const adminNameSpan = document.getElementById("adminName");
if (adminNameSpan) {
  adminNameSpan.innerText = name;
}



const formContainer = document.getElementById("formContainer");
const tableData = document.getElementById("tableData");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const viewBtn = document.getElementById("viewBtn");
const sidebarButtons = document.querySelectorAll(".sidebar button[data-table]");
const tableTitle = document.getElementById("tableTitle");
const reportSection = document.getElementById("reportSection");
const actionsDiv = document.querySelector(".actions"); 

let currentTable = "departments"; // default




// Switch active table on sidebar click
sidebarButtons.forEach(btn => {
  btn.onclick = () => {
    sidebarButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const table = btn.getAttribute("data-table");
    currentTable = table;
    tableTitle.innerText = capitalize(currentTable);
    clearAll();

    // 👇 Toggle sections based on current table
    if (currentTable === "reports") {
      reportSection.style.display = "block";
      tableData.style.display = "none";
      formContainer.style.display = "none";
      actionsDiv.style.display = "none"; // ✅ Hide add/update/delete/view
    } else {
      reportSection.style.display = "none";
      tableData.style.display = "block";
      formContainer.style.display = "block";
      actionsDiv.style.display = "flex"; // ✅ Show buttons for other tables
      fetchCurrentTableData();
    }
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

      let tableHTML = `
        <h3>List of Departments</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach((d) => {
        tableHTML += `
          <tr>
            <td>${d.dept_id}</td>
            <td>${d.department_name}</td>
          </tr>
        `;
      });

      tableHTML += `</tbody></table>`;
      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Departments Error:", err);
      tableData.innerHTML = "<p>Error loading departments.</p>";
    });
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
    const idField = document.getElementById("updateDeptId");
    const id = idField.value.trim();
    if (!id) return alert("Enter department ID");

    fetch(`http://localhost:5000/api/departments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Department not found");
        return res.json();
      })
      .then((data) => {
        document.getElementById("updateDeptName").value = data.department_name;
        document.getElementById("updateFormFields").style.display = "block";
        idField.readOnly = true;
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

      let tableHTML = `
        <h3>List of Students</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department ID</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach((s) => {
        tableHTML += `
          <tr>
            <td>${s.student_id}</td>
            <td>${s.name}</td>
            <td>${s.email}</td>
            <td>${s.department_id}</td>
          </tr>
        `;
      });

      tableHTML += `</tbody></table>`;
      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Students Error:", err);
      tableData.innerHTML = "<p>Error loading students.</p>";
    });
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
    const idField = document.getElementById("updateStudentId");
    const id = idField.value.trim();
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
        idField.readOnly = true;
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



// ----------- PROFESSORS MODULE ------------ //
function showAddProfessorForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Professor</h3>
    <input type="text" id="profName" placeholder="Professor Name" />
    <input type="email" id="profEmail" placeholder="Professor Email" />
    <input type="number" id="profDeptId" placeholder="Department ID" />
    <button id="submitAddProfessor">Submit</button>
  `;

  document.getElementById("submitAddProfessor").onclick = () => {
    const name = document.getElementById("profName").value.trim();
    const email = document.getElementById("profEmail").value.trim();
    const deptId = document.getElementById("profDeptId").value.trim();

    if (!name || !email || !deptId) return alert("All fields are required.");

    fetch("http://localhost:5000/api/professors", {
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
        alert("Professor added successfully");
        clearAll();
      })
      .catch((err) => console.error("Add Professor Error:", err));
  };
}

function fetchProfessors() {
  clearAll();
  fetch("http://localhost:5000/api/professors")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Unexpected data format");
      if (data.length === 0) {
        tableData.innerHTML = "<p>No professors found.</p>";
        return;
      }

      let tableHTML = `
        <h3>List of Professors</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Professor ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department Name</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach((p) => {
        tableHTML += `
          <tr>
            <td>${p.professor_id}</td>
            <td>${p.name}</td>
            <td>${p.email}</td>
            <td>${p.department_name}</td>
          </tr>
        `;
      });

      tableHTML += `</tbody></table>`;
      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Professors Error:", err);
      tableData.innerHTML = "<p>Error loading professors.</p>";
    });
}


function showUpdateProfessorForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Professor</h3>
    <input type="number" id="updateProfId" placeholder="Enter Professor ID" />
    <button id="loadProfBtn">Load</button>
    <div id="updateProfFields" style="display:none;">
      <input type="text" id="updateProfName" placeholder="New Name" />
      <input type="email" id="updateProfEmail" placeholder="New Email" />
      <input type="number" id="updateProfDeptId" placeholder="New Department ID" />
      <button id="updateProfSubmitBtn">Update</button>
    </div>
  `;

  document.getElementById("loadProfBtn").onclick = () => {
    const idField = document.getElementById("updateProfId");
    const id = idField.value.trim();
    if (!id) return alert("Enter professor ID");

    fetch(`http://localhost:5000/api/professors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Professor not found");
        return res.json();
      })
      .then((data) => {
        document.getElementById("updateProfName").value = data.name;
        document.getElementById("updateProfEmail").value = data.email;
        document.getElementById("updateProfDeptId").value = data.department_id;
        document.getElementById("updateProfFields").style.display = "block";
        idField.readOnly = true;
      })
      .catch((err) => alert(err.message));
  };

  document.getElementById("updateProfSubmitBtn").onclick = () => {
    const id = document.getElementById("updateProfId").value.trim();
    const name = document.getElementById("updateProfName").value.trim();
    const email = document.getElementById("updateProfEmail").value.trim();
    const deptId = document.getElementById("updateProfDeptId").value.trim();

    if (!name || !email || !deptId) return alert("All fields are required.");

    fetch(`http://localhost:5000/api/professors/${id}`, {
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
        alert("Professor updated successfully");
        clearAll();
      })
      .catch((err) => console.error("Update Professor Error:", err));
  };
}

function showDeleteProfessorForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Professor</h3>
    <input type="number" id="deleteProfId" placeholder="Enter Professor ID" />
    <button id="deleteProfBtn">Delete</button>
  `;

  document.getElementById("deleteProfBtn").onclick = () => {
    const id = document.getElementById("deleteProfId").value.trim();
    if (!id) return alert("Enter professor ID");

    if (!confirm(`Are you sure to delete professor ID ${id}?`)) return;

    fetch(`http://localhost:5000/api/professors/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        alert("Professor deleted successfully");
        clearAll();
      })
      .catch((err) => alert(err.message));
  };
}

// ----------- COURSES MODULE ------------ //

function showAddCourseForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Course</h3>
    <input type="text" id="courseCode" placeholder="Course Code" />
    <input type="text" id="courseName" placeholder="Course Name" />
    <input type="number" id="courseCredits" placeholder="Credits" />
    <input type="number" id="courseDeptId" placeholder="Department ID" />
    <button id="submitAddCourse">Submit</button>
  `;

  document.getElementById("submitAddCourse").onclick = () => {
    const code = document.getElementById("courseCode").value.trim();
    const name = document.getElementById("courseName").value.trim();
    const credits = document.getElementById("courseCredits").value.trim();
    const deptId = document.getElementById("courseDeptId").value.trim();

    if (!code || !name || !credits || !deptId) return alert("All fields are required.");

    fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_code: code,
        course_name: name,
        credits: Number(credits),
        department_id: Number(deptId),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Course added successfully");
        clearAll();
      })
      .catch((err) => console.error("Add Course Error:", err));
  };
}

function fetchCourses() {
  clearAll();
  fetch("http://localhost:5000/api/courses")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Unexpected data format");
      if (data.length === 0) {
        tableData.innerHTML = "<p>No courses found.</p>";
        return;
      }

      // Create table headers
      let tableHTML = `
        <h3>List of Courses</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Department ID</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Add rows for each course
      data.forEach((c) => {
        tableHTML += `
          <tr>
            <td>${c.course_code}</td>
            <td>${c.course_name}</td>
            <td>${c.credits}</td>
            <td>${c.department_id}</td>
          </tr>
        `;
      });

      tableHTML += `</tbody></table>`;

      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Courses Error:", err);
      tableData.innerHTML = "<p>Error loading courses.</p>";
    });
}


function showUpdateCourseForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Course</h3>
    <input type="text" id="updateCourseCode" placeholder="Enter Course Code" />
    <button id="loadCourseBtn">Load</button>
    <div id="updateCourseFields" style="display:none;">
      <input type="text" id="updateCourseName" placeholder="New Course Name" />
      <input type="number" id="updateCourseCredits" placeholder="New Credits" />
      <input type="number" id="updateCourseDeptId" placeholder="New Department ID" />
      <button id="updateCourseSubmitBtn">Update</button>
    </div>
  `;

  document.getElementById("loadCourseBtn").onclick = () => {
    const codeField = document.getElementById("updateCourseCode");
    const code = idField.value.trim();
    if (!code) return alert("Enter course code");

    fetch(`http://localhost:5000/api/courses/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Course not found");
        return res.json();
      })
      .then((data) => {
        document.getElementById("updateCourseName").value = data.course_name;
        document.getElementById("updateCourseCredits").value = data.credits;
        document.getElementById("updateCourseDeptId").value = data.department_id;
        document.getElementById("updateCourseFields").style.display = "block";
        codeField.readOnly = true;
      })
      .catch((err) => alert(err.message));
  };

  document.getElementById("updateCourseSubmitBtn").onclick = () => {
    const code = document.getElementById("updateCourseCode").value.trim();
    const name = document.getElementById("updateCourseName").value.trim();
    const credits = document.getElementById("updateCourseCredits").value.trim();
    const deptId = document.getElementById("updateCourseDeptId").value.trim();

    if (!name || !credits || !deptId) return alert("All fields are required.");

    fetch(`http://localhost:5000/api/courses/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_name: name,
        credits: Number(credits),
        department_id: Number(deptId),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Course updated successfully");
        clearAll();
      })
      .catch((err) => console.error("Update Course Error:", err));
  };
}


function showDeleteCourseForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Course</h3>
    <input type="text" id="deleteCourseCode" placeholder="Enter Course Code" />
    <button id="deleteCourseBtn">Delete</button>
  `;

  document.getElementById("deleteCourseBtn").onclick = () => {
    const code = document.getElementById("deleteCourseCode").value.trim();
    if (!code) return alert("Enter course code");

    if (!confirm(`Are you sure to delete course Code ${code}?`)) return;

    fetch(`http://localhost:5000/api/courses/${code}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        alert("Course deleted successfully");
        clearAll();
      })
      .catch((err) => alert(err.message));
  };
}

// --- SEMESTERS MODULE ---

function showAddSemesterForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Semester</h3>
    <input type="text" id="semesterName" placeholder="Semester Name" />
    <input type="number" id="semesterYear" placeholder="Year" />
    <button id="submitAddSemester">Add</button>
  `;

  document.getElementById('submitAddSemester').onclick = async () => {
    const name = document.getElementById('semesterName').value.trim();
    const year = parseInt(document.getElementById('semesterYear').value.trim());

    if (!name || !year) {
      alert("Please enter semester name and year.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/semesters', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ semester_name: name, year })
      });
      if (res.ok) {
        alert('Semester added successfully');
        formContainer.innerHTML = '';
      } else {
        const error = await res.text();
        alert('Error: ' + error);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };
}

function showUpdateSemesterForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Semester</h3>
    <input type="number" id="updateSemesterId" placeholder="Enter Semester ID" />
    <button id="loadSemesterBtn">Load</button>
    <div id="updateSemesterFields" style="display:none;">
      <input type="text" id="updateSemesterName" placeholder="New Semester Name" />
      <input type="number" id="updateSemesterYear" placeholder="New Year" />
      <button id="updateSemesterSubmitBtn">Update</button>
    </div>
  `;

  document.getElementById("loadSemesterBtn").onclick = () => {
    const idField = document.getElementById("updateSemesterId");
    const id = idField.value.trim();
    if (!id) return alert("Enter semester ID");

    fetch(`http://localhost:5000/api/semesters/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Semester not found");
        return res.json();
      })
      .then((data) => {
        document.getElementById("updateSemesterName").value = data.semester_name;
        document.getElementById("updateSemesterYear").value = data.year;
        document.getElementById("updateSemesterFields").style.display = "block";
        idField.readOnly = true;
      })
      .catch((err) => alert(err.message));
  };

  document.getElementById("updateSemesterSubmitBtn").onclick = () => {
    const id = document.getElementById("updateSemesterId").value.trim();
    const name = document.getElementById("updateSemesterName").value.trim();
    const year = document.getElementById("updateSemesterYear").value.trim();

    if (!name || !year) return alert("All fields are required.");

    fetch(`http://localhost:5000/api/semesters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        semester_name: name,
        year: Number(year),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update semester");
        return res.json();
      })
      .then(() => {
        alert("Semester updated successfully");
        clearAll();
      })
      .catch((err) => {
        console.error("Update Semester Error:", err);
        alert("Error updating semester.");
      });
  };
}

function showDeleteSemesterForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Semester</h3>
    <input type="number" id="semesterIdDelete" placeholder="Semester ID" />
    <button id="submitDeleteSemester">Delete</button>
  `;

  document.getElementById('submitDeleteSemester').onclick = async () => {
    const id = parseInt(document.getElementById('semesterIdDelete').value.trim());
    if (!id) {
      alert("Please enter semester ID.");
      return;
    }

    if (!confirm(`Are you sure you want to delete semester ID ${id}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/semesters/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Semester deleted successfully');
        formContainer.innerHTML = '';
      } else {
        const error = await res.text();
        alert('Error: ' + error);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };
}

function fetchSemesters() {
  clearAll();
  fetch("http://localhost:5000/api/semesters")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Unexpected data format");
      if (data.length === 0) {
        tableData.innerHTML = "<p>No semesters found.</p>";
        return;
      }

      // Create table headers
      let tableHTML = `
        <h3>List of Semesters</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Semester ID</th>
              <th>Semester Name</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Add rows for each semester
      data.forEach((s) => {
        tableHTML += `
          <tr>
            <td>${s.semester_id}</td>
            <td>${s.semester_name}</td>
            <td>${s.year}</td>
          </tr>
        `;
      });

      tableHTML += `</tbody></table>`;

      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Semesters Error:", err);
      tableData.innerHTML = "<p>Error loading semesters.</p>";
    });
}

//-----Classrooms Module-------
function showAddClassroomForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Classroom</h3>
    <input type="text" id="classroomId" placeholder="Classroom ID" />
    <input type="text" id="buildingName" placeholder="Building Name" />
    <input type="text" id="roomNumber" placeholder="Room Number" />
    <button id="submitAddClassroom">Add</button>
  `;

  document.getElementById('submitAddClassroom').onclick = async () => {
    const id = document.getElementById('classroomId').value.trim();
    const building = document.getElementById('buildingName').value.trim();
    const room = document.getElementById('roomNumber').value.trim();

    if (!id || !building || !room) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: id,
          building_name: building,
          room_number: room
        })
      });

      if (res.ok) {
        alert('Classroom added successfully');
        clearAll();
      } else {
        const error = await res.text();
        alert('Error: ' + error);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };
}

function showUpdateClassroomForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Classroom</h3>
    <input type="text" id="updateClassroomId" placeholder="Enter Classroom ID" />
    <button id="loadClassroomBtn">Load</button>
    <div id="updateClassroomFields" style="display:none;">
      <input type="text" id="updateBuildingName" placeholder="New Building Name" />
      <input type="text" id="updateRoomNumber" placeholder="New Room Number" />
      <button id="updateClassroomSubmitBtn">Update</button>
    </div>
  `;

  document.getElementById("loadClassroomBtn").onclick = () => {
    const idField = document.getElementById("updateClassroomId");
    const id = idField.value.trim();
    if (!id) return alert("Enter classroom ID");

    fetch(`http://localhost:5000/api/classrooms/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Classroom not found");
        return res.json();
      })
      .then(data => {
        document.getElementById("updateBuildingName").value = data.building_name;
        document.getElementById("updateRoomNumber").value = data.room_number;
        document.getElementById("updateClassroomFields").style.display = "block";
        idField.readOnly = true;
      })
      .catch(err => alert(err.message));
  };

  document.getElementById("updateClassroomSubmitBtn").onclick = () => {
    const id = document.getElementById("updateClassroomId").value.trim();
    const building = document.getElementById("updateBuildingName").value.trim();
    const room = document.getElementById("updateRoomNumber").value.trim();

    if (!building || !room) return alert("All fields are required.");

    fetch(`http://localhost:5000/api/classrooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        building_name: building,
        room_number: room
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update classroom");
        return res.json();
      })
      .then(() => {
        alert("Classroom updated successfully");
        clearAll();
      })
      .catch(err => {
        console.error("Update Classroom Error:", err);
        alert("Error updating classroom.");
      });
  };
}

function showDeleteClassroomForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Classroom</h3>
    <input type="text" id="classroomIdDelete" placeholder="Classroom ID" />
    <button id="submitDeleteClassroom">Delete</button>
  `;

  document.getElementById('submitDeleteClassroom').onclick = async () => {
    const id = document.getElementById('classroomIdDelete').value.trim();
    if (!id) {
      alert("Please enter classroom ID.");
      return;
    }

    if (!confirm(`Are you sure you want to delete classroom ID ${id}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/classrooms/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Classroom deleted successfully');
        clearAll();
      } else {
        const error = await res.text();
        alert('Error: ' + error);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };
}


function fetchClassrooms() {
  clearAll();
  fetch("http://localhost:5000/api/classrooms")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Unexpected data format");
      if (data.length === 0) {
        tableData.innerHTML = "<p>No classrooms found.</p>";
        return;
      }

      let tableHTML = `
        <h3>List of Classrooms</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Classroom ID</th>
              <th>Building Name</th>
              <th>Room Number</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach((c) => {
        tableHTML += `
          <tr>
            <td>${c.classroom_id}</td>
            <td>${c.building_name}</td>
            <td>${c.room_number}</td>
          </tr>
        `;
      });

      tableHTML += `</tbody></table>`;
      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Classrooms Error:", err);
      tableData.innerHTML = "<p>Error loading classrooms.</p>";
    });
}

// --- SCHEDULES MODULE --- //

function showAddScheduleForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Schedule</h3>
    <input type="text" id="course_code" placeholder="Course Code" />
    <input type="number" id="professor_id" placeholder="Professor ID" />
    <input type="text" id="classroom_id" placeholder="Classroom ID" />
    <input type="number" id="semester_id" placeholder="Semester ID" />
    <input type="text" id="day_of_week" placeholder="Day (Monday-Friday)" />
    <input type="time" id="start_time" placeholder="Start Time" />
    <input type="time" id="end_time" placeholder="End Time" />
    <button id="submitAddSchedule">Submit</button>
  `;

  document.getElementById("submitAddSchedule").onclick = () => {
    const course_code = document.getElementById("course_code").value.trim();
    const professor_id = parseInt(document.getElementById("professor_id").value.trim());
    const classroom_id = document.getElementById("classroom_id").value.trim();
    const semester_id = parseInt(document.getElementById("semester_id").value.trim());
    const day_of_week = document.getElementById("day_of_week").value.trim();
    const start_time = document.getElementById("start_time").value.trim();
    const end_time = document.getElementById("end_time").value.trim();

    if (!course_code || !professor_id || !classroom_id || !semester_id || !day_of_week || !start_time || !end_time) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://localhost:5000/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_code,
        professor_id,
        classroom_id,
        semester_id,
        day_of_week,
        start_time,
        end_time,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add schedule");
        return res.json();
      })
      .then(() => {
        alert("Schedule added successfully");
        clearAll();
        fetchSchedules(); // refresh list
      })
      .catch((err) => console.error("Add Schedule Error:", err));
  };
}

// Fetch and display all schedules
function fetchSchedules() {
  clearAll();
  fetch("http://localhost:5000/api/schedules")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch schedules");
      return res.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Unexpected data format");
      if (data.length === 0) {
        tableData.innerHTML = "<p>No schedules found.</p>";
        return;
      }

      let tableHTML = `
        <h3>List of Schedules</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Professor ID</th>
              <th>Classroom ID</th>
              <th>Semester ID</th>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach((sch) => {
        tableHTML += `
          <tr>
            <td>${sch.course_code}</td>
            <td>${sch.professor_id}</td>
            <td>${sch.classroom_id}</td>
            <td>${sch.semester_id}</td>
            <td>${sch.day_of_week}</td>
            <td>${sch.start_time}</td>
            <td>${sch.end_time}</td>
          </tr>
        `;
      });

      tableHTML += `</tbody></table>`;
      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Schedules Error:", err);
      tableData.innerHTML = "<p>Error loading schedules.</p>";
    });
}

// Show Update Schedule Form
function showUpdateScheduleForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Schedule</h3>
    <p>Provide all key fields to identify the schedule</p>
    <input type="text" id="update_course_code" placeholder="Course Code" />
    <input type="number" id="update_professor_id" placeholder="Professor ID" />
    <input type="number" id="update_semester_id" placeholder="Semester ID" />
    <input type="text" id="update_day_of_week" placeholder="Day (Monday-Friday)" />
    <input type="time" id="update_start_time" placeholder="Start Time" />
    <button id="loadScheduleBtn">Load Schedule</button>

    <div id="updateScheduleFields" style="display:none; margin-top:10px;">
      <input type="text" id="update_classroom_id" placeholder="Classroom ID" />
      <input type="time" id="update_end_time" placeholder="End Time" />
      <button id="submitUpdateSchedule">Update</button>
    </div>
  `;

  document.getElementById("loadScheduleBtn").onclick = () => {
    const course_code = document.getElementById("update_course_code").value.trim();
    const professor_id = document.getElementById("update_professor_id").value.trim();
    const semester_id = document.getElementById("update_semester_id").value.trim();
    const day_of_week = document.getElementById("update_day_of_week").value.trim();
    const start_time = document.getElementById("update_start_time").value.trim();

    if (!course_code || !professor_id || !semester_id || !day_of_week || !start_time) {
      alert("Please fill all key fields to load schedule");
      return;
    }

    const url = `http://localhost:5000/api/schedules/${course_code}/${professor_id}/${semester_id}/${day_of_week}/${start_time}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Schedule not found");
        return res.json();
      })
      .then((data) => {
        document.getElementById("update_classroom_id").value = data.classroom_id || "";
        document.getElementById("update_end_time").value = data.end_time || "";
        document.getElementById("updateScheduleFields").style.display = "block";
      })
      .catch((err) => alert(err.message));
  };

  document.getElementById("submitUpdateSchedule").onclick = () => {
    const course_code = document.getElementById("update_course_code").value.trim();
    const professor_id = parseInt(document.getElementById("update_professor_id").value.trim());
    const semester_id = parseInt(document.getElementById("update_semester_id").value.trim());
    const day_of_week = document.getElementById("update_day_of_week").value.trim();
    const start_time = document.getElementById("update_start_time").value.trim();
    const classroom_id = document.getElementById("update_classroom_id").value.trim();
    const end_time = document.getElementById("update_end_time").value.trim();

    if (!classroom_id || !end_time) {
      alert("Please fill all update fields");
      return;
    }

    const url = `http://localhost:5000/api/schedules/${course_code}/${professor_id}/${semester_id}/${day_of_week}/${start_time}`;

    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        new_course_code: course_code,
        new_professor_id: professor_id,
        new_semester_id: semester_id,
        new_day_of_week: day_of_week,
        new_start_time: start_time,
        classroom_id,
        end_time
}),

    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update schedule");
        alert("Schedule updated successfully");
        clearAll();
      })
      .catch((err) => console.error("Update Schedule Error:", err));
  };
}

// Show Delete Schedule Form
function showDeleteScheduleForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Schedule</h3>
    <p>Provide all key fields to identify the schedule</p>
    <input type="text" id="delete_course_code" placeholder="Course Code" />
    <input type="number" id="delete_professor_id" placeholder="Professor ID" />
    <input type="number" id="delete_semester_id" placeholder="Semester ID" />
    <input type="text" id="delete_day_of_week" placeholder="Day (Monday-Friday)" />
    <input type="time" id="delete_start_time" placeholder="Start Time" />
    <button id="deleteScheduleBtn">Delete</button>
  `;

  document.getElementById("deleteScheduleBtn").onclick = () => {
    const course_code = document.getElementById("delete_course_code").value.trim();
    const professor_id = document.getElementById("delete_professor_id").value.trim();
    const semester_id = document.getElementById("delete_semester_id").value.trim();
    const day_of_week = document.getElementById("delete_day_of_week").value.trim();
    const start_time = document.getElementById("delete_start_time").value.trim();

    if (!course_code || !professor_id || !semester_id || !day_of_week || !start_time) {
      alert("Please fill all key fields to delete schedule");
      return;
    }

    const url = `http://localhost:5000/api/schedules/${course_code}/${professor_id}/${semester_id}/${day_of_week}/${start_time}`;

    fetch(url, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete schedule");
        alert("Schedule deleted successfully");
        clearAll();
        fetchSchedules();
      })
      .catch((err) => console.error("Delete Schedule Error:", err));
  };
}


//-------- Grades Module --------
function showAddGradeForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Grade</h3>
    <input type="number" id="addStudentId" placeholder="Student ID" />
    <input type="text" id="addCourseCode" placeholder="Course Code" />
    <input type="number" id="addSemesterId" placeholder="Semester ID" />
    <input type="text" id="addGradeValue" placeholder="Grade (A/B/C/D/F)" />
    <button id="submitAddGrade">Add Grade</button>
  `;

  document.getElementById("submitAddGrade").onclick = async () => {
    const student_id = document.getElementById("addStudentId").value.trim();
    const course_code = document.getElementById("addCourseCode").value.trim();
    const semester_id = document.getElementById("addSemesterId").value.trim();
    const grade = document.getElementById("addGradeValue").value.trim();

    if (!student_id || !course_code || !semester_id || !grade) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id, course_code, semester_id, grade }),
      });

      if (res.ok) {
        alert("Grade added successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function showUpdateGradeForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Grade</h3>
    <input type="number" id="updateStudentId" placeholder="Student ID" />
    <input type="text" id="updateCourseCode" placeholder="Course Code" />
    <input type="number" id="updateSemesterId" placeholder="Semester ID" />
    <input type="text" id="newGradeValue" placeholder="New Grade (A/B/C/D/F)" />
    <button id="submitUpdateGrade">Update Grade</button>
  `;

  document.getElementById("submitUpdateGrade").onclick = async () => {
    const student_id = document.getElementById("updateStudentId").value.trim();
    const course_code = document.getElementById("updateCourseCode").value.trim();
    const semester_id = document.getElementById("updateSemesterId").value.trim();
    const grade = document.getElementById("newGradeValue").value.trim();

    if (!student_id || !course_code || !semester_id || !grade) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/grades/${student_id}/${course_code}/${semester_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade }),
      });

      if (res.ok) {
        alert("Grade updated successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function showDeleteGradeForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Grade</h3>
    <input type="number" id="deleteStudentId" placeholder="Student ID" />
    <input type="text" id="deleteCourseCode" placeholder="Course Code" />
    <input type="number" id="deleteSemesterId" placeholder="Semester ID" />
    <button id="submitDeleteGrade">Delete Grade</button>
  `;

  document.getElementById("submitDeleteGrade").onclick = async () => {
    const student_id = document.getElementById("deleteStudentId").value.trim();
    const course_code = document.getElementById("deleteCourseCode").value.trim();
    const semester_id = document.getElementById("deleteSemesterId").value.trim();

    if (!student_id || !course_code || !semester_id) {
      alert("Please fill all fields.");
      return;
    }

    if (!confirm(`Are you sure you want to delete this grade?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/grades/${student_id}/${course_code}/${semester_id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Grade deleted successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function fetchGrades() {
  clearAll();
  fetch("http://localhost:5000/api/grades")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        tableData.innerHTML = "<p>No grades found.</p>";
        return;
      }

      let tableHTML = `
        <h3>All Grades</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Course Code</th>
              <th>Semester ID</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach(g => {
        tableHTML += `
          <tr>
            <td>${g.student_id}</td>
            <td>${g.course_code}</td>
            <td>${g.semester_id}</td>
            <td>${g.grade}</td>
          </tr>
        `;
      });

      tableHTML += "</tbody></table>";
      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Grades Error:", err);
      tableData.innerHTML = "<p>Error loading grades.</p>";
    });
}

// -------- Enrollments Module --------
function showAddEnrollmentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Enrollment</h3>
    <input type="number" id="addStudentId" placeholder="Student ID" />
    <input type="text" id="addCourseCode" placeholder="Course Code" />
    <input type="number" id="addSemesterId" placeholder="Semester ID" />
    <input type="date" id="addEnrollmentDate" placeholder="Enrollment Date" />
    <button id="submitAddEnrollment">Add Enrollment</button>
  `;

  document.getElementById("submitAddEnrollment").onclick = async () => {
    const student_id = document.getElementById("addStudentId").value.trim();
    const course_code = document.getElementById("addCourseCode").value.trim();
    const semester_id = document.getElementById("addSemesterId").value.trim();
    const enrollment_date = document.getElementById("addEnrollmentDate").value;

    if (!student_id || !course_code || !semester_id || !enrollment_date) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id, course_code, semester_id, enrollment_date }),
      });

      if (res.ok) {
        alert("Enrollment added successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function showUpdateEnrollmentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Enrollment Date</h3>
    <input type="number" id="updateStudentId" placeholder="Student ID" />
    <input type="text" id="updateCourseCode" placeholder="Course Code" />
    <input type="number" id="updateSemesterId" placeholder="Semester ID" />
    <input type="date" id="newEnrollmentDate" placeholder="New Enrollment Date" />
    <button id="submitUpdateEnrollment">Update Enrollment</button>
  `;

  document.getElementById("submitUpdateEnrollment").onclick = async () => {
    const student_id = document.getElementById("updateStudentId").value.trim();
    const course_code = document.getElementById("updateCourseCode").value.trim();
    const semester_id = document.getElementById("updateSemesterId").value.trim();
    const enrollment_date = document.getElementById("newEnrollmentDate").value;

    if (!student_id || !course_code || !semester_id || !enrollment_date) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/enrollments/${student_id}/${course_code}/${semester_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_date }),
      });

      if (res.ok) {
        alert("Enrollment updated successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function showDeleteEnrollmentForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Enrollment</h3>
    <input type="number" id="deleteStudentId" placeholder="Student ID" />
    <input type="text" id="deleteCourseCode" placeholder="Course Code" />
    <input type="number" id="deleteSemesterId" placeholder="Semester ID" />
    <button id="submitDeleteEnrollment">Delete Enrollment</button>
  `;

  document.getElementById("submitDeleteEnrollment").onclick = async () => {
    const student_id = document.getElementById("deleteStudentId").value.trim();
    const course_code = document.getElementById("deleteCourseCode").value.trim();
    const semester_id = document.getElementById("deleteSemesterId").value.trim();

    if (!student_id || !course_code || !semester_id) {
      alert("Please fill all fields.");
      return;
    }

    if (!confirm(`Are you sure you want to delete this enrollment?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/enrollments/${student_id}/${course_code}/${semester_id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Enrollment deleted successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function fetchEnrollments() {
  clearAll();
  fetch("http://localhost:5000/api/enrollments")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        tableData.innerHTML = "<p>No enrollments found.</p>";
        return;
      }

      let tableHTML = `
        <h3>All Enrollments</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Course Code</th>
              <th>Semester ID</th>
              <th>Enrollment Date</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach(e => {
        tableHTML += `
          <tr>
            <td>${e.student_id}</td>
            <td>${e.course_code}</td>
            <td>${e.semester_id}</td>
            <td>${e.enrollment_date}</td>
          </tr>
        `;
      });

      tableHTML += "</tbody></table>";
      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Enrollments Error:", err);
      tableData.innerHTML = "<p>Error loading enrollments.</p>";
    });
}

//Atendance module
function showAddAttendanceForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Add Attendance</h3>
    <input type="number" id="addAttendanceStudentId" placeholder="Student ID" />
    <input type="text" id="addAttendanceCourseCode" placeholder="Course Code" />
    <input type="number" id="addAttendanceSemesterId" placeholder="Semester ID" />
    <input type="date" id="addAttendanceDate" />
    <select id="addAttendanceStatus">
      <option value="">Select Status</option>
      <option value="Present">Present</option>
      <option value="Absent">Absent</option>
      <option value="Late">Late</option>
    </select>
    <button id="submitAddAttendance">Add Attendance</button>
  `;

  document.getElementById("submitAddAttendance").onclick = async () => {
    const student_id = document.getElementById("addAttendanceStudentId").value.trim();
    const course_code = document.getElementById("addAttendanceCourseCode").value.trim();
    const semester_id = document.getElementById("addAttendanceSemesterId").value.trim();
    const date = document.getElementById("addAttendanceDate").value;
    const status = document.getElementById("addAttendanceStatus").value;

    if (!student_id || !course_code || !semester_id || !date || !status) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id, course_code, semester_id, date, status }),
      });

      if (res.ok) {
        alert("Attendance added successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function showUpdateAttendanceForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Update Attendance Status</h3>
    <input type="number" id="updateAttendanceStudentId" placeholder="Student ID" />
    <input type="text" id="updateAttendanceCourseCode" placeholder="Course Code" />
    <input type="number" id="updateAttendanceSemesterId" placeholder="Semester ID" />
    <input type="date" id="updateAttendanceDate" />
    <select id="updateAttendanceStatus">
      <option value="">Select New Status</option>
      <option value="Present">Present</option>
      <option value="Absent">Absent</option>
      <option value="Late">Late</option>
    </select>
    <button id="submitUpdateAttendance">Update Attendance</button>
  `;

  document.getElementById("submitUpdateAttendance").onclick = async () => {
    const student_id = document.getElementById("updateAttendanceStudentId").value.trim();
    const course_code = document.getElementById("updateAttendanceCourseCode").value.trim();
    const semester_id = document.getElementById("updateAttendanceSemesterId").value.trim();
    const date = document.getElementById("updateAttendanceDate").value;
    const status = document.getElementById("updateAttendanceStatus").value;

    if (!student_id || !course_code || !semester_id || !date || !status) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${student_id}/${course_code}/${semester_id}/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert("Attendance updated successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function showDeleteAttendanceForm() {
  clearAll();
  formContainer.innerHTML = `
    <h3>Delete Attendance</h3>
    <input type="number" id="deleteAttendanceStudentId" placeholder="Student ID" />
    <input type="text" id="deleteAttendanceCourseCode" placeholder="Course Code" />
    <input type="number" id="deleteAttendanceSemesterId" placeholder="Semester ID" />
    <input type="date" id="deleteAttendanceDate" />
    <button id="submitDeleteAttendance">Delete Attendance</button>
  `;

  document.getElementById("submitDeleteAttendance").onclick = async () => {
    const student_id = document.getElementById("deleteAttendanceStudentId").value.trim();
    const course_code = document.getElementById("deleteAttendanceCourseCode").value.trim();
    const semester_id = document.getElementById("deleteAttendanceSemesterId").value.trim();
    const date = document.getElementById("deleteAttendanceDate").value;

    if (!student_id || !course_code || !semester_id || !date) {
      alert("Please fill all fields.");
      return;
    }

    if (!confirm("Are you sure you want to delete this attendance record?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${student_id}/${course_code}/${semester_id}/${date}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Attendance deleted successfully.");
        clearAll();
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };
}

function fetchAttendance() {
  clearAll();
  fetch("http://localhost:5000/api/attendance")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        tableData.innerHTML = "<p>No attendance records found.</p>";
        return;
      }

      let tableHTML = `
        <h3>All Attendance Records</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Course Code</th>
              <th>Semester ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach(a => {
        const formattedDate = new Date(a.date).toISOString().split("T")[0];
        tableHTML += `
          <tr>
            <td>${a.student_id}</td>
            <td>${a.course_code}</td>
            <td>${a.semester_id}</td>
            <td>${formattedDate}</td>
            <td>${a.status}</td>
          </tr>
        `;
      });

      tableHTML += "</tbody></table>";
      tableData.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.error("Fetch Attendance Error:", err);
      tableData.innerHTML = "<p>Error loading attendance records.</p>";
    });
}




// ----------- BUTTON EVENTS ------------ //

addBtn.onclick = () => {
  if (currentTable === "departments") showAddDepartmentForm();
  else if (currentTable === "students") showAddStudentForm();
  else if (currentTable === "professors") showAddProfessorForm(); 
  else if (currentTable === "courses") showAddCourseForm();
  else if (currentTable === "semesters") showAddSemesterForm();
  else if (currentTable == "classrooms") showAddClassroomForm();
  else if (currentTable === "schedules") showAddScheduleForm();
  else if (currentTable === "grades") showAddGradeForm();
  else if (currentTable === "enrollments") showAddEnrollmentForm();
  else if (currentTable === "attendance") showAddAttendanceForm();
};

updateBtn.onclick = () => {
  if (currentTable === "departments") showUpdateDepartmentForm();
  else if (currentTable === "students") showUpdateStudentForm();
  else if (currentTable === "professors") showUpdateProfessorForm(); 
  else if (currentTable === "courses") showUpdateCourseForm();
  else if (currentTable === "semesters") showUpdateSemesterForm(); 
  else if (currentTable == "classrooms") showUpdateClassroomForm();
  else if (currentTable === "schedules") showUpdateScheduleForm();
  else if (currentTable === "grades") showUpdateGradeForm();
  else if (currentTable === "enrollments") showUpdateEnrollmentForm();
  else if (currentTable === "attendance") showUpdateAttendanceForm();
};

deleteBtn.onclick = () => {
  if (currentTable === "departments") showDeleteDepartmentForm();
  else if (currentTable === "students") showDeleteStudentForm();
  else if (currentTable === "professors") showDeleteProfessorForm(); 
  else if (currentTable === "courses") showDeleteCourseForm();
  else if (currentTable === "semesters") showDeleteSemesterForm();
  else if (currentTable == "classrooms") showDeleteClassroomForm();
  else if (currentTable === "schedules") showDeleteScheduleForm();
  else if (currentTable === "grades") showDeleteGradeForm();
  else if (currentTable === "enrollments") showDeleteEnrollmentForm();
  else if (currentTable === "attendance") showDeleteAttendanceForm();
};

viewBtn.onclick = () => {
  if (currentTable === "departments") fetchDepartments();
  else if (currentTable === "students") fetchStudents();
  else if (currentTable === "professors") fetchProfessors(); 
  else if (currentTable === "courses") fetchCourses();
  else if (currentTable === "semesters") fetchSemesters();
  else if (currentTable == "classrooms") fetchClassrooms();
  else if (currentTable === "schedules") fetchSchedules();
  else if (currentTable === "grades") fetchGrades();
  else if (currentTable === "enrollments") fetchEnrollments();
  else if (currentTable === "attendance") fetchAttendance();
};

function showStudentsReport() {
  fetch("http://localhost:5000/api/reports/students")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.department_name);
      const values = data.map(item => item.student_count);
      renderChart("Students per Department", labels, values);
    });
}

function showProfessorsReport() {
  fetch("http://localhost:5000/api/reports/professors")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.department_name);
      const values = data.map(item => item.professor_count);
      renderChart("Professors per Department", labels, values);
    });
}

function showCoursesReport() {
  fetch("http://localhost:5000/api/reports/courses")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.department_name);
      const values = data.map(item => item.course_count);
      renderChart("Courses per Department", labels, values);
    });
}

function showSemestersReport() {
  fetch("http://localhost:5000/api/reports/enrollments-per-semester")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.semester_name);
      const values = data.map(item => item.enrollment_count);
      renderChart("Enrollments per Semester", labels, values);
    });
}

function showClassroomsReport() {
  fetch("http://localhost:5000/api/reports/schedules-per-classroom")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.room_number);
      const values = data.map(item => item.schedule_count);
      renderChart("Schedules per Classroom", labels, values);
    });
}

function showSchedulesReport() {
  fetch("http://localhost:5000/api/reports/schedules-per-day")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.day_of_week);
      const values = data.map(item => item.class_count);
      renderChart("Classes per Day of Week", labels, values);
    });
}

function showGradesReport() {
  fetch("http://localhost:5000/api/reports/grade-distribution")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.grade);
      const values = data.map(item => item.count);
      renderChart("Grade Distribution", labels, values);
    });
}

function showAttendanceReport() {
  fetch("http://localhost:5000/api/reports/attendance-summary")
    .then(res => res.json())
    .then(data => {
      const labels = ["Present", "Absent", "Late"];
      const values = [data.present, data.absent, data.late];
      renderChart("Attendance Summary", labels, values);
    });
}



let chart;

function renderChart(title, labels, values) {
  const canvas = document.getElementById("reportChart");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      },
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  });
}

document.getElementById("reportSelect").addEventListener("change", function () {
  const selected = this.value;

  switch (selected) {
    case "students":
      showStudentsReport();
      break;
    case "professors":
      showProfessorsReport();
      break;
    case "courses":
      showCoursesReport();
      break;
    case "semesters":
      showSemestersReport();
      break;
    case "classrooms":
      showClassroomsReport();
      break;
    case "schedules":
      showSchedulesReport();
      break;
    case "grades":
      showGradesReport();
      break;
    case "attendance":
      showAttendanceReport();
      break;
    default:
      break;
  }
});


