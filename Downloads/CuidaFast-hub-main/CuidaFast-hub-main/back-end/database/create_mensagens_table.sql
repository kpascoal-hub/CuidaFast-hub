-- Tabela de mensagens entre usuários
CREATE TABLE IF NOT EXISTS mensagens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  remetente_id INT NOT NULL,
  destinatario_id INT NOT NULL,
  conteudo TEXT NOT NULL,
  tipo ENUM('texto', 'imagem', 'arquivo', 'localizacao') DEFAULT 'texto',
  lida BOOLEAN DEFAULT FALSE,
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_leitura TIMESTAMP NULL,
  
  FOREIGN KEY (remetente_id) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (destinatario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  
  INDEX idx_remetente (remetente_id),
  INDEX idx_destinatario (destinatario_id),
  INDEX idx_data_envio (data_envio),
  INDEX idx_conversa (remetente_id, destinatario_id, data_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentários
COMMENT ON TABLE mensagens IS 'Armazena mensagens trocadas entre usuários (clientes e cuidadores)';
COMMENT ON COLUMN mensagens.tipo IS 'Tipo de mensagem: texto, imagem, arquivo ou localização';
COMMENT ON COLUMN mensagens.lida IS 'Indica se a mensagem foi lida pelo destinatário';
