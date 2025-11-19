Documentação do Projeto

Componentes Reutilizáveis

1. InputEmail  
   Campo de email com ícone.  
   Usa variável de estilo `iconeComInput` para evitar repetição de classes Tailwind.  
   Aceita props do React Hook Form para integração com validação.

2. InputSenha  
   Campo de senha com ícone de cadeado e botão para mostrar/ocultar senha.  
   Usa variável de estilo `iconeComInput` para ícone.  
   Recebe o texto do label como prop.  
   Integra checklist visual de requisitos de senha via componente `CheckListSenha`.  
   Exibe borda/ícone de erro quando prop `isError` é verdadeira.

3. InputNome  
   Campo de nome com ícone.  
   Padronizado para uso com React Hook Form e validação.

4. InputError  
   Componente para exibir mensagens de erro de validação abaixo dos inputs.  
   Padroniza a estilização dos erros em todos os formulários.

5. LoginSocial  
   Botões para login com Google e Facebook.  
   Ícones SVG personalizados.

6. OuSeparador  
   Componente para separar seções com uma linha ou juntamente com o texto "ou".  
   Usado tanto no Login quanto no Cadastro.

7. TextoLinkAlternativo  
   Componente para exibir texto alternativo com link (ex: "Já tem uma conta? Entrar").  
   Evita duplicação de código nos formulários.

8. CheckListSenha  
   Checklist visual dos requisitos de senha.  
   Cada item fica verde conforme o usuário atende ao requisito.

9. InputReutilizavel
   Base genérica para inputs.
   Aceita ícone à esquerda e rightElement (ex.: botão de mostrar senha).
   Responsável pela padronização dos estilos (iconeComInput).
   Usado internamente em `InputEmail`, `InputSenha`, `InputNome`.

10. FormCardHeader
    Cabeçalho reutilizável para páginas de autenticação.
    Recebe título (titulo), descrição opcional (descricao) e link de voltar (linkDeVoltar).
    Permite centralizar o texto quando não há link (textoCentralizado).
    Padroniza os headers de páginas como Login, Cadastro, Esqueceu Senha e Redefinir Senha.
    Páginas

11. Header (login/cadastro)  
    Cabeçalho simples usado nas páginas de autenticação (LOGO central).  
    Local: src/components/loginCadastro/Header.tsx.

12. InputsLoginCadastro (src/components/loginCadastro/InputsLoginCadastro.tsx)  
    Consolida InputNome, InputEmail, InputSenha (versão com toggle de visibilidade).  
    Reusa InputReutilizavel, Button (rightElement) e ícones lucide-react.  
    InputSenha local neste arquivo oferece o botão mostrar/ocultar senha.

Header Inicial

1. HeaderInicial
   Exibe LOGO (link para /app/inicial).
   Mostra botões: Perfil (Dropdown), Assistência (Headset) e Área administrativa.
   A ação da Área administrativa chama entrarNaAreaAdmOuAbrirModal:
   Se usuarioAtual?.isVendedor é false abre modal para cadastro de vendedor.
   Integra ModalSeTornarVendedor.
   Se true redireciona para /app/areaAdmnistrativa.
   Local: src/components/e-commerce/HeaderInicial.tsx.

2. Menu de Perfil (Dropdown)
   Dropdown com opções da conta (Informações, Pedidos, Chamados, Configurações, Sair) usando primitives do DropdownMenu.
   Usa a variável `iconeComParagrafo` para alinhar ícones e texto.
   Botão "Sair" estilizado em vermelho e redireciona para /login
   Local: src/components/ui/ProfileDropdown.tsx (ou similar).

3. Modal: ModalSeTornarVendedor
   Arquivo: src/components/e-commerce/ModalSeTornarVendedor.tsx (ou similar).

Props:
mostrarModalVendedor: boolean
fecharModal: () => void
confirmar: (dados: { nomeDaLoja: string; cnpj: string }) => void

Comportamento
Formulário com nomeDaLoja (obrigatório) e cnpj (opcional).
Validação com Zod (modalSeTornarVendedorSchema) e zodResolver.
Ao submeter chama confirmar com { nomeDaLoja: string, cnpj: string } — por padrão enviamos cnpj: data.cnpj ?? "" para garantir string ao backend/context.
Ao fechar (Cancel) reseta o formulário.
E-commerce: produtos, cards e imagem

1. ProdutosInfo (tipo + lista)
   Exporta a interface Produtos (id, nome, preco, imagem[], descricao, categoria, quantidade, empresa, tags) e a lista ProdutoInfo.
   Local: src/components/ProdutosInfo.ts.

