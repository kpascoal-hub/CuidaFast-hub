// ~/www/back-end/services/abacatepay.service.js
const axios = require('axios');
require('dotenv').config({ path: __dirname + '/../config/.env' });

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
    const resp = await api.post('/billing/create', {
      amount: amountCents,
      description,
      methods: ['PIX'],
      customer: { id: usuarioId }
    });
    return resp.data; // { data: {...}, error: null }
  } catch (err) {
    console.error('Erro criarCobranca:', err.response?.data || err.message);
    return { error: err.response?.data || err.message, data: null };
  }
}

async function consultarCobranca(id) {
  try {
    const resp = await api.get(`/billing/get?id=${encodeURIComponent(id)}`);
    return resp.data;
  } catch (err) {
    console.error('Erro consultarCobranca:', err.response?.data || err.message);
    return { error: err.response?.data || err.message, data: null };
  }
}

module.exports = { criarCobranca, consultarCobranca };
