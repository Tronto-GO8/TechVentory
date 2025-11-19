package com.techventory.backend.modelos;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "imagem_produto")
public class ImagemProduto {

    @Id
    @GeneratedValue
    @Column(name = "id_imagem", columnDefinition = "UUID")
    private UUID idImagem;

    @ManyToOne
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private String url; // link da imagem (pode ser um caminho local ou em cloud)

    // Getters e Setters
    public UUID getIdImagem() {
        return idImagem;
    }

    public void setIdImagem(UUID idImagem) {
        this.idImagem = idImagem;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
