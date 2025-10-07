

const data = region_comuna.regiones;

const animalTypes = ["Perro", "Gato"];

const ageTypes = ["Meses", "Años"];

const contactTypes = ["Whatsapp", "Telegram", "X", "Instagram", "TikTok", "Otro"];

const dateUpdate = () => {
  let adoptDateInput = document.getElementById("adopt_date");
  const now = new Date();
  now.setHours(now.getHours() + 3);
  const pad = n => n.toString().padStart(2, '0');
  const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  adoptDateInput.value = formatted;
}

const maxPhotos = 5;
const photosContainer = document.getElementById("photos-container");
const addPhotoBtn = document.getElementById("add-photo-btn");

const updateAddPhotoBtnVisibility= () => {
  while (photosContainer.children.length < maxPhotos) {
  addPhotoBtn.hidden = false;
  return;
  }
  addPhotoBtn.hidden = true;
}

const addPhotoInput = () => {
  if (photosContainer.children.length >= maxPhotos) return;
  let newInput = document.createElement("input");
  newInput.type = "file";
  newInput.name = "files";
  newInput.className = "photo-input";
  newInput.accept = "image/*";
  newInput.required = true;
  photosContainer.appendChild(newInput);
  updateAddPhotoBtnVisibility();
}

const poblarContactos = () => {
  let contactSelect = document.getElementById("contact");
  contactTypes.forEach(type => {
    let option = document.createElement("option");
    option.value = type;
    option.text = type;
    contactSelect.appendChild(option);
  });
};

const usernameUpdate = () => {
  const usernameField = document.getElementById("username-field");
  usernameField.hidden = false;
}
const poblarTipos = () => {
  let typeSelect = document.getElementById("type");
  animalTypes.forEach(type => {
    let option = document.createElement("option");
    option.value = type;
    option.text = type;
    typeSelect.appendChild(option);
  });
};

const poblarEdades = () => {
  let ageSelect = document.getElementById("age-type");
  ageTypes.forEach(type => {
    let option = document.createElement("option");
    option.value = type;
    option.text = type;
    ageSelect.appendChild(option);
  });
};

const poblarRegiones = () => {
  let regionSelect = document.getElementById("region");
  data.forEach(regionObj => {
    let option = document.createElement("option");
    option.value = regionObj.nombre;
    option.text = regionObj.nombre;
    regionSelect.appendChild(option);
  });
};


const updateComunas = () => {
  let regionSelect = document.getElementById("region");
  let comunaSelect = document.getElementById("comuna");
  let selectedRegion = regionSelect.value;
  comunaSelect.innerHTML = "";
  // Busca la región seleccionada
  const regionObj = data.find(r => r.nombre === selectedRegion);
  if (regionObj && regionObj.comunas) {
    regionObj.comunas.forEach(comuna => {
      let option = document.createElement("option");
      option.value = comuna.nombre;
      option.text = comuna.nombre;
      comunaSelect.appendChild(option);
    });
  }
  changeArguments();
};


function changeArguments() {
  const comunaSelect = document.getElementById("comuna");
}

document.getElementById("region").addEventListener("change", updateComunas);
document.getElementById("contact").addEventListener("change", usernameUpdate);
document.getElementById("photos-container").addEventListener("click", updateAddPhotoBtnVisibility);
document.getElementById("add-photo-btn").addEventListener("click", addPhotoInput);

window.onload = () => {
  poblarContactos();
  dateUpdate();
  poblarEdades();
  poblarTipos();
  poblarRegiones();
  changeArguments();
};