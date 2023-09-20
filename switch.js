/* js para el switch */
const themeSwitch = document.getElementById("themeSwitch");
const themeChangeElements = document.querySelectorAll(".theme-change");
const inputElements = document.querySelectorAll("input[type=text], input[type=number], select");
const buttonElement = document.querySelector('#addButton');
const originalInputStyles = [];

for (const input of inputElements) {
  originalInputStyles.push({
    background: input.style.backgroundColor,
    color: input.style.color
  });
}

themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    buttonElement.classList.add("theme-dark");
    themeChangeElements.forEach(element => {
      element.style.backgroundColor = "#333";
    });
    inputElements.forEach((input) => {
      input.style.backgroundColor = "#333";
      input.style.color = "white";
    });
  } else {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    buttonElement.classList.remove("theme-dark");
    themeChangeElements.forEach(element => {
      element.style.backgroundColor = "white"; 
    });
    inputElements.forEach((input, index) => {
      input.style.backgroundColor = originalInputStyles[index].background;
      input.style.color = originalInputStyles[index].color; 
    });
  }
});