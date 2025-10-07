const validateName = (name) => {
  if (!name) return false;
  let lengthValid = name.trim().length >= 3 && name.trim().length <= 200;

  return lengthValid;
}

const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.length <= 100;

  // validamos el formato
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  // validación de longitud
  let lengthValid = phoneNumber.length >= 8;

  // validación de formato
  let re = /^[0-9]+$/;
  let formatValid = re.test(phoneNumber);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validateFiles = (fileInputs) => {
  if (!fileInputs) return false;
  let totalFiles = 0;
  let typeValid = true;

  for (const input of fileInputs) {
    const files = input.files;
    totalFiles += files.length;
    for (const file of files) {
      let fileFamily = file.type.split("/")[0];
      typeValid &&= fileFamily == "image" || file.type == "application/pdf";
    }
  }

  let lengthValid = totalFiles >= 1 && totalFiles <= 5;
  return lengthValid && typeValid;
};

const validateSelect = (select) => {
  if (!select) return false;
  return true
}

const validateSector = (sector) => {
  if (!sector) return false;
  let lengthValid = sector.trim().length <= 100;
  return lengthValid;
}

const validateType = (type) => {
  if (!type) return false;
  return type === "Perro" || type === "Gato";
}

const validateAgeType = (type) => {
  if (!type) return false;
  return type === "Meses" || type === "Años";
}

const validateNum = (num) => {
  if (!num) return false;
  // debe ser un número entre 1 y 25
  let number = parseInt(num);
  return Number.isInteger(number) && number >= 1;
}

const validateDate = (date) => {
  if (!date) return false;
  let selectedDate = new Date(date);
  let now = new Date();
  // la fecha debe ser hoy o en el futuro
  return selectedDate >= now;
}

const validateForm = () => {
  // obtener elementos del DOM usando el nombre del formulario.
  let myForm = document.forms["myForm"];
  let region = myForm["region"].value;
  let comuna = myForm["comuna"].value;
  let sector = myForm["sector"].value;
  let name = myForm["name"].value;
  let email = myForm["email"].value;
  let phoneNumber = myForm["phone"].value;
  let type = myForm["type"].value;
  let quantity = myForm["quantity"].value;
  let age = myForm["age"].value;
  let ageType = myForm["age-type"].value;
  let adoptDate = myForm["adopt_date"].value;
  let fileInputs = document.querySelectorAll('input[name="files"]');

  // variables auxiliares de validación y función.
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // lógica de validación
  if (!validateSelect(region)) {
    setInvalidInput("Región");
  }

  if (!validateSelect(comuna)) {
    setInvalidInput("Comuna");
  }

  if (!validateSector(sector)) {
    setInvalidInput("Sector");
  }
  if (!validateName(name)) {
    setInvalidInput("Nombre");
  }
  if (!validateEmail(email)) {
    setInvalidInput("Email");
  }
  if (!validatePhoneNumber(phoneNumber)) {
    setInvalidInput("Número");
  }
  if (!validateType(type)) {
    setInvalidInput("Tipo de mascota");
  }
  if (!validateNum(quantity)) {
    setInvalidInput("Cantidad");
  }
  if (!validateNum(age)) {
    setInvalidInput("Edad");
  }
  if (!validateAgeType(ageType)) {
    setInvalidInput("Tipo de edad");
  }
  if (!validateDate(adoptDate)) {
    setInvalidInput("Fecha de adopción");
  }
  if (!validateFiles(fileInputs)) {
    setInvalidInput("Fotos");
  }

  // finalmente mostrar la validación
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");
  let formContainer = document.querySelector(".main-container");

  if (!isValid) {
    validationListElem.textContent = "";
    // agregar elementos inválidos al elemento val-list.
    for (input of invalidInputs) {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    }
    // establecer val-msg
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    // aplicar estilos de error
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  } else {
    // Ocultar el formulario
    myForm.style.display = "none";

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¿Está seguro que desea agregar este aviso de adopción?";
    validationListElem.textContent = "";

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
    let submitButton = document.createElement("button");
    submitButton.innerText = "Sí, estoy seguro";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {
      // myForm.submit();
      window.location.href = "index.html";
      // no tenemos un backend al cual enviarle los datos
    });

    let backButton = document.createElement("button");
    backButton.innerText = "“No, no estoy seguro, quiero volver al formulario";
    backButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
};


let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);
