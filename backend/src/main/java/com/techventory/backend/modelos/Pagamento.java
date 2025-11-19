package com.techventory.backend.modelos;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
public class Pagamento {

    @Id
    @GeneratedValue
    private UUID idPagamento;

    @OneToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    private String idTransacao;
    private String statusPagamento;
    private BigDecimal valorTotal;

    // Getters e Setters
    public UUID getIdPagamento() { return idPagamento; }
    public void setIdPagamento(UUID idPagamento) { this.idPagamento = idPagamento; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public String getIdTransacao() { return idTransacao; }
    public void setIdTransacao(String idTransacao) { this.idTransacao = idTransacao; }

    public String getStatusPagamento() { return statusPagamento; }
    public void setStatusPagamento(String statusPagamento) { this.statusPagamento = statusPagamento; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
}
