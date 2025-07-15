



SELECT 
    l.id,
    l.descricao AS descricao_lancamento,
    l.valor_parcela,
    l.data_lancamento,
    l.tipo,
    l.origem_tipo,
    l.origem_id,
    fp.nome AS forma_pagamento,
    u.nome AS usuario,
    e.nome AS empresa,

    -- Pegando nome da origem dependendo da tabela
CASE
  WHEN l.origem_tipo = 'receita' THEN (SELECT r.nome FROM receita r WHERE r.id = l.origem_id)
  WHEN l.origem_tipo = 'despesa' THEN (SELECT s.nome FROM sub_despesa s WHERE s.id = l.origem_id)
  WHEN l.origem_tipo = 'contas_receber' THEN (SELECT cr.nome FROM receita cr WHERE cr.id = l.origem_id)
  WHEN l.origem_tipo = 'contas_pagar' THEN (SELECT cp.nome FROM sub_despesa cp WHERE cp.id = l.origem_id)
  ELSE ''
END AS origem_nome


FROM lancamentos l
LEFT JOIN forma_pagamento fp ON l.id_forma_pagamento = fp.id
INNER JOIN usuario u ON l.id_usuario = u.id
INNER JOIN empresa e ON l.id_empresa = e.id