2. ImagemProduto
   Implementado com framer-motion (AnimatePresence + motion.img) para animação fade + scale.
   Props: imageUrl: string, nome: string.
   Comportamento:
   key={imageUrl} forçando re-mount e animação na troca.
   onLoad seta estado imagemCarregada (pode ser usado para skeletons/placeholder).
   Local: src/components/e-commerce/produto/ImagemProduto.tsx.

3. ConteudoProduto
   Renderiza nome, empresa, preço e tags do produto dentro do card.
   Limita o número de tags exibidas pela constante MAX_VISIVEL.
   Usa formatarPrecoBRL (import formatarPrecoBRL de src/utils/FormatarPrecoBRL).
   Usa tagsStyle de src/styles/variaveisTailwind/produto/Reutilizaveis.
   Mostra +N quando houver mais tags.
   Recebe props: nome, empresa, preco, tags.
   Local: src/components/e-commerce/produto/ConteudoProduto.tsx.

4. CardProduto
   Componente que combina ImagemProduto, ConteudoProduto e BtnCarrinho.
   Faz controle de hover para exibir BtnCarrinho.
   Usa useTrocaDeImagens para troca automática de imagens ao hover (com preload).
   Usa useCarrinho para adicionar ao carrinho via adicionarNoCarrinho(produto, 1)
   Exibe skeleton enquanto loading === true (componente Skeleton).
   Props: produtos: Produtos.
   Local: src/components/e-commerce/produto/CardProduto.tsx.

5. ContainerProduto
   Componente que recebe produtos: Produtos[] e mapeia para LazyCardProduto.
   Exibe mensagem de "Nenhum produto encontrado" se não houver itens.
   Local: src/components/e-commerce/produto/ContainerProduto.tsx.

6. LazyCardProduto
   Componente que combina:
   useComponenteVisivel() (IntersectionObserver ref, jaCarregado)
   useLoading(skeletonDelay, jaCarregado) (flag estaCarregando)
   Exibe SkeletonProduto até o card ficar visível e após o delay exibe CardProduto.
   Props:
   produto: Produtos
   skeletonTagCount?: number
   skeletonDelay?: number
   Local: src/components/e-commerce/produto/LazyCardProduto.tsx.
   Observação: melhora performance e experiência ao fazer lazy-loading e skeletons.

7. SkeletonProduto
   Skeleton visual do card (placeholder pulsante) usado enquanto o componente real carrega.
   Props: tagCount?: number.
   Local: src/components/e-commerce/produto/SkeletonProduto.tsx.
   Observação: estilizado com Card e Skeleton primitives; manter contraste e tamanhos compatíveis com o card real.

Comportamento principal
Mostra um Skeleton enquanto loading === true.
Ao passar o mouse (ou focus por teclado), inicia temporizador (DELAY_INICIO) e, se houver várias imagens, começa a trocar imagens a cada INTERVALO_TROCA.
Ao sair do card volta para a primeira imagem.
Chama adicionarAoCarrinho(produto) quando botão é clicado (essa função pode ser substituída por dispatch/rota de contexto).

5. BtnCarrinho (src/components/e-commerce/BtnCarrinho.tsx)

   - Botão circular para carrinho com badge de quantidade
   - Props:
     - `adicionarAoCarrinho?`: função opcional para adicionar item
     - `mostrarTotal?: boolean`: exibe badge com total de itens
     - `redirecionarPara: string`: rota de destino
   - Verifica autenticação antes de redirecionar (fallback para /login)
   - Badge vermelho exibido apenas quando totalAdicionado > 0

6. PrecoMinMax
   Componente que encapsula um Slider para selecionar faixa de preço.
   Props:
   faixaDePreco: number[], mudarPreco: (newValues: number[]) => void, min?, max?, pulandoPrecoEm?
   UI:
   Usa Slider (component UI).
   Mostra valores Min/Max formatados (atenção a typo).
   Local: src/components/e-commerce/filtragem/preco/PrecoMinMax.tsx.

Observação crítica: o código usa toLocaleString("pt-Bt") — isso parece um typo. O locale correto é pt-BR. Corrigir para evitar comportamento inesperado de formatação.

7. FiltrarPreco
   Componente com Popover que exibe PrecoMinMax e botões Aplicar / Limpar.
   Props:
   preco: { min?: number; max?: number }
   aplicarFiltroDePreco?: (faixa: { min: number; max: number }) => void
   Estado interno para faixaDePreco (array) e controle do dropdown (isPriceDropdownOpen).
   Comportamento:
   applyPriceFilter chama aplicarFiltroDePreco com {min, max}.
   clearPriceFilter reseta para valores iniciais e chama aplicarFiltroDePreco.
   Local: src/components/e-commerce/filtragem/FiltrarPreco.tsx.

Hooks

