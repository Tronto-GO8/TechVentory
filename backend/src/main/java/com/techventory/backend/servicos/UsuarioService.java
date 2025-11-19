package com.techventory.backend.servicos;


import com.techventory.backend.DTOs.EnderecoDTO;
import com.techventory.backend.DTOs.UsuarioUpdateDTO;
import com.techventory.backend.modelos.Endereco;
import com.techventory.backend.modelos.Usuario;
import com.techventory.backend.repositorio.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Cadastro de novo usuário
    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado!");
        }

        // Criptografa a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setTipoLogin("LOCAL");

        return usuarioRepository.save(usuario);
    }

    // Autenticação (login)
    public Optional<Usuario> autenticar(String email, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent() && passwordEncoder.matches(senha, usuarioOpt.get().getSenha())) {
            return usuarioOpt;
        }
        return Optional.empty();
    }

    // Table usuário

    public List<Usuario> buscarClientesDoVendedor(Long vendedorId, String email, Long idCliente) {

        if (email != null && !email.isBlank()) {
            return usuarioRepository.findClientesByVendedorAndEmail(vendedorId, email);
        }

        if (idCliente != null) {
            return usuarioRepository.findClientesByVendedorAndClienteId(vendedorId, idCliente);
        }

        return usuarioRepository.findClientesByVendedor(vendedorId);
    }

    public Map<String, Object> buscarUsuarioCompleto(Long idUsuario) {
        return usuarioRepository.buscarUsuarioCompleto(idUsuario);
    }

    // atualizar dados usuário

    @Transactional
    public Usuario atualizarUsuario(Long idUsuario, UsuarioUpdateDTO dto) {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualiza dados básicos
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setCpf(dto.cpf());

        // Atualizar endereço
        EnderecoDTO e = dto.endereco();
        Endereco endereco = usuario.getEndereco();

        if (endereco == null) {
            endereco = new Endereco();
            endereco.setUsuario(usuario); // mantém relação bidirecional
        }

        endereco.setCep(e.cep());
        endereco.setRua(e.rua());
        endereco.setNumero(e.numero());
        endereco.setComplemento(e.complemento());
        endereco.setBairro(e.bairro());
        endereco.setCidade(e.cidade());
        endereco.setEstado(e.estado());

        usuario.setEndereco(endereco);

        return usuarioRepository.save(usuario);
    }

}
