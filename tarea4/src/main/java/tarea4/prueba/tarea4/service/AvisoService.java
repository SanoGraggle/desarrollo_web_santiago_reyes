package tarea4.prueba.tarea4.service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tarea4.prueba.tarea4.dto.AvisoListItem;
import tarea4.prueba.tarea4.model.Aviso;
import tarea4.prueba.tarea4.model.Comuna;
import tarea4.prueba.tarea4.repository.AvisoRepository;
import tarea4.prueba.tarea4.repository.ComunaRepository;

@Service
public class AvisoService {

    private final AvisoRepository avisoRepository;
    private final ComunaRepository comunaRepository;
    private final NotaService notaService;

    private final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public AvisoService(AvisoRepository avisoRepository, ComunaRepository comunaRepository, NotaService notaService) {
        this.avisoRepository = avisoRepository;
        this.comunaRepository = comunaRepository;
        this.notaService = notaService;
    }

    @Transactional(readOnly = true)
    public List<AvisoListItem> listarParaListado() {
        List<Aviso> avisos = avisoRepository.findAllByOrderByFechaIngresoDesc();
        List<AvisoListItem> out = new ArrayList<>();
        for (Aviso a : avisos) {
            String fecha = a.getFechaIngreso() == null ? "" : a.getFechaIngreso().format(fmt);
            String cantidadTipoEdad = String.format("%d %s %d %s", a.getCantidad(), a.getTipo(), a.getEdad(), ("m".equals(a.getUnidadMedida())?"meses":"años"));
            Optional<Comuna> c = comunaRepository.findById(a.getComunaId());
            String nombreComuna = c.map(Comuna::getNombre).orElse("");
            Double avg = notaService.promedioPorAviso(a.getId());
            out.add(new AvisoListItem(a.getId(), fecha, a.getSector(), cantidadTipoEdad, nombreComuna, avg));
        }
        return out;
    }
}
