let formularioBtn = document.getElementById("formulario");
let listadoBtn = document.getElementById("listado");
let estadisticasBtn = document.getElementById("estadisticas");

const goToFormulario = () => {
    location.href = '/formulario';
}

const goToListado = () => {
    location.href = '/listado';
}

const goToEstadisticas = () => {
    location.href = '/estadisticas';
}

formularioBtn.addEventListener("click", goToFormulario);
listadoBtn.addEventListener("click", goToListado);
estadisticasBtn.addEventListener("click", goToEstadisticas);