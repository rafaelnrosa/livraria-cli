# 🧪 Relatório de Testes — BookStore Manager CLI

Execução realizada em: **16/07/2026**  
Comando: `npm run test:app`  
Resultado: **✅ 40 testes passando | ❌ 0 falhas**

---

## Como reproduzir

```bash
# 1. Popular o banco com dados de exemplo
npm run seed

# 2. Executar os testes funcionais
npm run test:app
```

---

## Saída completa do terminal

```
╔══════════════════════════════════════════════╗
║   🧪  BookStore Manager — Testes Funcionais  ║
╚══════════════════════════════════════════════╝
✅ Conexão com PostgreSQL estabelecida com sucesso!
```

---

## Autores

| # | Teste | Resultado |
|---|---|---|
| 1 | Cadastro de autor | ✅ ID 6 criado |
| 2 | Listagem de autores | ✅ 6 autor(es) encontrado(s) |
| 3 | Busca por ID | ✅ Encontrado: Autor Teste |
| 4 | Busca por nome | ✅ 1 resultado(s) |
| 5 | Atualização | ✅ Novo nome: Autor Teste Atualizado |
| 6 | ID inexistente (esperado) | ⚠️ Autor com ID 99999 não encontrado. |
| 7 | Remoção | ✅ Autor removido |

```
══════════════════
  TESTE: AUTORES
══════════════════
  ✅ Cadastro — ID 6
  ✅ Listagem — 6 autor(es) encontrado(s)
  ✅ Busca por ID — encontrado: Autor Teste
  ✅ Busca por nome — 1 resultado(s)
  ✅ Atualização — novo nome: Autor Teste Atualizado
  ⚠️  [esperado] ID inexistente — Autor com ID 99999 não encontrado.
  ✅ Remoção — autor removido
```

---

## Livros

| # | Teste | Resultado |
|---|---|---|
| 1 | Cadastro de livro | ✅ ID 10: "Livro de Teste" |
| 2 | Listagem com JOIN | ✅ 10 livro(s) |
| 3 | Busca por ID | ✅ "Livro de Teste" \| Autor: Clarice Lispector |
| 4 | Busca por título | ✅ 1 resultado(s) |
| 5 | Atualização de preço e estoque | ✅ R$ 59,90 \| estoque: 8 |
| 6 | Autor inexistente (esperado) | ⚠️ Autor com ID 99999 não encontrado. |
| 7 | Remoção | ✅ Livro removido |

```
═════════════════
  TESTE: LIVROS
═════════════════
  ✅ Cadastro — ID 10: "Livro de Teste"
  ✅ Listagem — 10 livro(s)
  ✅ Busca por ID — "Livro de Teste" | Autor: Clarice Lispector
  ✅ Busca por título — 1 resultado(s)
  ✅ Atualização — novo preço: R$ 59,90, estoque: 8
  ⚠️  [esperado] Autor inexistente — Autor com ID 99999 não encontrado.
  ✅ Remoção — livro removido
```

---

## Clientes

| # | Teste | Resultado |
|---|---|---|
| 1 | Cadastro de cliente | ✅ ID 6: Cliente Teste |
| 2 | Listagem | ✅ 6 cliente(s) |
| 3 | Busca por ID | ✅ Cliente Teste \| cliente.teste@email.com |
| 4 | E-mail duplicado (esperado) | ⚠️ Já existe um cliente com este e-mail. |
| 5 | E-mail inválido (esperado) | ⚠️ E-mail inválido. |
| 6 | Atualização de telefone | ✅ Novo telefone: (11) 88888-8888 |
| 7 | Remoção | ✅ Cliente removido |

```
═══════════════════
  TESTE: CLIENTES
═══════════════════
  ✅ Cadastro — ID 6: Cliente Teste
  ✅ Listagem — 6 cliente(s)
  ✅ Busca por ID — Cliente Teste | cliente.teste@email.com
  ⚠️  [esperado] E-mail duplicado — Já existe um cliente cadastrado com o e-mail "cliente.teste@email.com".
  ⚠️  [esperado] E-mail inválido — E-mail inválido.
  ✅ Atualização — novo telefone: (11) 88888-8888
  ✅ Remoção — cliente removido
```

---

## Empréstimos

| # | Teste | Resultado |
|---|---|---|
| 1 | Realizar empréstimo | ✅ ID 7 \| Livro: 1984 → Cliente: Ana Silva |
| 2 | Decremento de estoque | ✅ Estoque decrementado: 4 → 3 |
| 3 | Listagem total | ✅ 7 empréstimo(s) no total |
| 4 | Listagem de ativos | ✅ 6 empréstimo(s) ativo(s) |
| 5 | Busca por ID | ✅ "1984" \| "Ana Silva" \| Status: ATIVO |
| 6 | Validação de estoque zerado | ✅ Validação OK |
| 7 | Registrar devolução | ✅ Status: DEVOLVIDO \| 16/07/2026 15:57:45 |
| 8 | Restauração de estoque | ✅ Estoque restaurado: 3 → 4 |
| 9 | Devolução dupla (esperado) | ⚠️ O empréstimo #7 já foi devolvido. |

```
══════════════════════
  TESTE: EMPRÉSTIMOS
══════════════════════
  ✅ Empréstimo realizado — ID 7 | Livro: 1984 → Cliente: Ana Silva
  ✅ Estoque decrementado corretamente — agora: 3
  ✅ Listagem — 7 empréstimo(s) no total
  ✅ Ativos — 6 empréstimo(s) ativo(s)
  ✅ Busca por ID — "1984" | "Ana Silva" | Status: ATIVO
  ✅ Validação de estoque — sem livro zerado para testar (todos têm estoque)
  ✅ Devolução registrada — Status: DEVOLVIDO | Data: 16/07/2026, 15:57:45
  ✅ Estoque restaurado após devolução — volta para: 4
  ⚠️  [esperado] Devolução dupla — O empréstimo #7 já foi devolvido.
```

