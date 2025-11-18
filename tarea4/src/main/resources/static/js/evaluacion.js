document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal-evaluar');
    const inputNota = document.getElementById('input-nota');
    const errorNota = document.getElementById('error-nota');
    const modalAvisoId = document.getElementById('modal-aviso-id');
    const btnSubmit = document.getElementById('btn-submit-eval');
    const closeButtons = document.querySelectorAll('.js-modal-close');

    function openModal(avisoId) {
        modal.classList.add('is-active');
        modalAvisoId.value = avisoId;
        inputNota.value = '';
        errorNota.style.display = 'none';
    }

    function closeModal() {
        modal.classList.remove('is-active');
    }

    document.querySelectorAll('.js-evaluar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const avisoId = e.currentTarget.getAttribute('data-aviso-id');
            openModal(avisoId);
        });
    });

    closeButtons.forEach(b => b.addEventListener('click', closeModal));

    btnSubmit.addEventListener('click', async () => {
        const avisoId = modalAvisoId.value;
        const raw = inputNota.value;
        const nota = Number(raw);
        if (!Number.isInteger(nota) || nota < 1 || nota > 7) {
            errorNota.textContent = 'La nota debe ser un número entero entre 1 y 7';
            errorNota.style.display = 'block';
            return;
        }

        try {
            const res = await fetch('/api/evaluaciones', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({avisoId: avisoId, nota: nota})
            });
            if (!res.ok) {
                const err = await res.json();
                errorNota.textContent = err.error || 'Error al enviar';
                errorNota.style.display = 'block';
                return;
            }

            // actualizar promedio
            await updatePromedio(avisoId);
            closeModal();
        } catch (e) {
            errorNota.textContent = 'Error de conexión';
            errorNota.style.display = 'block';
        }
    });

    async function updatePromedio(avisoId) {
        try {
            const r = await fetch(`/api/avisos/${avisoId}/nota`);
            if (!r.ok) return;
            const j = await r.json();
            const avg = j.average;
            const cell = document.querySelector(`.nota-cell[data-aviso-id='${avisoId}']`);
            if (cell) {
                cell.textContent = avg === null ? '-' : Math.round((avg + Number.EPSILON) * 10) / 10;
            }
        } catch (e) {
            console.error('Error actualizando promedio', e);
        }
    }
});
