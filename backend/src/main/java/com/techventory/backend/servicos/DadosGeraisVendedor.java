package com.techventory.backend.servicos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public class DadosGeraisVendedor {

    public int getTotalProdutos(Long idUsuario) {
        // TODO: buscar no banco quantos produtos o vendedor tem
        return 10; // valor fictício
    }

    public int getTotalClientes(Long idUsuario) {
        return 53; // exemplo
    }

    public int getChamadosPendentes(Long idUsuario) {
        return 21;
    }

    public int getTotalFuncionarios(Long idUsuario) {
        return 5;
    }

    public double getReceitaMensal(Long idUsuario) {
        return 5000.0;
    }

    public int getPedidosDoDia(Long idUsuario) {
        return 2;
    }
}
