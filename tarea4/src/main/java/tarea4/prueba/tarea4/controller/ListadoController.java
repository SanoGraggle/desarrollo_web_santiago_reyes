package tarea4.prueba.tarea4.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import tarea4.prueba.tarea4.service.AvisoService;

@Controller
public class ListadoController {

    private final AvisoService avisoService;

    public ListadoController(AvisoService avisoService) {
        this.avisoService = avisoService;
    }

    @GetMapping({"/", "/listado"})
    public String listado(Model model) {
        model.addAttribute("avisos", avisoService.listarParaListado());
        return "listado";
    }
}
