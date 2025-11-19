package com.techventory.backend.controller;

import com.techventory.backend.modelos.*;
import com.techventory.backend.servicos.PedidoService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // 🆕 Criar novo pedido
    @PostMapping("/novo")
    public Map<String, Object> criarPedido(@RequestBody Map<String, Object> body) {
        UUID idCliente = UUID.fromString(body.get("idCliente").toString());
        String metodoPagamento = body.get("metodoPagamento").toString();

        List<Map<String, Object>> itensJson = (List<Map<String, Object>>) body.get("itens");
        List<ItemPedido> itens = new ArrayList<>();

        for (Map<String, Object> itemJson : itensJson) {
            ItemPedido item = new ItemPedido();
            Produto produto = new Produto();
            produto.setIdProduto(UUID.fromString(itemJson.get("idProduto").toString()));

            item.setProduto(produto);
            item.setQuantidade((int) itemJson.get("quantidade"));
            itens.add(item);
        }

        Pedido novoPedido = pedidoService.criarPedido(idCliente, itens, metodoPagamento);

        return Map.of(
                "message", "Pedido criado com sucesso!",
                "pedido", novoPedido
        );
    }

    // 📜 Listar pedidos de um cliente
    @GetMapping("/cliente/{idCliente}")
    public List<Pedido> listarPedidosDoCliente(@PathVariable UUID idCliente) {
        return pedidoService.listarPedidosDoCliente(idCliente);
    }

    // 🔎 Buscar pedido por ID
    @GetMapping("/{idPedido}")
    public Optional<Pedido> buscarPedidoPorId(@PathVariable UUID idPedido) {
        return pedidoService.buscarPorId(idPedido);
    }

    // 🔄 Atualizar status do pedido
    @PutMapping("/{idPedido}/status")
    public Map<String, String> atualizarStatus(@PathVariable UUID idPedido, @RequestBody Map<String, String> body) {
        String novoStatus = body.get("status");
        pedidoService.atualizarStatus(idPedido, novoStatus);
        return Map.of("message", "Status atualizado para " + novoStatus);
    }
}
