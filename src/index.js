const inputDNI = document.querySelector("#inputDNI");
const inputName = document.querySelector("#inputName");
const inputAge = document.querySelector("#inputAge");
const deleteStudentIcon = document.querySelector("#deleteStudent");
const selectElement = document.querySelector("#selectElement");
const form = document.querySelector("#form");

const mathNote = document.querySelector("#mathNote");
const physicsNote = document.querySelector("#physicsNote");
const chemNote = document.querySelector("#chemNote");
const devNote = document.querySelector("#devNote");

let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];

class Alumno {
  constructor(dni, name, age, average) {
    this.inputDNI = dni;
    this.inputName = name;
    this.inputAge = age;
    this.subjects = {
      Matematica: null,
      Fisica: null,
      Quimica: null,
      Programacion: null,
    };
    this.average = average || 0;
  }

  calculateAverage() {
    let sum = 0;
    let count = 0;
    for (const subject in this.subjects) {
      if (this.subjects[subject] !== null) {
        sum += this.subjects[subject];
        count++;
      }
    }
    if (count === 0) return 0;
    return sum / count;
  }
}

// Convierto cada objeto en una instancia de Alumno ya que sino alumnos era un JSON regular y no una instancia de Alumnos
alumnos = alumnos.map(
  (alumno) =>
    new Alumno(
      alumno.inputDNI,
      alumno.inputName,
      alumno.inputAge,
      alumno.average
    )
);

//Muestro los alumnos ya cargados en el select al inciar la pagina
updateStudentDropdownWithJson();

// Verifico si la edad ingresada es correcta
function correctAge(age) {
  const parsedAge = parseInt(age, 10);

  if (isNaN(parsedAge)) {
    return false;
  }

  return parsedAge >= 18 && parsedAge <= 100;
}

// Verifico si no esta el campo de nombre vacio
function verifyEmptyFields() {
  if (
    inputName.value.trim() === "" ||
    inputDNI.value.trim() === "" ||
    inputAge.value.trim() === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Debe completar todos los campos",
    });
    return false;
  }

  if (!correctAge(inputAge.value)) {
    Swal.fire({
      icon: "error",
      title: "La edad ingresada no es válida",
    });
    return false;
  }

  return true;
}

function updateStudentDropdownWithJson() {
  fetch("./src/alumnos.json")
    .then((res) => res.json())
    .then((jsonAlumnos) => {
      let localStorageAlumnos =
        JSON.parse(localStorage.getItem("alumnos")) || [];

      // Eliminar duplicados basados en el DNI
      const combinedAlumnos = [...jsonAlumnos, ...localStorageAlumnos].filter(
        (alumno, index, self) =>
          self.findIndex((t) => t.inputDNI === alumno.inputDNI) === index
      );

      alumnos = combinedAlumnos.map(
        (alumno) =>
          new Alumno(
            alumno.inputDNI,
            alumno.inputName,
            alumno.inputAge,
            alumno.average
          )
      );

      // Actualizar el localStorage
      localStorage.setItem("alumnos", JSON.stringify(alumnos));

      // Actualizar el dropdown
      updateStudentDropdown();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Ha ocurrido un error, vuelva a intentarlo",
      });
      console.error("Ha ocurrido un error", error);
    });
}

// Capitalizo la primera letra de cada nombre si no lo está
function capitalizeWords(text) {
  return text.replace(
    /\b\w[\wáéíóúüñ]*\b/g,
    (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
  );
}

// Agrego los alumnos al select de Carga de Notas
function updateStudentDropdown() {
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }

  const defaultOption = document.createElement("option");
  defaultOption.value = "Seleccionar";
  defaultOption.textContent = "Seleccionar";
  selectElement.appendChild(defaultOption);

  for (let i = 0; i < alumnos.length; i++) {
    const student = alumnos[i];
    const option = document.createElement("option");
    option.value = student.inputDNI;
    option.textContent = student.inputName;
    selectElement.appendChild(option);
  }
}

