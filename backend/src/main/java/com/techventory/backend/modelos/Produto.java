package com.techventory.backend.modelos;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
public class Produto {

    @Id
    @GeneratedValue
    private UUID idProduto;

    @ManyToOne
    @JoinColumn(name = "id_vendedor")
    private Usuario vendedor;

    private String nome;
    private String descricao;
    private int quantidade;
    private BigDecimal precoUnitario;

    // 📦 Relação com Categoria (N:N)
    @ManyToMany
    @JoinTable(
            name = "produto_categoria",
            joinColumns = @JoinColumn(name = "id_produto"),
            inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    @JsonManagedReference // 👈 evita loop ao serializar
    private Set<Categoria> categorias = new HashSet<>();

    private String imagemProduto;

    // Getters e Setters
    public UUID getIdProduto() { return idProduto; }
    public void setIdProduto(UUID idProduto) { this.idProduto = idProduto; }

    public Usuario getVendedor() { return vendedor; }
    public void setVendedor(Usuario vendedor) { this.vendedor = vendedor; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }

    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }

    public Set<Categoria> getCategorias() { return categorias; }
    public void setCategorias(Set<Categoria> categorias) { this.categorias = categorias; }

    public String getImagemProduto() { return imagemProduto; }
    public void setImagemProduto(String imagemProduto) { this.imagemProduto = imagemProduto; }
}
