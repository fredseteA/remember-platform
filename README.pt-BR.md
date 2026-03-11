# 🕊️ Plataforma de Memoriais Digitais

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow.svg)]()
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)]()

> Uma plataforma web completa para criação, gestão e publicação de memoriais digitais personalizados, conectando memórias físicas e digitais através de tecnologia QR Code.

[English Version](README.md) | **Português**

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Planos de Publicação](#-planos-de-publicação)
- [Programa de Apoiadores](#-programa-de-apoiadores)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API](#-api)
- [Política de Cancelamento](#-política-de-cancelamento)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 🌟 Sobre o Projeto

A **Plataforma de Memoriais Digitais** é uma solução inovadora que permite a criação e preservação de memórias através de memoriais digitais personalizados. Combinando tecnologia web moderna com produtos físicos, a plataforma oferece uma experiência completa para homenagear e lembrar entes queridos.

### ✨ Diferenciais

- 🆓 **Criação Gratuita**: Crie memoriais sem custo inicial
- 🔗 **Link Permanente**: URLs exclusivas e permanentes para cada memorial
- 📱 **QR Code Personalizado**: Acesso rápido através de código QR único
- 🏛️ **Placa Física**: Opção de placa em aço inoxidável para locais físicos
- 📧 **Acompanhamento Completo**: Notificações por e-mail em cada etapa
- 🤝 **Programa de Parcerias**: Sistema de apoiadores para funerárias e cemitérios

---

## 🚀 Funcionalidades

### Para Usuários

- ✅ **Criação de Memoriais**
  - Interface intuitiva para criação de memoriais
  - Sistema de rascunhos (draft) para edição antes da publicação
  - Personalização completa do conteúdo
  - Upload de fotos e vídeos
  - Linha do tempo da vida
  
- ✅ **Gestão de Memoriais**
  - Visualização prévia antes da publicação
  - Edição de memoriais em rascunho
  - Controle de privacidade
  
- ✅ **Notificações por E-mail**
  - Memorial criado
  - Pedido confirmado
  - Pedido em produção
  - Produto finalizado
  - Pedido despachado (com rastreamento)
  - Pedido entregue

### Para Administradores

- 🎛️ **Painel Administrativo Completo**
  - Gerenciamento de memoriais
  - Controle de pedidos e status
  - Acompanhamento de produção
  - Gestão de envios e logística
  - Administração de usuários
  - Controle de planos e pagamentos
  - Relatórios e analytics
  - Gestão do programa de apoiadores

### Para Apoiadores (Parceiros)

- 🤝 **Sistema de Parcerias**
  - Código exclusivo de apoio
  - Painel de acompanhamento de vendas
  - Gestão de comissões
  - Relatórios de performance

---

## 💎 Planos de Publicação

### 📱 Plano Digital

**Benefícios:**
- Publicação oficial do memorial na plataforma
- Link exclusivo e permanente
- QR Code personalizado
- Acesso ilimitado ao memorial
- Atualizações e edições posteriores

**Ideal para:**
- Memoriais exclusivamente digitais
- Compartilhamento em redes sociais
- Famílias distribuídas geograficamente

---

### 🏛️ Plano Físico

**Todos os benefícios do Plano Digital +**
- Placa física em aço inoxidável de alta qualidade
- QR Code gravado permanentemente
- Fixação em local escolhido (túmulo, memorial, jazigo, etc.)
- Material resistente às intempéries
- Design elegante e discreto

**Ideal para:**
- Túmulos e jazigos
- Memoriais físicos
- Cemitérios e jardins memoriais
- Locais de homenagem permanentes

---

## 🤝 Programa de Apoiadores

Sistema de parceria estratégica voltado para **funerárias, cemitérios e prestadores de serviços funerários**.

### Como Funciona

1. **Cadastro como Apoiador**
   - Registro na plataforma como parceiro
   - Recebimento de código exclusivo de apoio

2. **Benefícios para Clientes**
   - Cliente utiliza o código do apoiador
   - Recebe **5% de desconto** na compra

3. **Sistema de Comissões Escalonado**

| Volume Mensal | Comissão |
|---------------|----------|
| Padrão inicial | 10% |
| Alto volume | 15% |
| Volume premium | 20% |

### Vantagens do Programa

**Para Apoiadores:**
- 💰 Fonte adicional de receita
- 🎯 Agregação de valor aos serviços oferecidos
- 📊 Painel de controle e relatórios
- 🏆 Comissões progressivas

**Para a Plataforma:**
- 🌐 Ampliação do alcance
- 🤝 Parcerias estratégicas
- 📈 Crescimento sustentável
- 🎓 Ecossistema colaborativo

---

## 🛠️ Tecnologias

### Frontend

```
- React.js / Next.js
- TypeScript
- Tailwind CSS
- React Query
- Zustand (State Management)
- React Hook Form
- Zod (Validação)
```

### Backend

```
- Node.js
- Express.js / Nest.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis (Cache)
- JWT (Autenticação)
```

### Infraestrutura

```
- Docker
- AWS S3 (Armazenamento de mídia)
- AWS SES (E-mails)
- AWS CloudFront (CDN)
- GitHub Actions (CI/CD)
```

### Serviços Externos

```
- Stripe / MercadoPago (Pagamentos)
- Correios API (Rastreamento)
- QR Code Generator
- Sistema de envio de e-mails
```

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Público   │  │   Usuário    │  │     Admin     │  │
│  │  (Landing)  │  │  (Dashboard) │  │    (Panel)    │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    API REST / GraphQL                    │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Business Logic     │    │   Authentication     │
│   - Memoriais        │    │   - JWT              │
│   - Pedidos          │    │   - OAuth            │
│   - Apoiadores       │    │   - Permissions      │
└──────────────────────┘    └──────────────────────┘
                │
    ┌───────────┼───────────┬───────────┐
    ▼           ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
│PostgreSQL Redis  │ │   AWS   │ │ Payment  │
│  (DB)  │ (Cache)│ │   S3    │ │ Gateway  │
└────────┘ └────────┘ └─────────┘ └──────────┘
```

---

## 💻 Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 6.0
- Docker (opcional)
- Yarn ou npm

### Clone o Repositório

```bash
git clone https://github.com/seu-usuario/plataforma-memoriais.git
cd plataforma-memoriais
```

### Instalação com Docker (Recomendado)

```bash
# Construir e iniciar os containers
docker-compose up -d

# Executar migrations
docker-compose exec api npm run migrate

# Seed do banco de dados
docker-compose exec api npm run seed
```

### Instalação Manual

#### Backend

```bash
cd backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
npm run migrate

# Iniciar o servidor
npm run dev
```

#### Frontend

```bash
cd frontend
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar o servidor de desenvolvimento
npm run dev
```

---

## ⚙️ Configuração

### Variáveis de Ambiente - Backend

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/memoriais"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# AWS
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="memoriais-bucket"
AWS_REGION="us-east-1"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-password"

# Payment
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
APP_URL="http://localhost:3000"
API_URL="http://localhost:4000"
```

### Variáveis de Ambiente - Frontend

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
```

---

## 🎯 Uso

### Para Usuários

1. **Criar um Memorial**
   ```
   - Acesse a plataforma
   - Clique em "Criar Memorial"
   - Preencha as informações
   - Adicione fotos e vídeos
   - Salve como rascunho
   ```

2. **Publicar Memorial**
   ```
   - Revise o memorial no modo de visualização
   - Escolha um plano (Digital ou Físico)
   - Realize o pagamento
   - Receba o link permanente e QR Code
   ```

3. **Acompanhar Pedido**
   ```
   - Verifique o e-mail para atualizações
   - Acesse "Meus Pedidos" no painel
   - Utilize o código de rastreamento (plano físico)
   ```

### Para Administradores

1. **Acessar Painel Admin**
   ```
   https://seusite.com/admin
   ```

2. **Gerenciar Pedidos**
   ```
   - Visualizar pedidos pendentes
   - Atualizar status de produção
   - Gerar etiquetas de envio
   - Registrar rastreamento
   ```

3. **Gerenciar Apoiadores**
   ```
   - Aprovar novos apoiadores
   - Visualizar performance
   - Configurar níveis de comissão
   ```

---

## 📡 API

### Endpoints Principais

#### Autenticação

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

#### Memoriais

```http
GET    /api/memorials
POST   /api/memorials
GET    /api/memorials/:id
PUT    /api/memorials/:id
DELETE /api/memorials/:id
POST   /api/memorials/:id/publish
```

#### Pedidos

```http
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status
GET    /api/orders/:id/tracking
```

#### Apoiadores

```http
GET    /api/supporters
POST   /api/supporters/register
GET    /api/supporters/:code/stats
POST   /api/supporters/:code/validate
```

### Exemplo de Requisição

```javascript
// Criar um memorial
const response = await fetch('/api/memorials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'João Silva',
    birthDate: '1950-01-15',
    deathDate: '2024-03-10',
    biography: 'Uma vida dedicada à família...',
    photos: ['url1', 'url2']
  })
});
```

---

## 🔒 Política de Cancelamento

### Direito de Arrependimento

Conforme previsto no Código de Defesa do Consumidor (Lei nº 8.078/90):

- ✅ O usuário tem **7 dias corridos** para cancelar a compra
- ✅ Contados a partir da data de confirmação do pedido
- ✅ Reembolso integral do valor pago
- ❌ **Exceção**: Produtos físicos já entregues não podem ser cancelados

### Como Solicitar Cancelamento

1. Acesse "Meus Pedidos" no painel do usuário
2. Selecione o pedido desejado
3. Clique em "Solicitar Cancelamento"
4. Confirme a solicitação
5. Aguarde a confirmação por e-mail (até 48h)

### Processamento do Reembolso

- 💳 Cartão de crédito: 5-10 dias úteis
- 🏦 Outros métodos: conforme política do gateway de pagamento

---

## 🗺️ Roadmap

### Fase 1 - MVP ✅
- [x] Sistema de criação de memoriais
- [x] Sistema de usuários e autenticação
- [x] Planos de publicação
- [x] Integração com pagamento
- [x] Painel administrativo básico

### Fase 2 - Em Desenvolvimento 🚧
- [ ] Programa de apoiadores completo
- [ ] Sistema de notificações por e-mail
- [ ] Integração com Correios
- [ ] QR Code generator e personalização
- [ ] Sistema de produção de placas

### Fase 3 - Planejado 📋
- [ ] App mobile (iOS/Android)
- [ ] Sistema de comentários e homenagens
- [ ] Integração com redes sociais
- [ ] Galeria de fotos expandida
- [ ] Timeline interativa
- [ ] Sistema de doações e flores virtuais

### Fase 4 - Futuro 🔮
- [ ] IA para geração de biografias
- [ ] Realidade aumentada nos memoriais
- [ ] Blockchain para certificação de autenticidade
- [ ] Marketplace de serviços relacionados
- [ ] API pública para integrações

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Este projeto segue as melhores práticas de código aberto.

### Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```
3. **Commit suas mudanças**
   ```bash
   git commit -m 'Adiciona nova feature X'
   ```
