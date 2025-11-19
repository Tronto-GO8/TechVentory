package com.techventory.backend.servicos;

import com.techventory.backend.modelos.*;
import com.techventory.backend.repositorio.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ImagemProdutoRepository imagemProdutoRepository;
    private final ImagemService imagemService;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            CategoriaRepository categoriaRepository,
            ImagemProdutoRepository imagemProdutoRepository,
            ImagemService imagemService
    ) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
        this.imagemProdutoRepository = imagemProdutoRepository;
        this.imagemService = imagemService;
    }

    @Transactional
    public Produto criarProduto(Produto produto) {

        if (produto.getImagemProduto() != null && produto.getImagemProduto().size() > 6) {
            throw new IllegalArgumentException("Um produto pode ter no máximo 6 imagens.");
        }

        if (produto.getCategorias() != null && !produto.getCategorias().isEmpty()) {
            Set<Categoria> categoriasPersistidas = produto.getCategorias().stream()
                    .map(cat -> categoriaRepository.findByNome(cat.getNome())
                            .orElseGet(() -> categoriaRepository.save(new Categoria(cat.getNome()))))
                    .collect(Collectors.toSet());

            produto.setCategorias(categoriasPersistidas);
        }

        if (produto.getImagemProduto() != null) {
            produto.getImagemProduto().forEach(img -> img.setProduto(produto));
        }

        return produtoRepository.save(produto);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public List<Produto> listarPorVendedor(Long idVendedor) {
        return produtoRepository.findByVendedor_IdUsuario(idVendedor);
    }

    public List<Produto> listarPorCategoria(String nomeCategoria) {
        return produtoRepository.findByCategorias_Nome(nomeCategoria);
    }

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    // Método correto para salvar imagem
    public void salvarImagem(Produto produto, MultipartFile file) {
        String url = imagemService.salvarImagem(file);

        ImagemProduto img = new ImagemProduto();
        img.setUrl(url);
        img.setProduto(produto);

        produto.getImagemProduto().add(img);
        produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, String nome, Integer qtd, Integer qtdMin, BigDecimal preco,
                             String desc, List<String> categorias, List<MultipartFile> novasImagens) {

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produto.setNome(nome);
        produto.setQuantidade(qtd);
        produto.setQuantidadeMinima(qtdMin);
        produto.setPreco(preco);
        produto.setDescricao(desc);

        // Atualizar categorias a partir dos nomes
        if (categorias != null) {
            Set<Categoria> novasCats = categorias.stream()
                    .map(nomeCat -> categoriaRepository.findByNome(nomeCat)
                            .orElseGet(() -> categoriaRepository.save(new Categoria(nomeCat))))
                    .collect(Collectors.toSet());

            produto.setCategorias(novasCats);
        }

        Produto salvo = produtoRepository.save(produto);

        if (novasImagens != null) {
            novasImagens.forEach(img -> salvarImagem(salvo, img));
        }

        return salvo;
    }
}
