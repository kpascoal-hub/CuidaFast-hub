// ~/www/back-end/services/abacatepay.service.js
const axios = require('axios');

const api = axios.create({
  baseURL: process.env.ABACATEPAY_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

async function criarCobranca(amountCents, description, usuarioId) {
  try {
    // Ajuste o payload conforme necessário pela AbacatePay; aqui usamos o padrão da doc enviada
    const response = await api.post('/billing/create', {
      amount: amountCents,
      description,
      methods: ['PIX'],
      customer: {
        id: usuarioId
      }
    });

    // response.data = { data: {...}, error: null }
    return response.data;
  } catch (err) {
    console.error('Erro AbacatePay criarCobranca:', err?.response?.data || err.message);
    // normalize
    return { error: err?.response?.data || err.message, data: null };
  }
}

async function consultarCobranca(idPagamento) {
  try {
    const response = await api.get(`/billing/get?id=${encodeURIComponent(idPagamento)}`);
    return response.data;
  } catch (err) {
    console.error('Erro AbacatePay consultarCobranca:', err?.response?.data || err.message);
    return { error: err?.response?.data || err.message, data: null };
  }
}

module.exports = { criarCobranca, consultarCobranca };

