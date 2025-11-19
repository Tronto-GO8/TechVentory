package com.techventory.backend.controller;

import com.techventory.backend.DTOs.UsuarioUpdateDTO;
import com.techventory.backend.modelos.Usuario;
import com.techventory.backend.repositorio.UsuarioRepository;
import com.techventory.backend.servicos.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    // dados do usuário

    @GetMapping("/{idUsuario}")
    public ResponseEntity<?> buscarUsuario(@PathVariable Long idUsuario) {

        Map<String, Object> resultado = usuarioService.buscarUsuarioCompleto(idUsuario);

        if (resultado == null || resultado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<?> atualizarUsuario(
            @PathVariable Long idUsuario,
            @RequestBody UsuarioUpdateDTO dto) {

        try {
            Usuario atualizado = usuarioService.atualizarUsuario(idUsuario, dto);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}