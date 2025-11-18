package tarea4.prueba.tarea4.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aviso_id", nullable = false)
    private Long avisoId;

    @Column(name = "nota", nullable = false)
    private Integer nota;

    public Nota() {
    }

    public Nota(Long avisoId, Integer nota) {
        this.avisoId = avisoId;
        this.nota = nota;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAvisoId() {
        return avisoId;
    }

    public void setAvisoId(Long avisoId) {
        this.avisoId = avisoId;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }
}
