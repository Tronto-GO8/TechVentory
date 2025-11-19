package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<Usuario, Long > {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Usuario> buscarPorNome(@Param("nome") String nome);

    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    List<Usuario> buscarPorEmail(@Param("email") String email);

    @Query("SELECT u FROM Usuario u WHERE REPLACE(u.telefone, ' ', '') = REPLACE(:telefone, ' ', '')")
    List<Usuario> buscarPorTelefone(@Param("telefone") String telefone);

    @Query("SELECT u FROM Usuario u")
    List<Usuario> buscarTodosClientes();

    // tabela usuarios

    @Query("""
    SELECT DISTINCT p.pedido.usuario
    FROM ItemPedido p
    WHERE p.produto.vendedor.id = :vendedorId
""")
    List<Usuario> findClientesByVendedor(@Param("vendedorId") Long vendedorId);

    @Query("""
    SELECT DISTINCT p.pedido.usuario
    FROM ItemPedido p
    WHERE p.produto.vendedor.id = :vendedorId
      AND p.pedido.usuario.email ILIKE CONCAT('%', :email, '%')
""")
    List<Usuario> findClientesByVendedorAndEmail(
            @Param("vendedorId") Long vendedorId,
            @Param("email") String email
    );

    @Query("""
    SELECT DISTINCT p.pedido.usuario
    FROM ItemPedido p
    WHERE p.produto.vendedor.id = :vendedorId
      AND p.pedido.usuario.idUsuario = :idCliente
""")
    List<Usuario> findClientesByVendedorAndClienteId(
            @Param("vendedorId") Long vendedorId,
            @Param("idCliente") Long idCliente
    );


    // pagar dados e endereço do usuaário
    @Query(value = """
    SELECT 
        u.nome,
        u.email,
        u.cpf,

        e.cep,
        e.rua,
        e.numero,
        e.complemento,
        e.bairro,
        e.cidade,
        e.estado

    FROM usuarios u
    LEFT JOIN enderecos e 
           ON e.id_endereco = u.id_endereco

    WHERE u.id_usuario = :idUsuario
    """,
            nativeQuery = true)
    Map<String, Object> buscarUsuarioCompleto(@Param("idUsuario") Long idUsuario);


}