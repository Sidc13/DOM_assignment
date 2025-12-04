// ------------------------------
// Element References
// ------------------------------
const studentForm = document.getElementById("student-form");
const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const studentEmailInput = document.getElementById("studentEmail");
const studentContactInput = document.getElementById("studentContact");
const recordsCount = document.getElementById("recordsCount");
const studentsTbody = document.getElementById("studentsTbody");

// ------------------------------
// localStorage Helpers
// ------------------------------
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

// ------------------------------
// Validation Rules (Submit-Only)
// ------------------------------
function validateForm() {
  let isValid = true;

  clearErrors();

  // Student ID: required + numbers only
  if (!/^\d+$/.test(studentIdInput.value.trim())) {
    showError("error-studentId", "Student ID must contain digits only");
    isValid = false;
  }

  // Full Name: letters and spaces only
  if (!/^[A-Za-z ]+$/.test(studentNameInput.value.trim())) {
    showError("error-studentName", "Name can only contain letters and spaces");
    isValid = false;
  }

  // Email: basic pattern check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(studentEmailInput.value.trim())) {
    showError("error-studentEmail", "Enter a valid email address");
    isValid = false;
  }

  // Contact: numbers only + 10 digits minimum
  if (!/^\d{10,}$/.test(studentContactInput.value.trim())) {
    showError("error-studentContact", "Contact must be at least 10 digits");
    isValid = false;
  }

  return isValid;
}

// ------------------------------
// Error Helpers
// ------------------------------
function showError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

function clearErrors() {
  document
    .querySelectorAll(".field-error")
    .forEach((el) => (el.textContent = ""));
}

// ------------------------------
// Render Students in Table
// ------------------------------
function renderStudents() {
  const students = getStudents();
  studentsTbody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.studentId}</td>
      <td>${student.studentName}</td>
      <td>${student.studentEmail}</td>
      <td>${student.studentContact}</td>
      <td>
        <button class="action-btn edit-btn" data-index="${index}">Edit</button>
        <button class="action-btn delete-btn" data-index="${index}">Delete</button>
      </td>
    `;

    studentsTbody.appendChild(row);
  });

  recordsCount.textContent = students.length;
}

// ------------------------------
// Form Submit Handler: Add Student
// ------------------------------
studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const students = getStudents();

  // Check for duplicate ID
  const exists = students.some(
    (s) => s.studentId === studentIdInput.value.trim()
  );

  if (exists) {
    showError("error-studentId", "This Student ID already exists");
    return;
  }

  const newStudent = {
    studentId: studentIdInput.value.trim(),
    studentName: studentNameInput.value.trim(),
    studentEmail: studentEmailInput.value.trim(),
    studentContact: studentContactInput.value.trim(),
  };

  students.push(newStudent);
  saveStudents(students);
  renderStudents();
  studentForm.reset();
  clearErrors();
});

// ------------------------------
// Initial Load
// ------------------------------
document.addEventListener("DOMContentLoaded", renderStudents);
