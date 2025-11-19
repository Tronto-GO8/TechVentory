package com.techventory.backend.repositorio;

import com.techventory.backend.modelos.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PagamentoRepository extends JpaRepository<Pagamento, UUID> {
}
