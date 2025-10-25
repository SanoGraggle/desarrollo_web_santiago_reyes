
function validateComment(event) {
    event.preventDefault();
    
    var nombre = document.getElementById('nombre').value.trim();
    var texto = document.getElementById('texto').value.trim();
    var form = document.getElementById('comment-form');
    var errorDiv = document.getElementById('comment-error');
    
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    
    if (!nombre || nombre.length < 3 || nombre.length > 80) {
        errorDiv.textContent = 'El nombre debe tener entre 3 y 80 caracteres';
        errorDiv.style.display = 'block';
        return false;
    }
    
    if (!texto || texto.length < 5) {
        errorDiv.textContent = 'El comentario debe tener al menos 5 caracteres';
        errorDiv.style.display = 'block';
        return false;
    }
    
    form.submit();
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('comment-form');
    if (form) {
        form.addEventListener('submit', validateComment);
    }
});