---

## Relatórios

| # | Relatório | Resultado |
|---|---|---|
| 1 | Livros disponíveis | ✅ 9 resultado(s) |
| 2 | Livros emprestados | ✅ 5 empréstimo(s) ativo(s) |
| 3 | Livros por autor | ✅ 5 autor(es) |
| 4 | Empréstimos por livro (Top 20) | ✅ top 9 |
| 5 | Clientes com empréstimos ativos | ✅ 5 cliente(s) |

```
═════════════════════
  TESTE: RELATÓRIOS
═════════════════════
  ✅ Livros disponíveis — 9 resultado(s)
     • 1984 (estoque: 4)
     • A Hora da Estrela (estoque: 3)
     • A Revolução dos Bichos (estoque: 3)
  ✅ Livros emprestados — 5 empréstimo(s) ativo(s)
     • "Dom Casmurro" → Ana Silva
     • "A Hora da Estrela" → Diego Lima
     • "O Senhor dos Anéis" → Bruno Costa
  ✅ Livros por autor — 5 autor(es)
     • Clarice Lispector: 2 livro(s)
     • George Orwell: 2 livro(s)
     • J.R.R. Tolkien: 2 livro(s)
  ✅ Empréstimos por livro — top 9
     • "1984": 2 empréstimo(s)
     • "Dom Casmurro": 1 empréstimo(s)
     • "Cem Anos de Solidão": 1 empréstimo(s)
  ✅ Clientes com empréstimos ativos — 5 cliente(s)
     • Ana Silva: 1 ativo(s)
     • Bruno Costa: 1 ativo(s)
     • Carla Souza: 1 ativo(s)
```

---

## Validações de Regras de Negócio

| # | Cenário | Comportamento esperado | Resultado |
|---|---|---|---|
| 1 | Nome de autor com 1 caractere | Rejeitar | ⚠️ "O nome do autor deve ter pelo menos 2 caracteres." |
| 2 | Preço negativo | Rejeitar | ⚠️ "O preço não pode ser negativo." |
| 3 | Remover autor com livros vinculados | Rejeitar | ⚠️ "Não é possível remover o autor pois existem livros vinculados a ele." |
| 4 | Empréstimo com livro inexistente | Rejeitar | ⚠️ "Livro com ID 99999 não encontrado." |
| 5 | Empréstimo com cliente inexistente | Rejeitar | ⚠️ "Cliente com ID 99999 não encontrado." |

```
══════════════════════════════════════════
  TESTE: VALIDAÇÕES DE REGRAS DE NEGÓCIO
══════════════════════════════════════════
  ⚠️  [esperado] Nome inválido — O nome do autor deve ter pelo menos 2 caracteres.
  ⚠️  [esperado] Preço negativo — O preço não pode ser negativo.
  ⚠️  [esperado] Autor com livros — Não é possível remover o autor pois existem livros vinculados a ele.
  ⚠️  [esperado] Livro inexistente — Livro com ID 99999 não encontrado.
  ⚠️  [esperado] Cliente inexistente — Cliente com ID 99999 não encontrado.
```

---

## Resultado Final

```
──────────────────────────────────────────────────
📊 RESULTADO FINAL
──────────────────────────────────────────────────
  ✅ Sucessos : 40
  ❌ Falhas   : 0
──────────────────────────────────────────────────

🎉 Todos os testes passaram!

🔒 Conexão com PostgreSQL encerrada.
```

---

## Dados de seed utilizados

### Autores
| ID | Nome | Nacionalidade |
|---|---|---|
| 1 | Machado de Assis | Brasileira |
| 2 | Clarice Lispector | Brasileira |
| 3 | J.R.R. Tolkien | Britânica |
| 4 | George Orwell | Britânica |
| 5 | Gabriel García Márquez | Colombiana |

### Livros
| ID | Título | Autor | Estoque |
|---|---|---|---|
| 1 | Dom Casmurro | Machado de Assis | 5 |
| 2 | Memórias Póstumas | Machado de Assis | 3 |
| 3 | A Hora da Estrela | Clarice Lispector | 4 |
| 4 | Perto do Coração Selvagem | Clarice Lispector | 2 |
| 5 | O Senhor dos Anéis | J.R.R. Tolkien | 6 |
| 6 | O Hobbit | J.R.R. Tolkien | 4 |
| 7 | 1984 | George Orwell | 5 |
| 8 | A Revolução dos Bichos | George Orwell | 3 |
| 9 | Cem Anos de Solidão | Gabriel García Márquez | 4 |

### Clientes
| ID | Nome | E-mail |
|---|---|---|
| 1 | Ana Silva | ana.silva@email.com |
| 2 | Bruno Costa | bruno.costa@email.com |
| 3 | Carla Souza | carla.souza@email.com |
| 4 | Diego Lima | diego.lima@email.com |
| 5 | Eva Rocha | eva.rocha@email.com |

### Empréstimos iniciais (seed)
| Livro | Cliente | Status |
|---|---|---|
| Dom Casmurro | Ana Silva | ATIVO |
| O Senhor dos Anéis | Bruno Costa | ATIVO |
| 1984 | Carla Souza | ATIVO |
| A Hora da Estrela | Diego Lima | ATIVO |
| Cem Anos de Solidão | Eva Rocha | ATIVO |
| Memórias Póstumas | Ana Silva | DEVOLVIDO |
