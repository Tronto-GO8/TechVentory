package com.techventory.backend.servicos;

import com.techventory.backend.modelos.*;
import com.techventory.backend.repositorio.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         ProdutoRepository produtoRepository,
                         ItemPedidoRepository itemPedidoRepository,
                         UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Pedido criarPedido(UUID idCliente, List<ItemPedido> itens, String metodoPagamento) {
        Usuario cliente = usuarioRepository.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setStatus("PENDENTE");
        pedido.setMetodoPagamento(metodoPagamento);
        pedido.setDataPedido(new Date());

        double total = 0.0;

        for (ItemPedido item : itens) {
            Produto produto = produtoRepository.findById(item.getProduto().getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

            item.setProduto(produto);
            item.setPrecoUnitario(produto.getPrecoUnitario());
            item.setPedido(pedido);
            total += item.getSubtotal();
        }

        pedido.setValorTotal(total);
        pedido.getItens().addAll(itens);

        // Salva tudo em cascata
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPedidosDoCliente(UUID idCliente) {
        return pedidoRepository.findByCliente_IdUsuario(idCliente);
    }

    public Optional<Pedido> buscarPorId(UUID idPedido) {
        return pedidoRepository.findById(idPedido);
    }

    public void atualizarStatus(UUID idPedido, String novoStatus) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado!"));
        pedido.setStatus(novoStatus);
        pedidoRepository.save(pedido);
    }
}
