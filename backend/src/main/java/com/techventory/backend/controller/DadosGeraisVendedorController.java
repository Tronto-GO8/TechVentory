package com.techventory.backend.controller;

import com.techventory.backend.servicos.DadosGeraisVendedorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vendedores/{idUsuario}/dashboard")
@CrossOrigin(origins = "*")
public class DadosGeraisVendedorController {

    private final DadosGeraisVendedorService dashboardService;

    public DadosGeraisVendedorController(DadosGeraisVendedorService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/total-produtos")
    public ResponseEntity<?> getTotalProdutos(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(dashboardService.getTotalProdutos(idUsuario));
    }

    @GetMapping("/total-clientes")
    public ResponseEntity<?> getTotalClientes(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(dashboardService.getTotalClientes(idUsuario));
    }
/*
    @GetMapping("/chamados-pendentes")
    public ResponseEntity<?> getChamadosPendentes(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(dashboardService.getChamadosPendentes(idUsuario));
    }

    @GetMapping("/total-funcionarios")
    public ResponseEntity<?> getTotalFuncionarios(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(dashboardService.getTotalFuncionarios(idUsuario));
    }

    @GetMapping("/receita-mensal")
    public ResponseEntity<?> getReceitaMensal(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(dashboardService.getReceitaMensal(idUsuario));
    }


    @GetMapping("/pedidos-dia")
    public ResponseEntity<?> getPedidos(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(dashboardService.getPedidos(idUsuario));
    }

     */
}