1. useTrocaDeImagens (hook)
   Hook responsável pela lógica de troca de imagens no hover.
   API: useTrocaDeImagens(imagens: string[]) → retorna { indiceAtual, mouseNoCard, aoEntrar, aoSair }.
   Implementa preload(urls: string[]) que cria new Image() para cada URL (evita piscadas ao trocar).
   Constantes: DELAY_INICIO e INTERVALO_TROCA.
   Local: src/hooks/useTrocaDeImagem.ts.

Nota sobre preload: garante que as imagens estejam no cache do navegador antes de serem exibidas, resultando em troca instantânea e sem flicker.

2. useHandleMudarPagina (hook)
   Hook para controle de mudança de página com scrollTo.
   Assinatura: useHandleMudarPagina(setPaginaAtual, totalPaginas) → retorna handleMudarPagina(novaPagina).
   Faz validação de limites e rolagem suave ao topo.
   Local: src/hooks/useHandleMudarPagina.ts.

3. useLogicaSearchESugestoes (hook)
   Gera valorPesquisado, debouncedLocal (usa useDebouncedValue), sugestoes, aoAbrirSugestaoContinuarFocadoNoInput, confirmarPesquisa, onKeyDown (usa useApertarEnterOuEsc).
   Parâmetros configuráveis: pesquisaInicial, numeroDeSugestoesDePesquisa, minCaracteres.
   Local: src/hooks/useLogicaSearchESugestoes.ts.
   Observação: confirmarPesquisa retorna null se menos que minCaracteres.

4. useFiltrarProdutos (hook)
   Filtra produtos por texto, categoria.
   Normaliza strings (remove acentos, lowercase) e realiza comparações Comparação de categoria usa mesmaCategoria que tenta tratar plurais e includes.

5. useDebouncedValue
   Hook para debouncing de um valor (genérico).
   Assinatura: useDebouncedValue<T>(value: T, delay = 300) : T.
   Uso: ideal para inputs de busca antes de disparar filtros/requests.
   Local: src/hooks/useDebouncedValue.ts.
   Observação: limpa o timeout no cleanup do useEffect.

6. useCarousel
   Hook que mede itens dentro de uma “trilha” e determina quantos itens cabem na viewport, offsets e controles.

"API" retornada:
refViewport, refTrilha, refPrimeiroItem — refs para elementos DOM.
indiceInicio — índice do primeiro item visível.
passoPx — offset em pixels para aplicar ao transformar a trilha.
indiceMaxInicio — índice máximo possível para start.
irAnterior, irProximo — funções para navegar.
mostrarControles — booleano se totalItens > qtdVisiveis.
Comportamento:
Usa useLayoutEffect para medir larguras e gap, calcula offsets cumulativos.
Observa resize via ResizeObserver e window resize.
Garante que ao menos 1 item seja considerado visível mesmo se maior que viewport.
Local: src/hooks/useCarousel.ts.
Observação: ideal para carrosséis que precisam de cálculo preciso de offsets (suporta gaps, margens).

7. useApertarEnterOuEsc (ApertarEnterOuEsc)
   Utility hook / factory que retorna handler de teclado (teclas Enter / Escape).
   Assinatura/Props:
   confirmarPesquisa: () => void
   fecharDropDown: (abrir: boolean) => void
   preventDefault?: boolean (default true)
   Uso: passado como onKeyDown em inputs para capturar Enter/Escape e controlar dropdowns de sugestão.
   Local: src/hooks/useApertarEnterOuEsc.ts.

8. useModoMobile
   Detecta tela <= breakpoint.
   Implementação segura para SSR.
   Local: src/hooks/useModoMobile.ts.

9. useSubmitStatus (src/hooks/useSubmitStatus.tsx)  
   Hook para gerenciar estado do botão de submissão: "idle" | "loading" | "success" | "error".  
   Fornece: startLoading(), handleSuccess(), handleError(msg), getButtonContent(), getButtonStyles(), serverError.  
   UI padrão: Loader2 animado durante loading, Check em sucesso, X em erro; altera classes do botão (verde/vermelho).  
   Usado por Login e Cadastro para feedback inline no botão (substitui toast nesse fluxo).

Utilitários

1. formatarPrecoBRL
   Função utilitária para formatar valores em BRL.
   Local: src/utils/formatarPreco.ts.

2. Variáveis de classe reutilizáveis
   iconeComInput:
   tagsStyle:
   Local: src/styles/variaveisTailwind/Reutilizaveis.ts

Tipos / Interfaces

- `src/type/ProdutosType.tsx` — interfaces:
  - Produtos, CartItem, Address, ShippingOption, PaymentMethod.
  - Tipos reutilizados por carrinho, checkout e componentes de produto.

Context

