package tarea4.prueba.tarea4.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tarea4.prueba.tarea4.model.Nota;
import tarea4.prueba.tarea4.repository.NotaRepository;

@Service
public class NotaService {

    private final NotaRepository notaRepository;

    public NotaService(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

    @Transactional
    public Nota crearNota(Long avisoId, Integer nota) {
        if (nota == null || nota < 1 || nota > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7");
        }
        Nota n = new Nota(avisoId, nota);
        return notaRepository.save(n);
    }

    @Transactional(readOnly = true)
    public Double promedioPorAviso(Long avisoId) {
        Double avg = notaRepository.findAverageByAvisoId(avisoId);
        return avg;
    }
}
