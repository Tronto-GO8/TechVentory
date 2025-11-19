package com.techventory.backend.controller;

import com.techventory.backend.modelos.Categoria;
import com.techventory.backend.modelos.Produto;
import com.techventory.backend.modelos.Vendedor;
import com.techventory.backend.repositorio.VendedorRepository;
import com.techventory.backend.servicos.ProdutoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    private final VendedorRepository vendedorRepository;

    public ProdutoController(ProdutoService produtoService, VendedorRepository vendedorRepository) {
        this.produtoService = produtoService;
        this.vendedorRepository = vendedorRepository;
    }

    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    @GetMapping("/vendedor/{idVendedor}")
    public List<Produto> listarPorVendedor(@PathVariable Long idVendedor) {
        return produtoService.listarPorVendedor(idVendedor);
    }

    @GetMapping("/categoria/{nome}")
    public List<Produto> listarPorCategoria(@PathVariable String nome) {
        return produtoService.listarPorCategoria(nome);
    }

    // Criar produto com imagens
    @PostMapping(value = "/adicionar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> criarProduto(
            @RequestPart("idVendedor") Long idVendedor,
            @RequestPart("nome") String nome,
            @RequestPart("quantidade") Integer quantidade,
            @RequestPart("quantidadeMinima") Integer quantidadeMinima,
            @RequestPart("preco") BigDecimal preco,
            @RequestPart("descricao") String descricao
    ) {
        // Só para testar:
        System.out.println("idVendedor = " + idVendedor);
        System.out.println("nome = " + nome);
        System.out.println("quantidade = " + quantidade);

        return ResponseEntity.ok("ok");


        /*

        Vendedor vendedor = vendedorRepository.findById(idVendedor)
                .orElseThrow(() -> new RuntimeException("Vendedor não encontrado"));

        Produto produto = new Produto();
        produto.setVendedor(vendedor);
        produto.setNome(nome);
        produto.setQuantidade(quantidade);
        produto.setQuantidadeMinima(quantidadeMinima);
        produto.setPreco(preco);
        produto.setDescricao(descricao);

        if (categorias != null) {
            produto.setCategorias(
                    categorias.stream().map(Categoria::new).collect(Collectors.toSet())
            );
        }

        Produto salvo = produtoService.salvar(produto);

        if (imagens != null) {
            imagens.forEach(img -> produtoService.salvarImagem(salvo, img));
        }

        return ResponseEntity.ok(salvo);
    }



    // Atualizar produto
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> atualizarProduto(
            @PathVariable Long id,
            @RequestPart("nome") String nome,
            @RequestPart("quantidade") Integer quantidade,
            @RequestPart("quantidadeMinima") Integer quantidadeMinima,
            @RequestPart("preco") BigDecimal preco,
            @RequestPart("descricao") String descricao,
            @RequestPart(value = "categorias", required = false) List<String> categorias,
            @RequestPart(value = "imagens", required = false) List<MultipartFile> novasImagens
    ) {

        Produto atualizado = produtoService.atualizar(
                id, nome, quantidade, quantidadeMinima, preco,
                descricao, categorias, novasImagens
        );

        return ResponseEntity.ok(atualizado);
        */
    }


}
