let formularioBtn = document.getElementById("formulario");
let listadoBtn = document.getElementById("listado");
let estadisticasBtn = document.getElementById("estadisticas");

const goToFormulario = () => {
    location.href = "formulario.html";
}

const goToListado = () => {
    location.href = "listado.html";
}   

const goToEstadisticas = () => {
    location.href = "estadisticas.html";
}   

formularioBtn.addEventListener("click", goToFormulario);
listadoBtn.addEventListener("click", goToListado);
estadisticasBtn.addEventListener("click", goToEstadisticas);