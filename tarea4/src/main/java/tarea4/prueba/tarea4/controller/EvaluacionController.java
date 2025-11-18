package tarea4.prueba.tarea4.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tarea4.prueba.tarea4.service.NotaService;
import tarea4.prueba.tarea4.model.Nota;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EvaluacionController {

    private final NotaService notaService;

    public EvaluacionController(NotaService notaService) {
        this.notaService = notaService;
    }

    @PostMapping("/evaluaciones")
    public ResponseEntity<?> crearEvaluacion(@RequestBody Map<String, Object> payload) {
        try {
            Object avisoObj = payload.get("avisoId");
            if (avisoObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "avisoId es requerido"));
            }
            Long avisoId;
            try {
                avisoId = Long.valueOf(String.valueOf(avisoObj));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("error", "avisoId inválido"));
            }

            Object notaObj = payload.get("nota");
            if (notaObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "nota es requerida"));
            }

            Integer nota;
            if (notaObj instanceof Number) {
                double d = ((Number) notaObj).doubleValue();
                int i = ((Number) notaObj).intValue();
                if (Double.compare(d, i) != 0) {
                    return ResponseEntity.badRequest().body(Map.of("error", "La nota debe ser un número entero"));
                }
                nota = i;
            } else {
                try {
                    nota = Integer.valueOf(String.valueOf(notaObj));
                } catch (Exception ex) {
                    return ResponseEntity.badRequest().body(Map.of("error", "La nota debe ser un número entero"));
                }
            }

            Nota saved = notaService.crearNota(avisoId, nota);
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", saved.getId());
            resp.put("avisoId", saved.getAvisoId());
            resp.put("nota", saved.getNota());
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Error interno"));
        }
    }

    @GetMapping("/avisos/{id}/nota")
    public ResponseEntity<?> promedioNota(@PathVariable("id") Long avisoId) {
        Double avg = notaService.promedioPorAviso(avisoId);
        if (avg == null) {
            return ResponseEntity.ok(Map.of("average", null));
        }
        return ResponseEntity.ok(Map.of("average", avg));
    }
}
