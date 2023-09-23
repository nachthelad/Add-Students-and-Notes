const inputDNI = document.querySelector("#inputDNI");
const inputName = document.querySelector("#inputName");
const inputAge = document.querySelector("#inputAge");
// const pokemonIcon = document.querySelector('input[name="pokemonIcon"]:checked').id;
const selectElement = document.querySelector("#selectElement");
const form = document.querySelector("#form");

let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];

class Alumno {
  constructor(dni, name, age, spriteUrl) {
    this.inputName = name;
    this.inputDNI = dni;
    this.inputAge = age;
    this.spriteUrl = spriteUrl;
  }
}
//Muestro los alumnos ya cargados en el select al inciar la pagina
updateStudentDropdown();

// Verifico si no esta el campo de nombre vacio
function verifyEmptyFields() {
  if (inputName.value.trim() === "" || inputDNI.value.trim() === "" ||inputAge.value.trim() === "") {
    Swal.fire({
      icon: 'error',
      title: 'Debe completar todos los campos'
    })
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

// Agrego los alumnos al select de Carga de Notas
function updateStudentDropdown() {
  // Vaciar el select
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }

  // Agregar una opción por defecto
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccionar";
  selectElement.appendChild(defaultOption);

  // Llenar el select con los alumnos actuales
  for (let i = 0; i < alumnos.length; i++) {
    const student = alumnos[i];
    const option = document.createElement("option");
    option.value = student.inputDNI;
    option.textContent = student.inputName;
    selectElement.appendChild(option);
  }
}


// Agrego el alumno al array de alumnos
function addNewStudent(dni, name, age){
  // Obtener el spriteUrl del Pokémon seleccionado
  // Aquí puedes colocar la lógica para obtener la URL del sprite
  // const spriteUrl = obtenerSpriteUrl(selectedIconId);  

  const existingStudent = alumnos.find(alumno => alumno.inputDNI === dni);
  
  if (existingStudent) {
    Swal.fire({
      icon: 'error',
      title: 'Este DNI ya ha sido registrado'
    });
    return; // Terminar la función si el DNI ya existe
  }

  const newStudent = new Alumno(dni, name, age);

  alumnos.push(newStudent);

  localStorage.setItem("alumnos", JSON.stringify(alumnos));
  console.log(alumnos);
  
  Swal.fire({
    icon: 'success',
    title: 'Alumno agregado'
  });

  inputDNI.value = ''
  inputName.value = ''
  inputAge.value = ''

  updateStudentDropdown();
}

//Evento que muestro el alumno con su tabla de materias
selectElement.addEventListener("change", e => {
  const selectedDNI = e.target.value; 
  if (selectedDNI === "Seleccionar") {
    return; 
  }

  // Buscar el alumno correspondiente en el array de alumnos
  const alumnoSeleccionado = alumnos.find((alumno) => alumno.inputDNI === selectedDNI);
  
  const selectedStudentDiv = document.querySelector('#selectedStudentDiv');
  const selectedStudent = document.querySelector('#selectedStudent');

  selectedStudent.innerHTML = `${alumnoSeleccionado.inputName}`;
  selectedStudentDiv.style.display = 'flex';
});


// Evento del submit
form.addEventListener("submit", e => {
  e.preventDefault();

  if (!verifyEmptyFields()) {
    return;
  }
  const dni = document.querySelector("#inputDNI").value;
  const name = capitalizeWords(document.querySelector("#inputName").value);
  const age = document.querySelector("#inputAge").value;
  // const selectedIconId = document.querySelector('input[name="pokemonIcon"]:checked').id;

  addNewStudent(dni, name, age);
  // localStorage.clear()
});



