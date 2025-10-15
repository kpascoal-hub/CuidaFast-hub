// servicosManager.js - Gerenciador de serviços e estatísticas

/**
 * Estrutura de um serviço:
 * {
 *   id: string,
 *   cuidadorEmail: string,
 *   clienteEmail: string,
 *   clienteNome: string,
 *   tipo: string, // 'idoso', 'crianca', 'pet'
 *   status: string, // 'pendente', 'aceito', 'em_andamento', 'concluido', 'cancelado'
 *   dataContratacao: string (ISO),
 *   dataInicio: string (ISO),
 *   dataConclusao: string (ISO),
 *   valorPago: number,
 *   avaliacao: { nota: number, comentario: string }
 * }
 */

const ServicosManager = {
  /**
   * Criar novo serviço
   */
  criarServico(cuidadorEmail, clienteEmail, clienteNome, tipo) {
    const servico = {
      id: 'srv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      cuidadorEmail: cuidadorEmail,
      clienteEmail: clienteEmail,
      clienteNome: clienteNome,
      tipo: tipo,
      status: 'pendente',
      dataContratacao: new Date().toISOString(),
      dataInicio: null,
      dataConclusao: null,
      valorPago: 0,
      avaliacao: null
    };

    // Salvar no localStorage
    let servicos = this.getServicos();
    servicos.push(servico);
    localStorage.setItem('cuidafast_servicos', JSON.stringify(servicos));

    console.log('[ServicosManager] Serviço criado:', servico);
    return servico;
  },

  /**
   * Aceitar serviço (cuidador aceita a solicitação)
   */
  aceitarServico(servicoId, cuidadorEmail) {
    let servicos = this.getServicos();
    const index = servicos.findIndex(s => s.id === servicoId && s.cuidadorEmail === cuidadorEmail);
    
    if (index === -1) {
      console.error('[ServicosManager] Serviço não encontrado');
      return null;
    }

    servicos[index].status = 'aceito';
    servicos[index].dataInicio = new Date().toISOString();
    localStorage.setItem('cuidafast_servicos', JSON.stringify(servicos));

    // Atualizar estatísticas do cuidador
    this.atualizarEstatisticasCuidador(cuidadorEmail);

    console.log('[ServicosManager] Serviço aceito:', servicos[index]);
    return servicos[index];
  },

  /**
   * Iniciar serviço
   */
  iniciarServico(servicoId, cuidadorEmail) {
    let servicos = this.getServicos();
    const index = servicos.findIndex(s => s.id === servicoId && s.cuidadorEmail === cuidadorEmail);
    
    if (index === -1) return null;

    servicos[index].status = 'em_andamento';
    if (!servicos[index].dataInicio) {
      servicos[index].dataInicio = new Date().toISOString();
    }
    localStorage.setItem('cuidafast_servicos', JSON.stringify(servicos));

    this.atualizarEstatisticasCuidador(cuidadorEmail);
    return servicos[index];
  },

  /**
   * Concluir serviço
   */
  concluirServico(servicoId, cuidadorEmail, valorPago = 0) {
    let servicos = this.getServicos();
    const index = servicos.findIndex(s => s.id === servicoId && s.cuidadorEmail === cuidadorEmail);
    
    if (index === -1) return null;

    servicos[index].status = 'concluido';
    servicos[index].dataConclusao = new Date().toISOString();
    servicos[index].valorPago = valorPago;
    localStorage.setItem('cuidafast_servicos', JSON.stringify(servicos));

    // Atualizar estatísticas do cuidador
    this.atualizarEstatisticasCuidador(cuidadorEmail);

    console.log('[ServicosManager] Serviço concluído:', servicos[index]);
    return servicos[index];
  },

  /**
   * Cancelar serviço
   */
  cancelarServico(servicoId, email) {
    let servicos = this.getServicos();
    const index = servicos.findIndex(s => 
      s.id === servicoId && (s.cuidadorEmail === email || s.clienteEmail === email)
    );
    
    if (index === -1) return null;

    servicos[index].status = 'cancelado';
    localStorage.setItem('cuidafast_servicos', JSON.stringify(servicos));

    if (servicos[index].cuidadorEmail === email) {
      this.atualizarEstatisticasCuidador(email);
    }

    return servicos[index];
  },

  /**
   * Adicionar avaliação ao serviço
   */
  avaliarServico(servicoId, nota, comentario = '') {
    let servicos = this.getServicos();
    const index = servicos.findIndex(s => s.id === servicoId);
    
    if (index === -1) return null;

    servicos[index].avaliacao = {
      nota: nota,
      comentario: comentario,
      data: new Date().toISOString()
    };
    localStorage.setItem('cuidafast_servicos', JSON.stringify(servicos));

    // Atualizar média de avaliações do cuidador
    this.atualizarEstatisticasCuidador(servicos[index].cuidadorEmail);

    return servicos[index];
  },

  /**
   * Obter todos os serviços
   */
  getServicos() {
    const servicos = localStorage.getItem('cuidafast_servicos');
    return servicos ? JSON.parse(servicos) : [];
  },

  /**
   * Obter serviços de um cuidador
   */
  getServicosCuidador(cuidadorEmail) {
    const servicos = this.getServicos();
    return servicos.filter(s => s.cuidadorEmail === cuidadorEmail);
  },

  /**
   * Obter serviços de um cliente
   */
  getServicosCliente(clienteEmail) {
    const servicos = this.getServicos();
    return servicos.filter(s => s.clienteEmail === clienteEmail);
  },

  /**
   * Atualizar estatísticas do cuidador
   */
  atualizarEstatisticasCuidador(cuidadorEmail) {
    const servicos = this.getServicosCuidador(cuidadorEmail);
    
    const stats = {
      totalServicos: servicos.length,
      servicosPendentes: servicos.filter(s => s.status === 'pendente').length,
      servicosAceitos: servicos.filter(s => s.status === 'aceito').length,
      servicosEmAndamento: servicos.filter(s => s.status === 'em_andamento').length,
      servicosConcluidos: servicos.filter(s => s.status === 'concluido').length,
      servicosCancelados: servicos.filter(s => s.status === 'cancelado').length,
      
      // Receita total
      receitaTotal: servicos
        .filter(s => s.status === 'concluido')
        .reduce((sum, s) => sum + (s.valorPago || 0), 0),
      
      // Média de avaliações
      mediaAvaliacoes: this.calcularMediaAvaliacoes(servicos),
      totalAvaliacoes: servicos.filter(s => s.avaliacao).length,
      
      // Última atualização
      ultimaAtualizacao: new Date().toISOString()
    };

    // Atualizar no usuário
    const userData = JSON.parse(localStorage.getItem('cuidafast_user') || '{}');
    if (userData.email === cuidadorEmail) {
      userData.estatisticas = stats;
      localStorage.setItem('cuidafast_user', JSON.stringify(userData));
    }

    // Atualizar na lista de usuários
    let usuarios = JSON.parse(localStorage.getItem('cuidafast_usuarios') || '[]');
    const userIndex = usuarios.findIndex(u => u.email === cuidadorEmail);
    if (userIndex !== -1) {
      usuarios[userIndex].estatisticas = stats;
      localStorage.setItem('cuidafast_usuarios', JSON.stringify(usuarios));
    }

    console.log('[ServicosManager] Estatísticas atualizadas para', cuidadorEmail, stats);
    return stats;
  },

  /**
   * Calcular média de avaliações
   */
  calcularMediaAvaliacoes(servicos) {
    const avaliacoes = servicos.filter(s => s.avaliacao && s.avaliacao.nota);
    if (avaliacoes.length === 0) return 0;
    
    const soma = avaliacoes.reduce((sum, s) => sum + s.avaliacao.nota, 0);
    return (soma / avaliacoes.length).toFixed(1);
  },

  /**
   * Obter estatísticas do cuidador
   */
  getEstatisticasCuidador(cuidadorEmail) {
    const userData = JSON.parse(localStorage.getItem('cuidafast_user') || '{}');
    
    if (userData.email === cuidadorEmail && userData.estatisticas) {
      return userData.estatisticas;
    }

    // Se não existir, calcular agora
    return this.atualizarEstatisticasCuidador(cuidadorEmail);
  },

  /**
   * Inicializar estatísticas zeradas para novo cuidador
   */
  inicializarEstatisticas(cuidadorEmail) {
    const stats = {
      totalServicos: 0,
      servicosPendentes: 0,
      servicosAceitos: 0,
      servicosEmAndamento: 0,
      servicosConcluidos: 0,
      servicosCancelados: 0,
      receitaTotal: 0,
      mediaAvaliacoes: 0,
      totalAvaliacoes: 0,
      ultimaAtualizacao: new Date().toISOString()
    };

    const userData = JSON.parse(localStorage.getItem('cuidafast_user') || '{}');
    if (userData.email === cuidadorEmail) {
      userData.estatisticas = stats;
      localStorage.setItem('cuidafast_user', JSON.stringify(userData));
    }

    return stats;
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.ServicosManager = ServicosManager;
}
