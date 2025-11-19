package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.PedidoDeAssistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PedidoDeAssistenciaRepository extends JpaRepository<PedidoDeAssistencia, UUID> {
}
