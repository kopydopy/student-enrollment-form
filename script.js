const form = document.getElementById("enrollment-form");
const courseSelect = document.getElementById("course");
const majorField = document.getElementById("major-field");
const majorSelect = document.getElementById("major");
const table = document.getElementById("records-table");
const tableBody = table.querySelector("tbody");
const emptyState = document.getElementById("records-empty");
const successMessage = document.getElementById("success-message");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = {
  studentId: {
    input: document.getElementById("student-id"),
    error: document.getElementById("student-id-error"),
    validate: (value) => {
      if (!value) return "Student ID is required.";
      if (value.length < 5) return "Student ID must be at least 5 characters.";
      return "";
    },
  },
  prefix: {
    input: document.getElementById("prefix"),
    error: document.getElementById("prefix-error"),
    validate: (value) =>
      value && value.length < 2 ? "Prefix must be at least 2 characters." : "",
  },
  firstName: {
    input: document.getElementById("first-name"),
    error: document.getElementById("first-name-error"),
    validate: (value) => {
      if (!value) return "First name is required.";
      if (value.length < 3) return "First name must be at least 3 characters.";
      return "";
    },
  },
  middleName: {
    input: document.getElementById("middle-name"),
    error: document.getElementById("middle-name-error"),
    validate: (value) =>
      value && value.length < 2
        ? "Middle name must be at least 2 characters."
        : "",
  },
  lastName: {
    input: document.getElementById("last-name"),
    error: document.getElementById("last-name-error"),
    validate: (value) => {
      if (!value) return "Last name is required.";
      if (value.length < 2) return "Last name must be at least 2 characters.";
      return "";
    },
  },
  suffix: {
    input: document.getElementById("suffix"),
    error: document.getElementById("suffix-error"),
    validate: (value) =>
      value && value.length < 2 ? "Suffix must be at least 2 characters." : "",
  },
  email: {
    input: document.getElementById("email"),
    error: document.getElementById("email-error"),
    validate: (value) => {
      if (!value) return "Email is required.";
      if (!emailPattern.test(value)) return "Enter a valid email address.";
      return "";
    },
  },
  course: {
    input: courseSelect,
    error: document.getElementById("course-error"),
    validate: (value) => (value ? "" : "Please select a course."),
  },
  major: {
    input: majorSelect,
    error: document.getElementById("major-error"),
    validate: (value) => {
      if (courseSelect.value !== "BSIT") return "";
      return value ? "" : "Please select a major for BSIT.";
    },
  },
  yearLevel: {
    input: document.getElementById("year-level"),
    error: document.getElementById("year-level-error"),
    validate: (value) => (value ? "" : "Please select a year level."),
  },
};

function setError(field, message) {
  field.error.textContent = message;
  field.input.classList.toggle("invalid", Boolean(message));
  field.input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(field) {
  const message = field.validate(field.input.value.trim());
  setError(field, message);
  return !message;
}

function hideSuccess() {
  successMessage.hidden = true;
}

function toggleMajorField() {
  const isBsit = courseSelect.value === "BSIT";
  majorField.hidden = !isBsit;
  majorSelect.required = isBsit;

  if (!isBsit) {
    majorSelect.value = "";
    setError(fields.major, "");
  }
}

function addRecord(data) {
  const row = document.createElement("tr");
  const values = [
    data.studentId,
    data.prefix || "—",
    data.firstName,
    data.middleName || "—",
    data.lastName,
    data.suffix || "—",
    data.email,
    data.course,
    data.major || "—",
    data.yearLevel,
  ];

  values.forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });

  tableBody.prepend(row);
  table.hidden = false;
  emptyState.hidden = true;
}

courseSelect.addEventListener("change", () => {
  hideSuccess();
  toggleMajorField();
  setError(fields.course, "");
});

Object.values(fields).forEach((field) => {
  field.input.addEventListener("input", () => {
    hideSuccess();
    setError(field, "");
  });
  field.input.addEventListener("change", () => {
    hideSuccess();
    setError(field, "");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideSuccess();

  const isValid = Object.values(fields).every(validateField);
  if (!isValid) {
    const firstInvalid = Object.values(fields).find((field) =>
      field.input.classList.contains("invalid")
    );
    firstInvalid?.input.focus();
    return;
  }

  addRecord({
    studentId: fields.studentId.input.value.trim(),
    prefix: fields.prefix.input.value.trim(),
    firstName: fields.firstName.input.value.trim(),
    middleName: fields.middleName.input.value.trim(),
    lastName: fields.lastName.input.value.trim(),
    suffix: fields.suffix.input.value.trim(),
    email: fields.email.input.value.trim(),
    course: fields.course.input.value,
    major: fields.major.input.value,
    yearLevel: fields.yearLevel.input.value,
  });

  form.reset();
  toggleMajorField();
  Object.values(fields).forEach((field) => setError(field, ""));
  successMessage.hidden = false;
});

toggleMajorField();
