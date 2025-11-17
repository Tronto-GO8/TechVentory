package com.techventory.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.techventory.backend.modelos.Usuario;
import com.techventory.backend.servicos.GoogleAuthService;
import com.techventory.backend.servicos.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/google")
@CrossOrigin(origins = "*")
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;

    public GoogleAuthController(GoogleAuthService googleAuthService, JwtService jwtService) {
        this.googleAuthService = googleAuthService;
        this.jwtService = jwtService;
    }

    // 1) FRONT PEDIR A URL DO GOOGLE
    @GetMapping("/url")
    public Map<String, String> getGoogleUrl() {
        return Map.of("url", googleAuthService.gerarUrlDeLogin());
    }

    // 2) GOOGLE REDIRECIONA PARA AQUI COM O CODE
    @GetMapping("/callback")
    public ResponseEntity<?> callback(@RequestParam("code") String code) {
        try {
            GoogleTokenResponse tokenResponse = googleAuthService.trocarCodePorToken(code);

            // processa e retorna o usuário completo
            Usuario usuario = googleAuthService.processarLogin(tokenResponse);

            // gerar jwt
            String jwt = jwtService.gerarToken(usuario.getEmail());

            return ResponseEntity.ok(Map.of(
                    "message", "Login Google OK",
                    "token", jwt,
                    "user", Map.of(
                            "id", usuario.getIdUsuario(),
                            "nome", usuario.getNome(),
                            "email", usuario.getEmail()
                    )
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
