import dotenv from 'dotenv';
dotenv.config();

import { executeQuery, closeConnection, testConnection } from '../database/connection';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  const ok = await testConnection();
  if (!ok) { process.exit(1); }

  // Limpa na ordem correta (FK)
  await executeQuery('DELETE FROM emprestimos');
  await executeQuery('DELETE FROM livros');
  await executeQuery('DELETE FROM clientes');
  await executeQuery('DELETE FROM autores');
  await executeQuery('ALTER SEQUENCE autores_id_seq RESTART WITH 1');
  await executeQuery('ALTER SEQUENCE livros_id_seq RESTART WITH 1');
  await executeQuery('ALTER SEQUENCE clientes_id_seq RESTART WITH 1');
  await executeQuery('ALTER SEQUENCE emprestimos_id_seq RESTART WITH 1');

  // Autores
  const autores = await executeQuery<{ id: number; nome: string }>(`
    INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
      ('Machado de Assis',    'Brasileira', '1839-06-21'),
      ('Clarice Lispector',   'Brasileira', '1920-12-10'),
      ('J.R.R. Tolkien',      'Britânica',  '1892-01-03'),
      ('George Orwell',       'Britânica',  '1903-06-25'),
      ('Gabriel García Márquez', 'Colombiana', '1927-03-06')
    RETURNING id, nome
  `);
  console.log('✅ Autores inseridos:');
  autores.forEach(a => console.log(`   [${a.id}] ${a.nome}`));

  // Livros
  const livros = await executeQuery<{ id: number; titulo: string }>(`
    INSERT INTO livros (titulo, isbn, ano_publicacao, preco, quantidade_estoque, id_autor) VALUES
      ('Dom Casmurro',              '9788520921689', 1899, 29.90, 5, 1),
      ('Memórias Póstumas',         '9788535910663', 1881, 34.90, 3, 1),
      ('A Hora da Estrela',         '9788532630124', 1977, 39.90, 4, 2),
      ('Perto do Coração Selvagem', '9788532634177', 1943, 35.00, 2, 2),
      ('O Senhor dos Anéis',        '9788533613379', 1954, 89.90, 6, 3),
      ('O Hobbit',                  '9788533613385', 1937, 49.90, 4, 3),
      ('1984',                      '9788535906770', 1949, 44.90, 5, 4),
      ('A Revolução dos Bichos',    '9788535906787', 1945, 29.90, 3, 4),
      ('Cem Anos de Solidão',       '9788535920598', 1967, 59.90, 4, 5)
    RETURNING id, titulo
  `);
  console.log('\n✅ Livros inseridos:');
  livros.forEach(l => console.log(`   [${l.id}] ${l.titulo}`));

  // Clientes
  const clientes = await executeQuery<{ id: number; nome: string }>(`
    INSERT INTO clientes (nome, email, cpf, telefone) VALUES
      ('Ana Silva',    'ana.silva@email.com',    '11122233344', '(11) 91111-1111'),
      ('Bruno Costa',  'bruno.costa@email.com',  '22233344455', '(11) 92222-2222'),
      ('Carla Souza',  'carla.souza@email.com',  '33344455566', '(21) 93333-3333'),
      ('Diego Lima',   'diego.lima@email.com',   '44455566677', '(31) 94444-4444'),
      ('Eva Rocha',    'eva.rocha@email.com',    '55566677788', '(41) 95555-5555')
    RETURNING id, nome
  `);
  console.log('\n✅ Clientes inseridos:');
  clientes.forEach(c => console.log(`   [${c.id}] ${c.nome}`));

  // Empréstimos
  const emprestimos = await executeQuery<{ id: number }>(`
    INSERT INTO emprestimos (id_livro, id_cliente, data_prevista_devolucao) VALUES
      (1, 1, CURRENT_DATE + 14),
      (5, 2, CURRENT_DATE + 14),
      (7, 3, CURRENT_DATE + 14),
      (3, 4, CURRENT_DATE + 7),
      (9, 5, CURRENT_DATE + 14)
    RETURNING id
  `);
  // Decrementa estoque dos livros emprestados
  await executeQuery(`UPDATE livros SET quantidade_estoque = quantidade_estoque - 1 WHERE id IN (1,5,7,3,9)`);
  console.log(`\n✅ ${emprestimos.length} empréstimos registrados`);

  // Uma devolução já registrada
  await executeQuery(`
    INSERT INTO emprestimos (id_livro, id_cliente, data_prevista_devolucao, data_devolucao, status)
    VALUES (2, 1, CURRENT_DATE - 7, CURRENT_TIMESTAMP, 'DEVOLVIDO')
  `);
  console.log('✅ 1 devolução histórica registrada');

  console.log('\n🎉 Seed concluído com sucesso!');
  await closeConnection();
}

seed().catch(err => {
  console.error('💥 Erro no seed:', err.message);
  process.exit(1);
});
