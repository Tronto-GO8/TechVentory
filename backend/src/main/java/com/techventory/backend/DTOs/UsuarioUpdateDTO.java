package com.techventory.backend.DTOs;

public record UsuarioUpdateDTO(
        String nome,
        String email,
        String cpf,
        EnderecoDTO endereco
) {}