package com.techventory.backend.DTOs;

import com.techventory.backend.modelos.Usuario;

public class UsuarioDTO {

    public Long id;
    public String nome;
    public String email;
    public String telefone;
    public String numeroChamados;

    public UsuarioDTO(Usuario u) {
        this.id = u.getIdUsuario();
        this.nome = u.getNome();
        this.email = u.getEmail();
        this.telefone = u.getCpf();
        this.numeroChamados = "0";
    }
}
