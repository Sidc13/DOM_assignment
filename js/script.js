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
let editIndex = null; // Tracks which student we are editing

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
// Enter Edit Mode
// ------------------------------
function enterEditMode(index) {
  const students = getStudents();
  const student = students[index];

  // Fill the form
  studentIdInput.value = student.studentId;
  studentNameInput.value = student.studentName;
  studentEmailInput.value = student.studentEmail;
  studentContactInput.value = student.studentContact;

  // Lock ID to prevent changing unique key
  studentIdInput.setAttribute("readonly", true);

  // Change button text
  document.getElementById("addStudentBtn").textContent = "Update Student";

  editIndex = index; // Save which record is being edited
}

// ------------------------------
// Reset UI back to Add mode after editing
// ------------------------------
function resetToAddMode() {
  studentForm.reset();
  clearErrors();
  studentIdInput.removeAttribute("readonly");
  document.getElementById("addStudentBtn").textContent = "Add Student";
  editIndex = null;
}

// ------------------------------
// Form Submit Handler: Add Student
// ------------------------------
studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // If editing → update instead of add
  if (editIndex !== null) {
    if (!validateForm()) return;

    const students = getStudents();

    // Update values
    students[editIndex].studentName = studentNameInput.value.trim();
    students[editIndex].studentEmail = studentEmailInput.value.trim();
    students[editIndex].studentContact = studentContactInput.value.trim();

    saveStudents(students);
    renderStudents();
    resetToAddMode();
    return;
  }

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
// Delete Student Handler
// ------------------------------
studentsTbody.addEventListener("click", function (e) {
  if (!e.target.classList.contains("delete-btn")) return;

  const index = e.target.getAttribute("data-index");
  const students = getStudents();

  const confirmed = confirm(
    `Are you sure you want to delete Student ID: ${students[index].studentId}?`
  );
  if (!confirmed) return;

  students.splice(index, 1);
  saveStudents(students);
  renderStudents();
});

// ------------------------------
// Edit Student Handler
// ------------------------------
studentsTbody.addEventListener("click", function (e) {
  if (!e.target.classList.contains("edit-btn")) return;

  const index = e.target.getAttribute("data-index");
  enterEditMode(index);
});

// ------------------------------
// Initial Load
// ------------------------------
document.addEventListener("DOMContentLoaded", renderStudents);
