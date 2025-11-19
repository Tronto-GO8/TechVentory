package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, UUID> {
    List<Produto> findByVendedor_IdUsuario(UUID idVendedor);
    List<Produto> findByCategorias_Nome(String nomeCategoria);
}
