const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');

/**
 * Rotas para gerenciamento de perfis de usuários
 * Todas as rotas retornam apenas dados públicos, sem informações sensíveis
 */

// Rota de teste
router.get('/', (req, res) => {
  res.json({ ok: true, rota: 'perfil funcionando!' });
});

/**
 * GET /api/perfil/cuidador/:id
 * Buscar perfil público de um cuidador específico
 * Parâmetros: id (ID do usuário cuidador)
 * Retorna: Dados públicos do cuidador
 */
router.get('/cuidador/:id', perfilController.getPerfilCuidador);

/**
 * GET /api/perfil/cliente/:id
 * Buscar perfil público de um cliente específico
 * Parâmetros: id (ID do usuário cliente)
 * Retorna: Dados públicos do cliente
 */
router.get('/cliente/:id', perfilController.getPerfilCliente);

/**
 * GET /api/perfil/buscar?email=xxx&tipo=cuidador
 * Buscar perfil por email e tipo
 * Query params:
 *   - email: Email do usuário
 *   - tipo: "cuidador" ou "cliente"
 * Retorna: Dados públicos do perfil encontrado
 */
router.get('/buscar', perfilController.buscarPerfilPorEmail);

/**
 * GET /api/perfil/cuidadores
 * Listar todos os cuidadores disponíveis
 * Query params (opcionais):
 *   - especialidade: Filtrar por especialidade
 *   - cidade: Filtrar por cidade
 *   - valorMax: Filtrar por valor máximo por hora
 * Retorna: Lista de cuidadores com dados públicos
 */
router.get('/cuidadores', perfilController.listarCuidadores);

/**
 * PUT /api/perfil/foto
 * Atualizar foto de perfil do usuário
 * Body:
 *   - userId: ID do usuário
 *   - fotoUrl: URL da nova foto
 * Retorna: Confirmação da atualização
 * Nota: Em produção, adicionar middleware de autenticação
 */
router.put('/foto', perfilController.atualizarFotoPerfil);

module.exports = router;
