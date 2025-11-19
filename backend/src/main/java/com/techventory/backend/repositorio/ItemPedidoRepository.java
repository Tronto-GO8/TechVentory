package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, UUID> {
    List<ItemPedido> findByPedido_IdPedido(UUID idPedido);
}
