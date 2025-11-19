package com.techventory.backend.servicos;

import com.techventory.backend.modelos.*;
import com.techventory.backend.repositorio.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
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
    public Pedido criarPedido(Long idUsuario, List<ItemPedido> itens, String metodoPagamento) {

        // agora buscamos "usuario", não mais "cliente"
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario); // antes: setCliente()
        pedido.setStatus("PENDENTE");
        pedido.setMetodoPagamento(metodoPagamento);
        pedido.setDataPedido(new Date());

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedido item : itens) {
            Produto produto = produtoRepository.findById(item.getProduto().getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

            item.setProduto(produto);
            item.setPrecoUnitario(produto.getPreco());
            item.setPedido(pedido);

            total = total.add(item.getSubtotal());
        }

        pedido.setValorTotal(total);
        pedido.getItens().addAll(itens);

        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPedidosDoUsuario(Long idUsuario) {
        // antes: findByCliente_IdUsuario
        return pedidoRepository.findByUsuario_IdUsuario(idUsuario);
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
