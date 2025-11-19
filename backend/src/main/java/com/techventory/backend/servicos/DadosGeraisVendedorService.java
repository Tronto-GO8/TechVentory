package com.techventory.backend.servicos;

import com.techventory.backend.repositorio.VendedorRepository;
import org.springframework.stereotype.Service;

@Service
public class DadosGeraisVendedorService {

    private final VendedorRepository repo;

    public DadosGeraisVendedorService(VendedorRepository repo) {
        this.repo = repo;
    }

    public int getTotalProdutos(Long id) {
        return repo.totalProdutos(id);
    }

    public int getTotalClientes(Long id) {
        return repo.totalClientes(id);
    }
/*
    public int getChamadosPendentes(Long id) {
        return repo.chamadosPendentes(id);
    }

    public int getTotalFuncionarios(Long id) {
        return repo.totalFuncionarios(id);
    }

    public double getReceitaMensal(Long id) {
        return repo.receitaMensal(id);
    }


    public int getPedidos(Long id) {
        return repo.pedidos(id);
    }

     */
}
