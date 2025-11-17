package com.techventory.backend.servicos;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;
import com.techventory.backend.modelos.Usuario;
import com.techventory.backend.repositorio.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public GoogleAuthService(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    // 1) Gera URL de autenticação
    public String gerarUrlDeLogin() {
        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&response_type=code"
                + "&scope=openid%20email%20profile"
                + "&access_type=offline";
    }

    // 2) Troca o CODE pelo Token
    public GoogleTokenResponse trocarCodePorToken(String code) throws Exception {
        return new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                "https://oauth2.googleapis.com/token",
                clientId,
                clientSecret,
                code,
                redirectUri
        ).execute();
    }

    // 3) Pega info do usuário a partir do ID TOKEN
    public Usuario processarLogin(GoogleTokenResponse tokenResponse) throws Exception {
        String idTokenString = tokenResponse.getIdToken();

        GoogleIdToken idToken = GoogleIdToken.parse(JacksonFactory.getDefaultInstance(), idTokenString);
        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();
        String nome = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        // cria ou busca o usuário
        return usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario novo = new Usuario();
                    novo.setEmail(email);
                    novo.setNome(nome);
                    novo.setImagemUsuario(picture);
                    novo.setTipoLogin("GOOGLE");
                    return usuarioRepository.save(novo);
                });
    }

    public String autenticarComGoogle(String idTokenString) {
        try {
            var verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new IllegalArgumentException("Token do Google inválido");
            }

            var payload = idToken.getPayload();

            String email = payload.getEmail();
            String nome = (String) payload.get("name");
            String imagem = (String) payload.get("picture");

            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseGet(() -> {
                        Usuario novo = new Usuario();
                        novo.setNome(nome);
                        novo.setEmail(email);
                        novo.setImagemUsuario(imagem);
                        novo.setTipoLogin("GOOGLE");
                        return usuarioRepository.save(novo);
                    });

            return jwtService.gerarToken(usuario.getEmail());

        } catch (Exception e) {
            throw new RuntimeException("Erro ao autenticar com Google: " + e.getMessage());
        }
    }
}
