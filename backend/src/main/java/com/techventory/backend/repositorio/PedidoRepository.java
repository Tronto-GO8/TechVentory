package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {
    List<Pedido> findByUsuario_IdUsuario(Long idUsuario);
}
