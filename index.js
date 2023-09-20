const studentList = document.getElementById("studentList");
const studentName = document.getElementById("name");
const studentSubject = document.getElementById("subject");
const studentNote = document.getElementById("note");
const addStudentNote = document.querySelector("#addStudentNote");
const form = document.querySelector("#form");

let students = JSON.parse(localStorage.getItem("students")) || [];

class Alumno {
  constructor(name, subject, note) {
    this.studentName = name;
    this.subject = subject;
    this.note = note;
  }
}

// Verifico si no esta el campo de nombre vacio
function verifyEmptyName() {
  if (studentName.value.trim() === "") {
    alert(`El campo de Nombre y Apellido no puede estar vacío`);
    return false;
  }
  return true;
}

// Capitalizo la primera letra de cada nombre si no lo está
function capitalizeWords(text) {
  return text.replace(
    /\b\w[\wáéíóúüñ]*\b/g,
    (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
  );
}

// Verifico si esta escribiendo una nota del 1 al 10
function verifyNote() {
  const possibleNotes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const selectedNote = parseInt(studentNote.value);
  if (!possibleNotes.includes(selectedNote)) {
    alert(`Debe ingresar una nota del 1 al 10`);
    studentNote.value = "";
    return false;
  }
  if (possibleNotes.value === "") {
    alert(`Debe ingresar una nota`);
    return false;
  }
  return true;
}

studentNote.addEventListener("input", verifyNote);


// Agrego los nombres a las tablas
function addStudent(student) {
  const studentRow = document.createElement("tr");
  
  const studentNameItem = document.createElement("td");
  studentNameItem.innerHTML = student.studentName;

  const studentSubjectItem = document.createElement("td");
  studentSubjectItem.innerHTML = student.subject; 

  const studentNoteItem = document.createElement("td");
  studentNoteItem.innerHTML = student.note;

  studentRow.appendChild(studentNameItem);
  studentRow.appendChild(studentSubjectItem);
  studentRow.appendChild(studentNoteItem);

  studentList.appendChild(studentRow);

  if (students.length > 0) {
    addStudentNote.style.display = "none";
  } else {
    addStudentNote.style.display = "block";
  }
  
  studentName.value = "";
  studentSubject.value = "Matemática";
  studentNote.value = "";
}

function loadStudents() {
  students.forEach((student) => {
    addStudent(student);
  });
}

// Funcion del submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!verifyEmptyName() || !verifyNote()) {
    return;
  }

  const capitalizedStudentName = capitalizeWords(
    studentName.value.toLowerCase()
  );
  studentName.value = capitalizedStudentName;

  const name = studentName.value;
  const subject = studentSubject.value;
  const note = studentNote.value;

  const student = new Alumno(name, subject, note);

  students.push(student);
  console.log(student);

  localStorage.setItem("students", JSON.stringify(students));

  addStudent(student)

});

loadStudents();