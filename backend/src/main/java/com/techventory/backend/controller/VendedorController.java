package com.techventory.backend.controller;

import com.techventory.backend.DTOs.DTOCriarVendedor;
import com.techventory.backend.modelos.Usuario;
import com.techventory.backend.modelos.Vendedor;
import com.techventory.backend.repositorio.UsuarioRepository;
import com.techventory.backend.repositorio.VendedorRepository;
import com.techventory.backend.servicos.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vendedores")
@CrossOrigin(origins = "*")
public class VendedorController {

    private final UsuarioRepository usuarioRepository;
    private final VendedorRepository vendedorRepository;
    private final UsuarioService usuarioService;

    public VendedorController(UsuarioRepository usuarioRepository, VendedorRepository vendedorRepository, UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.vendedorRepository = vendedorRepository;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/promover")
    public ResponseEntity<?> promover(@RequestBody DTOCriarVendedor dto) {

        Usuario usuario = usuarioRepository.findById(dto.idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Vendedor vendedor = new Vendedor();
        vendedor.setIdUsuario(usuario.getIdUsuario());
        vendedor.setNomeLoja(dto.nomeDaLoja);
        vendedor.setCnpj(dto.cnpj);
        vendedor.setContaBancaria(dto.contaBancaria);
        vendedor.setCargo(dto.cargo);
        vendedor.setReputacao(5.0);

        vendedorRepository.save(vendedor);

        return ResponseEntity.ok(Map.of(
                "message", "Usuário promovido a vendedor com sucesso!",
                "vendedor", vendedor
        ));
    }

    @GetMapping("{vendedorId}")
    public ResponseEntity<List<Usuario>> getClientesPorVendedor(
            @PathVariable Long vendedorId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Long idCliente
    ) {
        List<Usuario> clientes = usuarioService.buscarClientesDoVendedor(
                vendedorId, email, idCliente
        );
        return ResponseEntity.ok(clientes);
    }



}
