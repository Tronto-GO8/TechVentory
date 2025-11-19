package com.techventory.backend.servicos;

import com.techventory.backend.modelos.*;
import com.techventory.backend.repositorio.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public Produto criarProduto(Produto produto) {

        // Valida limite de imagens
        if (produto.getImagens() != null && produto.getImagens().size() > 6) {
            throw new IllegalArgumentException("Um produto pode ter no máximo 6 imagens.");
        }

        // Vincula categorias existentes ou cria novas
        if (produto.getCategorias() != null && !produto.getCategorias().isEmpty()) {
            Set<Categoria> categoriasPersistidas = produto.getCategorias().stream()
                    .map(c -> categoriaRepository.findByNome(c.getNome())
                            .orElseGet(() -> categoriaRepository.save(c)))
                    .collect(Collectors.toSet());
            produto.setCategorias(categoriasPersistidas);
        }

        // Vincula o produto às imagens
        if (produto.getImagens() != null) {
            produto.getImagens().forEach(img -> img.setProduto(produto));
        }

        return produtoRepository.save(produto);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public List<Produto> listarPorVendedor(UUID idVendedor) {
        return produtoRepository.findByVendedor_IdUsuario(idVendedor);
    }

    public List<Produto> listarPorCategoria(String nomeCategoria) {
        return produtoRepository.findByCategorias_Nome(nomeCategoria);
    }
}
