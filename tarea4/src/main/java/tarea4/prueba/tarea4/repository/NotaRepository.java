package tarea4.prueba.tarea4.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tarea4.prueba.tarea4.model.Nota;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.avisoId = :avisoId")
    Double findAverageByAvisoId(@Param("avisoId") Long avisoId);

    List<Nota> findByAvisoId(Long avisoId);
}