1. AuthContext (src/contexts/AuthContext.tsx)

   - Gerencia autenticação simulada via localStorage.
   - Expondo: usuarioAtual, estaAutenticado, loading, login(email, senha), logout(), register(payload),setUserComoVendedor().
   - Keys utilizadas: USERS_KEY (`app_users_v1`), TOKEN_KEY (`authToken`), AUTH_USER_KEY (`authUser`), VENDOR_DATA_KEY (`vendor_data`).
     setUserComoVendedor(dadosVendedor):
     Atualiza vendorData[email] = dadosVendedor no localStorage.
     Atualiza AUTH_USER_KEY com isVendedor: true e dadosVendedor.
     Atualiza estado usuarioAtual.
   - Observações: login/register simulam delay; logout remove token e usuario do localStorage e atualiza estado.

2. Carrinho (src/contexts/ProdutoCarrinhoContext.tsx) — atualização importante
   - `CarrinhoProvider` agora cria `storageKey` que considera `usuarioAtual`:
     `storageKey = usuarioAtual ? \`${BASE_STORAGE_KEY}_${usuarioAtual.email}\` : BASE_STORAGE_KEY`
   - Isso isola carrinhos por usuário e evita que produtos de uma conta apareçam na outra.
   - Persistência: grava / lê localStorage por storageKey.
   - Exposto: carrinho (Record<productId, quantidade>), totalAdicionado, adicionarNoCarrinho, definirQuantidade, removerDoCarrinho, limparCarrinho.
   - Observação: se desejar, a limpeza da chave do carrinho no logout pode ser feita dentro de AuthContext.logout().

Componentes auxiliares

1. PaginacaoProdutos
   Componente de paginação reutilizável.
   Props: paginaAtual, totalPaginas, onMudarPagina.
   Usa componentes Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious (UI primitives).
   Lógica para exibir elipses quando necessário.
   Local: src/components/e-commerce/PaginacaoProdutos.tsx.

