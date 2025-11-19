package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VendedorRepository extends JpaRepository<Vendedor, Long> {

    @Query("""
         SELECT COUNT(p)
         FROM Produto p
         WHERE p.vendedor.idUsuario = :id
    """)
    int totalProdutos(@Param("id") Long id);


    @Query("""
    SELECT COUNT(DISTINCT p.usuario.idUsuario)
    FROM Pedido p
    JOIN p.itens i
    JOIN i.produto prod
    WHERE prod.vendedor.idUsuario = :idVendedor
""")
    int totalClientes(Long idVendedor);

/*
    @Query("""
        SELECT COUNT(c)
        FROM Chamado c
        WHERE c.vendedor.idUsuario = :id AND c.status = 'PENDENTE'
    """)
    int chamadosPendentes(@Param("id") Long id);

    @Query("""
        SELECT COUNT(f)
        FROM Funcionario f
        WHERE f.vendedor.idUsuario = :id
    """)
    int totalFuncionarios(@Param("id") Long id);

    @Query("""
        SELECT COALESCE(SUM(ped.valorTotal), 0)
        FROM Pedido ped
        WHERE ped.vendedor.idUsuario = :id
          AND ped.dataPedido >= CURRENT_DATE - 30
    """)
    double receitaMensal(@Param("id") Long id);


    @Query("""
        SELECT COUNT(ped)
        FROM Pedido ped
        WHERE ped.vendedor.idUsuario = :id
    """)
    int pedidos(@Param("id") Long id);

     */
}
