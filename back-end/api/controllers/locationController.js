const Usuario = require('../models/UsuarioModel');
const Cliente = require('../models/ClienteModel');
const Cuidador = require('../models/CuidadorModel');
const Vinculo = require('../models/VinculoModel');
const { geocodeAddress } = require('../services/geocodeService');
const { firestore } = require('../services/firebaseAdmin');

function nowTimestamp() {
  return new Date();
}

async function getCliente(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await Usuario.getById(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario não encontrado' });

    const cliente = await Cliente.getById(id);
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    const enderecoTexto = typeof cliente.endereco === 'string' ? cliente.endereco : JSON.stringify(cliente.endereco || {});

    let coords = null;
    try {
      coords = await geocodeAddress(enderecoTexto);
    } catch {}

    if (usuario.firebase_uid && coords) {
      const docRef = firestore.collection('localizacoes').collection('clientes').doc(usuario.firebase_uid);
      await docRef.set({ lat: coords.lat, lng: coords.lng, atualizadoEm: nowTimestamp() }, { merge: true });
    }

    res.json({
      usuario_id: id,
      nome: usuario.nome,
      email: usuario.email,
      endereco: enderecoTexto,
      firebase_uid: usuario.firebase_uid || null,
      coordinates: coords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter cliente' });
  }
}

async function getCuidador(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await Usuario.getById(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario não encontrado' });

    const cuidador = await Cuidador.getById(id);
    if (!cuidador) return res.status(404).json({ error: 'Cuidador não encontrado' });

    res.json({
      usuario_id: id,
      nome: usuario.nome,
      email: usuario.email,
      local_trabalho: cuidador.local_trabalho || null,
      firebase_uid: usuario.firebase_uid || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter cuidador' });
  }
}

async function postLocalizacaoCuidador(req, res) {
  try {
    const { usuario_id, firebase_uid, lat, lng } = req.body || {};
    if ((lat == null) || (lng == null)) return res.status(400).json({ error: 'lat e lng são obrigatórios' });

    let uid = firebase_uid;
    if (!uid) {
      if (!usuario_id) return res.status(400).json({ error: 'usuario_id ou firebase_uid é obrigatório' });
      const usuario = await Usuario.getById(usuario_id);
      if (!usuario || !usuario.firebase_uid) return res.status(404).json({ error: 'firebase_uid não encontrado para usuario' });
      uid = usuario.firebase_uid;
    }

    const docRef = firestore.collection('localizacoes').collection('cuidadores').doc(uid);
    await docRef.set({ lat: Number(lat), lng: Number(lng), atualizadoEm: nowTimestamp() }, { merge: true });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar localização do cuidador' });
  }
}

async function getLocalizacaoCliente(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await Usuario.getById(id);
    const cliente = await Cliente.getById(id);
    if (!usuario || !cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    const enderecoTexto = typeof cliente.endereco === 'string' ? cliente.endereco : JSON.stringify(cliente.endereco || {});
    const coords = await geocodeAddress(enderecoTexto);

    res.json({ usuario_id: id, firebase_uid: usuario.firebase_uid || null, coordinates: coords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter localização do cliente' });
  }
}

async function getVinculoByCliente(req, res) {
  try {
    const clienteId = parseInt(req.params.id, 10);
    const cuidadorId = await Vinculo.getCuidadorIdByClienteId(clienteId);
    if (!cuidadorId) return res.status(404).json({ error: 'Vínculo não encontrado' });

    const cuidadorUser = await Usuario.getById(cuidadorId);
    res.json({ cliente_id: clienteId, cuidador_id: cuidadorId, cuidador_firebase_uid: cuidadorUser ? cuidadorUser.firebase_uid : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter vínculo' });
  }
}

async function getVinculoByCuidador(req, res) {
  try {
    const cuidadorId = parseInt(req.params.id, 10);
    const clienteId = await Vinculo.getClienteIdByCuidadorId(cuidadorId);
    if (!clienteId) return res.status(404).json({ error: 'Vínculo não encontrado' });

    const clienteUser = await Usuario.getById(clienteId);
    const cliente = await Cliente.getById(clienteId);

    let coords = null;
    if (cliente && cliente.endereco) {
      const enderecoTexto = typeof cliente.endereco === 'string' ? cliente.endereco : JSON.stringify(cliente.endereco || {});
      coords = await geocodeAddress(enderecoTexto);
    }

    res.json({ cuidador_id: cuidadorId, cliente_id: clienteId, cliente_firebase_uid: clienteUser ? clienteUser.firebase_uid : null, coordinates: coords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter vínculo' });
  }
}

module.exports = {
  getCliente,
  getCuidador,
  postLocalizacaoCuidador,
  getLocalizacaoCliente,
  getVinculoByCliente,
  getVinculoByCuidador,
};