2. Pagination e Skeleton (utilitários)
   Pagination* (componentes e estilos) para paginação.
   Skeleton simples para placeholders pulsantes.
   Local: src/components/ui/Pagination/* e src/components/ui/Skeleton.tsx.

Filtros, Carrossel de Categorias e Busca por Sugestões

1. SearchFilterContainer (src/components/e-commerce/filtragem/SearchFilterContainer.tsx)  
   Componente que agrega a busca com sugestões, botão de categorias e filtro de preço.  
   Props:

   - `pesquisar`, `setPesquisar` — controle do termo de busca.
   - `aoAplicar?` — callback executado ao aplicar filtros.
   - `faixaDePreco` — estado externo de faixa.
     Composição: SearchESugestoes, BtnCategoria, FiltrarPreco, CarouselCategorias, AplicarOuCancelar.  
     Comportamento:
   - Mantém estado local de `filtros` (categoria, faixaDePreco) e `aplicado`.
   - Ao alterar filtros desmarca `aplicado` quando apropriado.
   - Exibe botão Aplicar/Cancelar quando há seleção não aplicada.
   - Fornece `precoAplicado` para aplicar faixa imediatamente.

2. SearchESugestoes
   Componente que integra lógica de busca (hook useLogicaSearchESugestoes) com UI (ComponenteSearch + ContainerDeSugestoes dentro de Popover).
   Props:
   pesquisar, setPesquisar, numeroDeSugestoesDePesquisa?, minCaracteres?
   Fluxo:
   O hook expõe valorPesquisado, setValorPesquisado, debouncedLocal, sugestoes, abrirContainerDeSugestoes, etc.
   confirmar() valida via confirmarPesquisa e chama setPesquisar(term) e fecha o dropdown.
   onSugestaoSelecionada define valorPesquisado, confirma e foca o input.
   Local: src/components/e-commerce/filtragem/SearchESugestoes.tsx.

3. ContainerDeSugestoes
   Componente visual que renderiza o dropdown de sugestões (lista de produtos).
   Props:
   debouncedLocal: string
   totalResultados: number
   sugestoes: Produtos[]
   numeroDeSugestoesDePesquisa?: number
   onSelecionarSugestao: (produto) => void
   onConfirmarPesquisa: (valor?: string) => void
   Comportamento:
   Mostra PesquisaPorResultado no topo com o termo e contagem (botão que confirma a pesquisa).
   Se debouncedLocal.trim().length <= 3 e sugestoes.length === 0 exibe "Nenhum resultado".
   Caso contrário, renderiza `SugestoesDeResultados` com a lista de produtos.
   Local: src/components/e-commerce/filtragem/pesquisa/ContainerDeSugestoes.tsx.

4. ComponenteSearch
   Input de busca com ícone Search, forwardRef para foco externo e atributos ARIA.
   Props:
   valorPesquisado, onChange, onKeyDown?, abrirContainerDeSugestoes: boolean
   Local: src/components/e-commerce/filtragem/pesquisa/ComponenteSearch.tsx.

5. CarouselBtn
   Botão simples para navegação do carrossel (esquerda/direita).
   Props:
   direcao: "esquerda" | "direita"
   onClick: () => void
   esconder?: boolean
   Local: src/components/e-commerce/filtragem/categoria/CarouselBtn.tsx.

6. AplicarOuCancelar
   Componente de ações (botões) reutilizável.
   Props (opcionais):
   cancelar, aplicar, aplicarLabel?, cancelarLabel?, btnAplicarClassName?, btnCancelarClassName?, tamanho?, cancelarVariante?, className?
   Local: src/components/e-commerce/filtragem/AplicarOuCancelar.tsx.

7. PesquisaPorResultado
   Cabeçalho do popover que exibe o termo pesquisado e um botão que confirma a pesquisa (aciona a navegação ou o filtro principal).
   Props (PesquisaPorResultadoProps):
   onConfirmarPesquisa: () => void — função disparada ao clicar no header.
   debouncedLocal: string — termo exibido.
   totalResultados: number — contagem exibida.
   Comportamento / UI:
   Botão ocupando toda a largura com aria-label descritivo (Pesquisar por ${debouncedLocal}).
   Mostra texto auxiliar “Pesquisar por resultado (resultado: X)” e o termo destacado.
   Local sugerido: src/components/e-commerce/filtragem/pesquisa/PesquisaPorResultado.tsx.

8. SearchESugestoes
   Componente que integra UI + lógica (hook useLogicaSearchESugestoes) e orquestra o Popover com ComponenteSearch + ContainerDeSugestoes. Fornece UX padrão para campo de busca com sugestões.
   Props (SearchESugestoesProps):
   pesquisar: string — estado externo do termo pesquisado (passado do pai).
   setPesquisar: (valor: string) => void — setter para atualizar termo no pai.
   numeroDeSugestoesDePesquisa?: number — quantas sugestões mostrar.
   minCaracteres?: number — número mínimo de caracteres para abrir sugestões (default 3).
   Comportamento / Integração:
   Usa useLogicaSearchESugestoes que expõe:
   valorPesquisado, setValorPesquisado, debouncedLocal, refDeInputParaFocar,
   totalResultados, sugestoes, abrirContainerDeSugestoes, aoAbrirSugestaoContinuarFocadoNoInput,
   confirmarPesquisa, onKeyDown, setAbrirContainerDeSugestoes.
   PopoverTrigger usa ComponenteSearch (forwardRef), que recebe onKeyDown que combina useApertarEnterOuEsc e confirmação de Enter.
   ContainerDeSugestoes recebe os dados (debouncedLocal, sugestoes, etc.) e callbacks.
   Ao selecionar sugestão: onSugestaoSelecionada define o valor e confirma (chama setPesquisar(term)).
   Local sugerido: src/components/e-commerce/filtragem/pesquisa/SearchESugestoes.tsx.

9. CarouselCategorias (src/components/e-commerce/filtragem/categoria/CarouselCategorias.tsx)  
   Carrossel horizontal para seleção de categorias.  
   Integra `useCarousel` para cálculo de visibilidade e navegação (irAnterior / irProximo).  
   UI:

- Botões para selecionar categoria.
- Controles esquerdo/direito (CarouselBtn) quando necessário.

10. BtnCategoria
    Botão que abre o carousel de categorias e exibe um badge com a quantidade selecionada.
    Props:
    mostrarCarousel: () => void
    quantidadeSelecionada?: number
    Local: src/components/e-commerce/filtragem/categoria/BtnCategoria.tsx.
    Observações: badge só aparece se quantidadeSelecionada > 0.

Paginação e navegação (componentes)

1. PaginasNumeradas
   Componente responsável por decidir se exibir um número de página ou uma elipse (...).
   Props:
   numeroPagina: number
   paginaAtual: number
   totalPaginas: number
   onMudarPagina: (novaPagina: number) => void
   Lógica:
   Sempre mostra: primeira, última, atual e adjacentes (ex.: 1 ... 4 5 [6] 7 8 ... 20).
   Mostra elipses quando o número está a duas posições da atual.
   Local: src/components/e-commerce/paginacao/PaginasNumeradas.tsx.

2. PaginacaoProdutos
   Componente de paginação para a listagem de produtos.
   Props:
   paginaAtual: number
   totalPaginas: number
   onMudarPagina: (novaPagina: number) => void
   Composição:
   Usa MudarPagina (botões prev/next) e PaginasNumeradas.
   Retorna null se totalPaginas <= 1.
   Local: src/components/e-commerce/paginacao/PaginacaoProdutos.tsx.

3. MudarPagina
   Wrapper para PaginationPrevious / PaginationNext com lógica de desativação e classes comuns.
   Props:
   desativarSe: boolean
   onMudarPagina: () => void
   tipoDeBotao: "previous" | "next"
   Local: src/components/e-commerce/paginacao/MudarPagina.tsx.

Categorias

1. categoriasProdutos
   Lista principal de categorias, começando por "Todos" seguida das categorias eletrônicas.
   Local: src/components/CategoriasProdutos.ts.

Carrinho

1. SumarioCard (src/components/carrinho/SumarioCard.tsx)

   - Card de resumo do pedido
   - Modo mobile (expansível) ou desktop (fixo)
   - Exibe CompactoMobileHeader quando recolhido
   - Botões "Continuar" e "Limpar Carrinho"

2. CompactoMobileHeader:
   Local: src/components/carrinho/CompactoMobileHeader.tsx.
   Props: total: number, onCheckout?: () => void, expandido?: () => void.

3. ProdutosCarrinho (src/components/carrinho/ProdutosCarrinho.tsx)

   - Card expandido de produto no carrinho
   - Controles de quantidade (+/-)
   - Botão remover (lixeira)
   - Cálculo de total por item
   - Fallback para imagens não carregadas

4. CarrinhoVazio
   Propósito: tela / placeholder mostrado quando o carrinho não possui itens.
   Arquivo: src/components/carrinho/CarrinhoVazio.tsx
   Comportamento / UI
   Ícone grande ShoppingBag (lucide-react).
   Mensagens:
   Título: “Seu carrinho está vazio”
   Texto auxiliar: “Adicione produtos para começar suas compras”
   Botão Continuar comprando que leva o usuário para a listagem de produtos (/app/inicial) via Link do react-router-dom.
   Estilização: centralizado verticalmente, fundo escuro, texto claro — mantém consistência com o layout do carrinho.
   Acessibilidade / Observações
   Botão usa Button do design system; ícone decorativo com contraste reduzido.
   Ideal para ser retornado quando items.length === 0 em pages/Carrinho.tsx.
   Local de import sugerido: import CarrinhoVazio from "@/components/carrinho/CarrinhoVazio";
   Páginas

5. InputsEndereco (src/components/carrinho/checkout/sessaoEndereco/InputsEndereco.tsx)

   - Conjunto de inputs padronizados para formulário de endereço:
     - InputCep: máscara "00000-000"
     - InputRua: endereço principal
     - InputNumero: número do endereço
     - InputComplemento: opcional
     - InputBairro: bairro/região
     - InputCidade: cidade
     - InputEstado: UF (máximo 2 caracteres)
   - Todos usam:
     - `formInputEnderecoCarrinho` para estilização consistente
     - Ícones do Lucide React com tamanho padronizado
     - Base em InputReutilizavel para comportamento comum

6. OpcoesDeEntrega (src/components/carrinho/checkout/sessaoEndereco/OpcoesDeEntrega.tsx)

   - Seletor de método de entrega com RadioGroup
   - Opções:
     - Retirada na Loja (grátis)
     - Fretado (R$ 19,90)
   - UI:
     - Card escuro com bordas personalizadas
     - Destaque visual da opção selecionada
     - Ícone de check na opção ativa
     - Preço formatado (grátis ou valor)
   - Props:
     - `metodoDeEntrega`: método atual
     - `quandoMetodoDeEntregaAlterar`: handler para mudança

7. CheckoutCarrinho (src/components/carrinho/checkout/CheckoutCarrinho.tsx)

   - Integra CartaoForm apenas quando método selecionado é crédito ou débito.
   - Mantém dois estados:
     - cardData: CardData | undefined — dados limpos do cartão.
     - cardAccepted: boolean — indica se o formulário foi aceito (fechado e resumo mostrado).
   - Fluxo:
     - Ao selecionar método cartão: exibe CartaoForm.
     - Ao submeter CartaoForm válido: handleCartaoSubmit guarda cardData e seta cardAccepted = true — CartaoForm some e aparece um resumo mascarado.
     - Quando cardAccepted e cardData presentes: mostra resumo com nome, últimas 4 do cartão e validade; botão "Editar" volta ao formulário.
   - Valida endereço para frete: exige address se shippingMethod === "shipping".
   - Passa cardData para CheckoutConfirmarVoltarBtn para habilitar confirmação.

8. CheckoutConfirmarVoltarBtn (src/components/carrinho/checkout/CheckoutConfirmarVoltarBtn.tsx)

   - Lógica para habilitar botão de confirmação:
     - Requer selectedPayment.
     - Se shippingMethod === "shipping" requer address.
     - Se método for "credit" ou "debit" requer cardData (o formulário já foi validado antes de fechar).
   - Texto do botão principal muda conforme estado:
     - "Selecione o pagamento", "Adicione um endereço", "Preencha os dados do cartão" ou "Confirmar Compra".
   - onConfirm é chamado apenas se condições atendidas.

9. CheckoutProduto (src/components/carrinho/checkout/CheckoutProduto.tsx)

   - Lista scrollável de produtos no checkout
   - Exibe quantidade e total por item
   - Layout compacto com imagem, nome, empresa

10. SumarioOrdenado (src/components/carrinho/checkout/SumarioOrdenado.tsx)

- Exibe subtotal, frete e total
- Formatação de valores em BRL
- Título opcional via prop `mostrarTitulo`

11. AddressForm (src/components/carrinho/checkout/sessaoEndereco/AddressForm.tsx)

- Formulário completo de endereço
- Validação com `enderecoSchema`
- Autofill simulado por CEP
- Modo compacto ou card completo
- Feedback visual de loading no CEP

12. CardEnderecoDeEntrega (src/components/carrinho/checkout/sessaoEndereco/CardEnderecoDeEntrega.tsx)

- Exibe endereço formatado
- Suporta endereço de entrega ou retirada
- Layout consistente com tema escuro

13. EnderecoHeader (src/components/carrinho/checkout/sessaoEndereco/EnderecoHeader.tsx)

- Header da seção de endereço
- Botão "Alterar" quando aplicável
- Ícone MapPin e título

14. OpcoesDeEntrega (src/components/carrinho/checkout/sessaoEndereco/OpcoesDeEntrega.tsx)

- Seleção de método de entrega
- Opções: Retirada (grátis) ou Frete
- Radio buttons estilizados

15. Pagamento (src/components/carrinho/checkout/Pagamento.tsx)

- Seleção de método de pagamento
- Integra com `paymentMethods`
- Radio group estilizado
- Ícone e descrição por método

16. MetodosDePagamento (src/components/MetodosDePagamento.ts)

- Configuração dos métodos disponíveis
- Crédito, Débito, PIX, Boleto
- Ícones do Lucide React

CartaoForm (src/components/carrinho/CartaoForm.tsx)

- Integra react-hook-form + zodResolver(cartaoSchema), mode: "onBlur".
- Campos:
  - number: input formatado (agrupa a cada 4 dígitos), aceita até 19 dígitos; maxLength do input definido para 23 (19 + espaços).
  - name: nome no cartão.
  - expiry: máscara MM/YY, maxLength 5.
  - cvv: numérico, max 4 dígitos.
  - identificationType: CPF/CNPJ (enum).
  - identificationNumber: apenas números, limite prático 14.
- Comportamento:
  - Limita entradas (número, validade, cvv, documento) para evitar que o usuário digite além do permitido (inclui sanitização ao colar).
  - Ao submeter, os dados são "limpos" (número sem espaços, documento apenas dígitos) e enviados via onSubmit.
  - O botão "Usar cartão" só dispara onSubmit quando os dados são válidos (zodResolver impede envio inválido). Desta forma o formulário some apenas se os dados forem validados.
  - Oferece onBlurChange para atualizar preview/estado enquanto usuário interage.

Páginas

1. Login (src/pages/Login.tsx)

   - Formulário com `InputEmail` e `InputSenha`.
   - Validação via react-hook-form + zodResolver (loginSchema).
   - Integra `useSubmitStatus` para feedback do botão: Loader2 → success (verde + check) → error (vermelho + X).
   - Mostra mensagem de erro de servidor (`serverError`) abaixo dos inputs.
   - Link "Esqueceu a senha?", separador "ou", LoginSocial e link para cadastro.

2. Cadastro (src/pages/Cadastro.tsx)

   - Formulário: nome, email, senha, confirmar senha.
   - Validação com `cadastroSchema` (Zod).
   - Integra `useSubmitStatus` para feedback do botão de criar conta.
   - Inputs destacam erro com borda vermelha (`isError`) e mensagem via `InputError`.
   - Após sucesso navega para `/login`.

3. EsqueceuSenha  
   Formulário para recuperação de senha via email.  
   Botão para enviar link de recuperação.  
   Link para voltar ao login.

4. RedefinirSenha
   Página para redefinir senha após o link de recuperação.
   Campos: nova senha e confirmar nova senha.
   Validação com redefinirSenhaSchema.
   Checklist de senha exibido abaixo do campo "Nova senha".
   Botão para confirmar redefinição (com estado de carregando).
   Link para voltar ao login.
   Senha nunca é exibida no console.

5. Inicial — página principal do e-commerce
   Cabeçalho(HeaderInicial), barra de busca (SearchFilterContainer) e listagem de produtos.
   Lógica atual:
   PRODUTOS_POR_PAGINA = 10.
   Usa useFiltrarProdutos para filtrar por termo, categoria.
   Aplica faixa de preço (recebida do SearchFilterContainer) sobre os produtos filtrados.
   Usa useFiltradosPorPreco para cálculo de precoMin e precoTotal (min/max do conjunto filtrado).
   useHandleMudarPagina controla navegação e scroll.
   Renderiza CardProduto para produtosPaginaAtual (array slice).
   Local: src/pages/Inicial.tsx.

6. Carrinho (src/pages/Carrinho.tsx)
   - Usa `useCarrinho()` para ler o estado do carrinho e ações.
   - Mapeia `carrinho` (id→quantidade) para `items` consultando `ProdutoInfo`.
   - Calcula `subtotal`, `shippingPrice` e `totalPrice`.
   - Exibe lista de `ProdutosCarrinho` com handlers (aumentar, diminuir, remover).
   - SumarioCard lateral (desktop) e fixo no mobile.
   - Checkout modal (`CheckoutCarrinho`) integrado com seleção de endereço, frete e pagamento.
   - Ao confirmar compra limpa o carrinho (limparCarrinho()).

Layout e App

1. Layout (src/Layout.tsx)

   - Container principal da aplicação
   - Adicionada rota index (Route index element={<Inicial />}) para que acessar /app carregue automaticamente Inicial.
   - Rotas principais:
     - `/app/inicial`
     - `/app/carrinho`
     - `/app/assistenciaAoProduto`
     - `/app/areaAdmnistrativa`
     - `/app/conta`
   - HeaderInicial fixo

2. App.css

   - Reset básico de CSS
   - Box-sizing consistente

3. App.tsx
   Rotas definidas
   /esqueceuSenha → EsqueceuSenha
   Página para solicitar link de recuperação de senha.
   /login → Login
   Página de autenticação (login por email/senha + social login).
   / → Navigate to="/app"
   Redirecionamento: raiz do app direciona para área principal (/app).

- → Navigate to="/app"
  Rotas desconhecidas redirecionam para /app. (Pode ser alterado para /login conforme política de acesso.)
  /cadastro → Cadastrar
  Página de registro de novo usuário.
  /auth/callback → AuthCallback
  Callback para fluxos OAuth / Social login.
  /app/\* → Layout (envolvido por CarrinhoProvider)
  Área autenticada / principal da aplicação (listagem de produtos, carrinho, conta, área administrativa, etc.). Todas as rotas filhas dentro do Layout terão acesso ao CarrinhoProvider.

Schemas / Validação

- Schemas organizados em `src/schemas`.
- `loginSchema` permanece para login (email termina em .com ou .com.br).
- `redefinirSenhaSchema` garante que novaSenha e confirmarSenha sejam iguais.
- `enderecoShema.tsx` (agora `enderecoSchema`) — valida campos de endereço:
  - `nome`: obrigatório, max 100 caracteres.
  - `cep`: regex (`00000-000` ou `00000000`).
  - `rua`, `numero`, `bairro`, `cidade`: obrigatórios.
  - `estado`: 2 letras, transformado para maiúsculas.
  - Tipagem exportada: `EnderecoFormSchema` (usada em AddressForm e checkout).
  - `modalSeTornarVendedorSchema`
    nomeDaLoja: z.string().min(1).max(100)
    cnpj: preprocess que remove não-dígitos; se resultado vazio retorna undefined; valida string().regex(/^\d{14}$/).optional().

cartaoSchema (src/schemas/cartaoSchema.tsx)

- Validações:
  - number: string entre 13 e 19 dígitos (sem espaços).
  - name: mínimo 3 caracteres; apenas letras e espaços.
  - expiry: formato MM/YY; valida mês e se não está expirado.
  - cvv: 3 ou 4 dígitos.
  - identificationType: enum ["CPF","CNPJ"] opcional.
  - identificationNumber: opcional, string numérica.
- Usado como fonte de verdade para validação do CartaoForm.

Estilização

- Tailwind CSS para estilização.
- Variáveis de classe em `src/styles/variaveisTailwind/Reutilizaveis.tsx` (ex.: `iconeComInput`, `iconeComParagrafo`, `formInputEnderecoCarrinho`, `tagsStyle`).
- Borda dos inputs em estado de erro agora aplicada de forma que seja visível independentemente do componente base `Input`.

Rotas
Definidas em `App.tsx` usando `HashRouter` do `react-router-dom`.
Rotas principais:

- `/login` — Página de login
- `/cadastro` — Página de cadastro
- `/esqueceusenha` — Página de recuperação de senha
- `/auth/callback` — Callback OAuth
- `/app/*` — Área autenticada (Layout + páginas internas)
- `/` e `*` — redirecionam para `/login` (ambiente dev config)
