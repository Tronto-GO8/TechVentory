package com.techventory.backend.modelos;

import jakarta.persistence.*;


@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED) // permite herança entre vendedor/funcionário
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long  idUsuario;

    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;

    private String cpf;

    private String imagemUsuario;

    private String telefone;

    // Campo para saber se veio do Google ou é normal
    private String tipoLogin; // "GOOGLE" ou "LOCAL"

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_endereco")
    private Endereco endereco;

    // geters e setters

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getTipoLogin() {
        return tipoLogin;
    }

    public void setTipoLogin(String tipoLogin) {
        this.tipoLogin = tipoLogin;
    }

    // Getters e Setters
    public Long  getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long  idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getImagemUsuario() {
        return imagemUsuario;
    }

    public void setImagemUsuario(String imagemUsuario) {
        this.imagemUsuario = imagemUsuario;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
        if (endereco != null) {
            endereco.setUsuario(this); // garante o vínculo bidirecional
        }
    }
}
