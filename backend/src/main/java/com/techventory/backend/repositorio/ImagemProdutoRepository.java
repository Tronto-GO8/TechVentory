package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.ImagemProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ImagemProdutoRepository extends JpaRepository<ImagemProduto, UUID> { }
