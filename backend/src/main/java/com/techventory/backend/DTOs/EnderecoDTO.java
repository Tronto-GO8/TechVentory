package com.techventory.backend.DTOs;

public record EnderecoDTO(
        String cep,
        String rua,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String estado
) {}
