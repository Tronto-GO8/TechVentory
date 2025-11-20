package com.techventory.backend.controller;

import com.techventory.backend.DTOs.DTOLogin;
import com.techventory.backend.modelos.Usuario;
import com.techventory.backend.servicos.GoogleAuthService;
import com.techventory.backend.servicos.JwtService;
import com.techventory.backend.servicos.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final GoogleAuthService googleAuthService;

    public AuthController(UsuarioService usuarioService, JwtService jwtService, GoogleAuthService googleAuthService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.googleAuthService = googleAuthService;
    }

    // ==============================
    //      REGISTRO NORMAL
    // ==============================
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.registrar(usuario);
        String token = jwtService.gerarToken(novoUsuario.getEmail());

        return Map.of(
                "message", "Usuário cadastrado com sucesso!",
                "token", token,
                "user", Map.of(
                        "id", novoUsuario.getIdUsuario(),
                        "nome", novoUsuario.getNome(),
                        "email", novoUsuario.getEmail()

                )
        );
    }

    // ==============================
    //       LOGIN NORMAL
    // ==============================
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody DTOLogin request) {

        return usuarioService.autenticar(request.getEmail(), request.getSenha())
                .map(usuario -> {
                    String token = jwtService.gerarToken(usuario.getEmail());

                    return Map.of(
                            "message", "Login realizado com sucesso!",
                            "token", token,
                            "user", Map.of(
                                    "id", usuario.getIdUsuario(),
                                    "nome", usuario.getNome(),
                                    "email", usuario.getEmail()
                            )
                    );
                })
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos"));
    }
}
