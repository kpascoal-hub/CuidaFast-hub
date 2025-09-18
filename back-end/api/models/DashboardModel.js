const pool = require('./db');

async function getDashboardData() {
    const connection = await pool.getConnection();
    try {
        const dashboard = {};

        const [totalConsultas] = await connection.query(
            `SELECT COUNT(*) AS total_consultas FROM contratar`
        );
        dashboard.totalConsultas = totalConsultas[0].total_consultas;

        const [valorArrecadado] = await connection.query(
            `SELECT IFNULL(SUM(cuidador.ganhos),0) AS total_valor FROM cuidador`
        );
        dashboard.valorArrecadado = valorArrecadado[0].total_valor;

        const [usuariosAtendidos] = await connection.query(
            `SELECT COUNT(DISTINCT cliente_id) AS total_usuarios
             FROM contratar
             WHERE MONTH(data_criacao) = MONTH(CURRENT_DATE())
             AND YEAR(data_criacao) = YEAR(CURRENT_DATE())`
        );
        dashboard.usuariosAtendidos = usuariosAtendidos[0].total_usuarios;

        const [avaliacaoMedia] = await connection.query(
            `SELECT IFNULL(AVG(avaliacao),0) AS media_avaliacao FROM cuidador`
        );
        dashboard.avaliacaoMedia = avaliacaoMedia[0].media_avaliacao;

        const [atividadeConsultas] = await connection.query(
            `SELECT DATE(data_criacao) AS dia, COUNT(*) AS total
             FROM contratar
             WHERE data_criacao >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
             GROUP BY DATE(data_criacao)
             ORDER BY dia ASC`
        );
        dashboard.atividadeConsultas = atividadeConsultas;

        const [performanceMensal] = await connection.query(
            `SELECT DATE_FORMAT(data_criacao, '%Y-%m') AS mes,
                    COUNT(*) AS total_consultas,
                    SUM(cuidador.ganhos) AS receita
             FROM contratar
             JOIN cuidador ON contratar.cuidador_id = cuidador.usuario_id
             WHERE data_criacao >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
             GROUP BY mes
             ORDER BY mes ASC`
        );
        dashboard.performanceMensal = performanceMensal;

        const [distribuicaoServico] = await connection.query(
            `SELECT tipos_cuidado, COUNT(*) AS total
             FROM cuidador
             GROUP BY tipos_cuidado`
        );
        dashboard.distribuicaoServico = distribuicaoServico;

        const [historicoPagamento] = await connection.query(
            `SELECT c.id AS contrato_id, cl.usuario_id AS cliente_id, cu.usuario_id AS cuidador_id,
                    c.tipo_contratacao, c.data_inicio, c.data_fim, cu.ganhos AS valor, c.status
             FROM contratar c
             JOIN cliente cl ON c.cliente_id = cl.usuario_id
             JOIN cuidador cu ON c.cuidador_id = cu.usuario_id
             ORDER BY c.data_criacao DESC LIMIT 50`
        );
        dashboard.historicoPagamento = historicoPagamento;

        const [taxaConversao] = await connection.query(
            `SELECT 
                ROUND(
                    100 * (COUNT(DISTINCT cliente_id) / (SELECT COUNT(*) FROM usuario)), 2
                ) AS taxa_conversao
             FROM contratar`
        );
        dashboard.taxaConversao = taxaConversao[0].taxa_conversao;

        const [tempoMedioResposta] = await connection.query(
            `SELECT IFNULL(AVG(TIMESTAMPDIFF(MINUTE, data_envio,
                     (SELECT MIN(m2.data_envio)
                      FROM mensagem m2
                      WHERE m2.remetente_id = m1.destinatario_id
                        AND m2.destinatario_id = m1.remetente_id
                        AND m2.data_envio > m1.data_envio
                     )
                   )),0) AS tempo_medio_minutos
             FROM mensagem m1`
        );
        dashboard.tempoMedioResposta = tempoMedioResposta[0].tempo_medio_minutos;

        const [clientesRecorrentes] = await connection.query(
            `SELECT ROUND(100 * (SUM(c) / COUNT(*)), 2) AS perc_recorrentes
             FROM (
                 SELECT cliente_id, COUNT(*) AS c
                 FROM contratar
                 GROUP BY cliente_id
                 HAVING c > 1
             ) AS sub`
        );
        dashboard.clientesRecorrentes = clientesRecorrentes[0].perc_recorrentes;

        const [receitaPorHora] = await connection.query(
            `SELECT IFNULL(SUM(cu.valor_hora),0) AS total_receita
             FROM contratar ct
             JOIN cuidador cu ON ct.cuidador_id = cu.usuario_id`
        );
        dashboard.receitaPorHora = receitaPorHora[0].total_receita;

        return dashboard;

    } finally {
        connection.release();
    }
}

module.exports = { getDashboardData };

