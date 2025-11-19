package com.techventory.backend.servicos;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ImagemService {

    private final String uploadDir = "uploads/";

    public String salvarImagem(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Arquivo vazio.");
            }

            // Gera nome único
            String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Caminho final
            Path path = Paths.get(uploadDir + nomeArquivo);

            // Cria diretórios se não existirem
            Files.createDirectories(path.getParent());

            // Salva o arquivo fisicamente
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Retorna a URL pública
            return "/uploads/" + nomeArquivo;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar imagem: " + e.getMessage());
        }
    }
}