// Agrego el alumno al array de alumnos
function addNewStudent(dni, name, age) {
  const existingStudent = alumnos.find((alumno) => alumno.inputDNI === dni);

  if (existingStudent) {
    Swal.fire({
      icon: "error",
      title: "Este DNI ya ha sido registrado",
    });
    return;
  }

  const newStudent = new Alumno(dni, name, age);

  alumnos.push(newStudent);

  localStorage.setItem("alumnos", JSON.stringify(alumnos));
  console.log(alumnos);

  Swal.fire({
    icon: "success",
    title: "Alumno agregado",
  });

  inputDNI.value = "";
  inputName.value = "";
  inputAge.value = "";

  updateStudentDropdown();
}

function deleteStudent() {
  const selectedDNI = selectElement.value;

  const index = alumnos.findIndex((alumno) => alumno.inputDNI === selectedDNI);
  if (index !== -1) {
    alumnos.splice(index, 1);
  }

  localStorage.setItem("alumnos", JSON.stringify(alumnos));
  updateStudentDropdown();

  deleteStudentIcon.style.display = "none";
  selectedStudentDiv.style.display = "none";
  const selectedStudent = document.querySelector("#selectedStudent");
  selectedStudent.innerHTML = "";

  Swal.fire({
    icon: "success",
    title: "Eliminado",
    text: "El alumno ha sido eliminado.",
  });
}

// Ingresa campos vacios en los input de las materias
function setStudentGradesToInput(studentDNI) {
  const student = alumnos.find((alumno) => alumno.inputDNI === studentDNI);
  if (!student) {
    return;
  }

  mathNote.value = student.subjects.Matematica || "";
  physicsNote.value = student.subjects.Fisica || "";
  chemNote.value = student.subjects.Quimica || "";
  devNote.value = student.subjects.Programacion || "";
}

function updateStudentGrade(subjectName, grade) {
  const selectedDNI = selectElement.value;
  if (!selectedDNI) {
    return;
  }

  const student = alumnos.find((alumno) => alumno.inputDNI === selectedDNI);
  if (!student) {
    return;
  }

  student.subjects[subjectName] = parseInt(grade, 10);
  console.log(student);
  student.average = student.calculateAverage();

  localStorage.setItem("alumnos", JSON.stringify(alumnos));

  const finalAverage = document.querySelector("#finalAverage");
  if (finalAverage) {
    finalAverage.textContent = `${student.average.toFixed(2)}`;
  }
}

//Evento que muestra el alumno con su tabla de materias
selectElement.addEventListener("change", (e) => {
  const selectedDNI = e.target.value;
  const deleteStudent = document.querySelector("#deleteStudent");  
  const selectedStudent = document.querySelector("#selectedStudent");

  if (selectedDNI === "Seleccionar") {
    selectedStudent.style.display = "none";
    deleteStudent.style.display = "none";
    selectedStudentDiv.style.display = "none";
    return;
  }

  const alumnoSeleccionado = alumnos.find(
    (alumno) => alumno.inputDNI === selectedDNI
  );

  setStudentGradesToInput(selectedDNI);


  selectedStudent.innerHTML = `${alumnoSeleccionado.inputName}`;
  selectedStudent.style.display = "inline";
  deleteStudent.style.display = "inline";
  selectedStudentDiv.style.display = "flex";
});

// Evento del submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!verifyEmptyFields()) {
    return;
  }
  const dni = document.querySelector("#inputDNI").value;
  const name = capitalizeWords(document.querySelector("#inputName").value);
  const age = document.querySelector("#inputAge").value;
  // const selectedIconId = document.querySelector('input[name="pokemonIcon"]:checked').id;

  addNewStudent(dni, name, age);
});

//Posibilidad de eliminar algun alumno agregado
deleteStudentIcon.addEventListener("click", (e) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Estás a punto de eliminar a este alumno de la lista.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteStudent();
    }
  });
});

mathNote.addEventListener("input", function () {
  if (this.value < 1) this.value = 1;
  if (this.value > 10) this.value = 10;
  updateStudentGrade("Matematica", this.value);
});

physicsNote.addEventListener("input", function () {
  if (this.value < 1) this.value = 1;
  if (this.value > 10) this.value = 10;
  updateStudentGrade("Fisica", this.value);
});

chemNote.addEventListener("input", function () {
  if (this.value < 1) this.value = 1;
  if (this.value > 10) this.value = 10;
  updateStudentGrade("Quimica", this.value);
});

devNote.addEventListener("input", function () {
  if (this.value < 1) this.value = 1;
  if (this.value > 10) this.value = 10;
  updateStudentGrade("Programacion", this.value);
});
