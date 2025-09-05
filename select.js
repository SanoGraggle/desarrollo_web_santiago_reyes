import "region_comuna.js";

const data = region_comuna;

const poblarRegiones = () => {
  let regionSelect = document.getElementById("region");
  for (const region in data) {
      let option = document.createElement("option");
      option.value = region;
      option.text = region;
      regionSelect.appendChild(option);
  }
};

const updateComunas = () => {
  let regionSelect = document.getElementById("region");
  let comunaSelect = document.getElementById("comuna");
  let selectedRegion = regionSelect.value;
  
  comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
  
  if (data[selectedRegion]) {
      data[selectedRegion].forEach(comuna => {
          let option = document.createElement("option");
          option.value = comuna;
          option.text = comuna;
          comunaSelect.appendChild(option);
      });
  }
  changeArguments();
};

function changeArguments() {
  const comunaSelect = document.getElementById("comuna");
}

document.getElementById("region").addEventListener("change", updateComunas);
document.getElementById("comuna").addEventListener("change", changeArguments);

window.onload = () => {
  poblarRegiones();
  changeArguments();
};