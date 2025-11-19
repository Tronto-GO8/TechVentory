package com.techventory.backend.modelos;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "pedido_de_assistencia")
public class PedidoDeAssistencia {

    @Id
    @GeneratedValue
    @Column(name = "id_chamado")
    private UUID idChamado;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_item", nullable = true)
    private ItemPedido item; // opcional — caso esteja vinculado a um item comprado

    @Column(name = "data_abertura", nullable = false)
    private LocalDate dataAbertura = LocalDate.now(); // já define a data atual

    @Column(name = "data_fechamento")
    private LocalDate dataFechamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedidoDeAssistencia status = StatusPedidoDeAssistencia.NA_LOJA; // padrão

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "nome_item")
    private String nomeItem; // item textual, caso não venha de ItemPedido

    // Construtor padrão
    public PedidoDeAssistencia() {}

    // Getters e Setters
    public UUID getIdChamado() {
        return idChamado;
    }

    public void setIdChamado(UUID idChamado) {
        this.idChamado = idChamado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public ItemPedido getItem() {
        return item;
    }

    public void setItem(ItemPedido item) {
        this.item = item;
    }

    public LocalDate getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDate dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public LocalDate getDataFechamento() {
        return dataFechamento;
    }

    public void setDataFechamento(LocalDate dataFechamento) {
        this.dataFechamento = dataFechamento;
    }

    public StatusPedidoDeAssistencia getStatus() {
        return status;
    }

    public void setStatus(StatusPedidoDeAssistencia status) {
        this.status = status;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getNomeItem() {
        return nomeItem;
    }

    public void setNomeItem(String nomeItem) {
        this.nomeItem = nomeItem;
    }

    // Define automaticamente o status e a data de abertura ao salvar
    @PrePersist
    protected void onCreate() {
        if (dataAbertura == null) {
            dataAbertura = LocalDate.now();
        }
        if (status == null) {
            status = StatusPedidoDeAssistencia.NA_LOJA;
        }
    }
}
