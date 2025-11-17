package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {
    List<Pedido> findByCliente_IdUsuario(Long idUsuario);

    //TOTAL DE PRODUTOS
    @Query("""
    SELECT COUNT(p)
    FROM Produto p
    WHERE p.vendedor.idUsuario = :idUsuario
""")
    Integer countProdutos(@Param("idUsuario") Long idUsuario);

    //TOTAL DE CLIENTES
    @Query("""
    SELECT COUNT(c)
    FROM Cliente c
    WHERE c.vendedor.idUsuario = :idUsuario
""")
    Integer countClientes(@Param("idUsuario") Long idUsuario);

    // TOTAL DE CHAMADOS COM O STATUS ABERTO

    @Query("""
    SELECT COUNT(a)
    FROM PedidoDeAssistencia a
    WHERE a.vendedor.idUsuario = :idUsuario
      AND a.status = 'PENDENTE'
""")
    Integer countChamadosPendentes(@Param("idUsuario") Long idUsuario);


    //TOTAL DE FUNCIONARIOS

    @Query("""
    SELECT COUNT(f)
    FROM Funcionario f
    WHERE f.vendedor.idUsuario = :idUsuario
""")
    Integer countFuncionarios(@Param("idUsuario") Long idUsuario);


    // Soma o valor total dos pedidos nos últimos 30 dias
    @Query("""
        SELECT COALESCE(SUM(p.valorTotal), 0)
        FROM Pedido p
        WHERE p.vendedor.idUsuario = :idUsuario
          AND p.dataCriacao >= :dataMinima
    """)
    Double getReceitaUltimos30Dias(
            @Param("idUsuario") Long idUsuario,
            @Param("dataMinima") LocalDateTime dataMinima
    );

    @Query("""
    SELECT COUNT(p)
    FROM Pedido p
    WHERE p.vendedor.idUsuario = :idUsuario
      AND DATE(p.dataCriacao) = CURRENT_DATE
""")
    Integer countPedidosDia(@Param("idUsuario") Long idUsuario);

}
