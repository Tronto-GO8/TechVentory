# Guia de Uso do Backend no IntelliJ IDEA

Este documento explica como abrir, configurar e executar o backend da aplicação utilizando o IntelliJ IDEA. Também descreve o que precisa ser alterado, onde configurar informações sensíveis e como garantir que o ambiente esteja funcionando corretamente.

---

## 1. Pré-requisitos

Antes de abrir o projeto no IntelliJ, verifique se possui:

* **Java 17 ou superior** instalado
* **Maven** (se o projeto não usar wrapper)
* **IntelliJ IDEA** (preferencialmente a versão Community ou Ultimate)
* **PostgreSQL/MySQL** configurado (se o projeto usa banco real)
* **Git** (opcional, se for clonar repositório)

---

## 2. Abrindo o projeto no IntelliJ

1. Abra o IntelliJ IDEA.
2. Clique em **File → Open**.
3. Selecione a pasta do backend (onde está o arquivo `pom.xml`).
4. O IntelliJ irá detectar o projeto Maven automaticamente.
5. Aguarde o carregamento das dependências.

---

## 3. Arquivo `application.properties`

Este é o arquivo onde você deve ajustar informações de ambiente.

fica:

src/main/resources/application.properties

### Exemplo de configurações:

**Banco de Dados:**

```
spring.datasource.url=jdbc:postgresql://localhost:5432/seu_banco
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

**JPA/Hibernate:**

```
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Configuração de porta:**

```
server.port=8080
```

## 4. Configurando o Context Path

O backend utiliza:

```
server.servlet.context-path=/Techventory
```

Isso significa que a API estará disponível em:

```
http://localhost:8080/Techventory
```

Se quiser remover o prefixo, basta apagar essa linha.

---

## 5. Rodando o Backend

1. Abra a classe que contém:

   ```
   @SpringBootApplication
   public class TechventoryBackendApplication { ... }
   ```
2. Clique no botão **Run ▶** ao lado da classe.

## 6. Endpoints e Testes

Use ferramentas como:

* **Postman**
* **Insomnia**
* **Thunder Client (VSCode)**

Exemplo de teste de login:

```
POST http://localhost:8080/Techventory/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

---

## 7. Logs e Erros Comuns

### Porta já está em uso

Mude no `application.properties`:

```
server.port=8081
```

### Banco de dados não conecta

Verifique:

* Serviço do banco está rodando
* Usuário e senha
* URL correta
* Driver configurado no `pom.xml`

### Dependências não baixam

* Vá em **File → Invalidate Caches**
* Reinicie o IntelliJ
* Rode novamente: **Maven → Reimport**

---

## 8. Estrutura Básica do Projeto

```
src/
 └─ main/
    ├─ java/
    │   └─ com.seuprojeto/
    │       ├─ controller/
    │       ├─ service/
    │       ├─ repository/
    │       └─ model/
    └─ resources/
        ├─ application.properties
        └─ static/
```

---

## 9. Conclusão

Com esses passos, você pode:

* Abrir e configurar o backend no IntelliJ
* Ajustar propriedades corretas
* Rodar localmente
* Testar os endpoints
* Preparar ambiente real ou de desenvolvimento

Se quiser, posso gerar uma versão enxuta, uma versão para GitHub ou personalizar conforme seu projeto.
