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
              <th>Department ID</th>
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
            <td>${p.department_id}</td>
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
    const id = document.getElementById("updateProfId").value.trim();
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
    const code = document.getElementById("updateCourseCode").value.trim();
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
    const id = document.getElementById("updateSemesterId").value.trim();
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



// ----------- BUTTON EVENTS ------------ //

addBtn.onclick = () => {
  if (currentTable === "departments") showAddDepartmentForm();
  else if (currentTable === "students") showAddStudentForm();
  else if (currentTable === "professors") showAddProfessorForm(); 
  else if (currentTable === "courses") showAddCourseForm();
  else if (currentTable === "semesters") showAddSemesterForm();
};

updateBtn.onclick = () => {
  if (currentTable === "departments") showUpdateDepartmentForm();
  else if (currentTable === "students") showUpdateStudentForm();
  else if (currentTable === "professors") showUpdateProfessorForm(); 
  else if (currentTable === "courses") showUpdateCourseForm();
   else if (currentTable === "semesters") showUpdateSemesterForm(); 
};

deleteBtn.onclick = () => {
  if (currentTable === "departments") showDeleteDepartmentForm();
  else if (currentTable === "students") showDeleteStudentForm();
  else if (currentTable === "professors") showDeleteProfessorForm(); 
  else if (currentTable === "courses") showDeleteCourseForm();
   else if (currentTable === "semesters") showDeleteSemesterForm();
};

viewBtn.onclick = () => {
  if (currentTable === "departments") fetchDepartments();
  else if (currentTable === "students") fetchStudents();
  else if (currentTable === "professors") fetchProfessors(); 
  else if (currentTable === "courses") fetchCourses();
  else if (currentTable === "semesters") fetchSemesters();
};


