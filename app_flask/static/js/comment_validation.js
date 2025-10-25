/* validation.js - validación de formulario de comentarios */

function validateComment(event) {
    event.preventDefault();
    
    var nombre = document.getElementById('nombre').value.trim();
    var texto = document.getElementById('texto').value.trim();
    var form = document.getElementById('comment-form');
    var errorDiv = document.getElementById('comment-error');
    
    // Limpiar error previo
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    
    // Validar nombre (3-80 caracteres)
    if (!nombre || nombre.length < 3 || nombre.length > 80) {
        errorDiv.textContent = 'El nombre debe tener entre 3 y 80 caracteres';
        errorDiv.style.display = 'block';
        return false;
    }
    
    // Validar texto (mínimo 5 caracteres)
    if (!texto || texto.length < 5) {
        errorDiv.textContent = 'El comentario debe tener al menos 5 caracteres';
        errorDiv.style.display = 'block';
        return false;
    }
    
    // Si pasa validaciones, enviar formulario
    form.submit();
    return true;
}

// Agregar listener cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('comment-form');
    if (form) {
        form.addEventListener('submit', validateComment);
    }
});