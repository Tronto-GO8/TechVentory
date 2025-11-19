package com.techventory.backend.controller;

import com.techventory.backend.modelos.Produto;
import com.techventory.backend.servicos.ProdutoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @PostMapping
    public Produto criarProduto(@RequestBody Produto produto) {
        return produtoService.criarProduto(produto);
    }

    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    @GetMapping("/vendedor/{idVendedor}")
    public List<Produto> listarPorVendedor(@PathVariable UUID idVendedor) {
        return produtoService.listarPorVendedor(idVendedor);
    }

    @GetMapping("/categoria/{nome}")
    public List<Produto> listarPorCategoria(@PathVariable String nome) {
        return produtoService.listarPorCategoria(nome);
    }
}