4. **Push para a branch**
   ```bash
   git push origin feature/MinhaNovaFeature
   ```
5. **Abra um Pull Request**

### Diretrizes

- Siga o guia de estilo do projeto
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário
- Mantenha commits pequenos e descritivos
- Use [Conventional Commits](https://www.conventionalcommits.org/)

### Código de Conduta

Este projeto adota o [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em seguir seus termos.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2024 Plataforma de Memoriais Digitais

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Contato

### Equipe do Projeto

- **Website**: [https://seusite.com](https://seusite.com)
- **Email**: contato@seusite.com
- **Suporte**: suporte@seusite.com

### Links Úteis

- 📚 [Documentação](https://docs.seusite.com)
- 🐛 [Reportar Bug](https://github.com/seu-usuario/plataforma-memoriais/issues)
- 💡 [Solicitar Feature](https://github.com/seu-usuario/plataforma-memoriais/issues)
- 💬 [Discussões](https://github.com/seu-usuario/plataforma-memoriais/discussions)

### Redes Sociais

- [LinkedIn](https://linkedin.com/company/seusite)
- [Instagram](https://instagram.com/seusite)
- [Facebook](https://facebook.com/seusite)

---

## 🙏 Agradecimentos

Agradecemos a todos que contribuíram para este projeto:

- Famílias que confiaram na plataforma para preservar memórias
- Funerárias e cemitérios parceiros
- Desenvolvedores e colaboradores open-source
- Comunidade de feedback e testes

---

## 📊 Status do Projeto

![GitHub stars](https://img.shields.io/github/stars/seu-usuario/plataforma-memoriais?style=social)
![GitHub forks](https://img.shields.io/github/forks/seu-usuario/plataforma-memoriais?style=social)
![GitHub issues](https://img.shields.io/github/issues/seu-usuario/plataforma-memoriais)
![GitHub pull requests](https://img.shields.io/github/issues-pr/seu-usuario/plataforma-memoriais)

---

<div align="center">

**Feito com ❤️ para preservar memórias**

[⬆ Voltar ao topo](#-plataforma-de-memoriais-digitais)

</div>
