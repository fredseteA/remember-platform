import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Package,
  Truck,
  CheckCircle,
  Play,
  Send,
  ExternalLink,
  MapPin,
  XCircle,
  Home
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PRODUCTION_STATUS = {
  approved:      { label: 'Aguardando Produção', color: 'yellow',  step: 1 },
  paid:          { label: 'Aguardando Produção', color: 'yellow',  step: 1 },
  in_production: { label: 'Em Produção',         color: 'purple',  step: 2 },
  produced:      { label: 'Produzido',           color: 'blue',    step: 3 },
  shipped:       { label: 'Enviado',             color: 'green',   step: 4 },
  entregue:      { label: 'Entregue',            color: 'emerald', step: 5 },
  cancelled:     { label: 'Cancelado',           color: 'red',     step: 0 },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

// ─── Modal de confirmação de cancelamento ────────────────────────────────────
const CancelModal = ({ orderId, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="bg-[#16202e] border border-red-500/30 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <XCircle className="text-red-400" size={24} />
        <h3 className="text-lg font-semibold text-white">Cancelar Pedido</h3>
      </div>
      <p className="text-[#94a3b8] text-sm mb-6">
        Tem certeza que deseja cancelar este pedido? Um email será enviado ao cliente
        informando o cancelamento e o reembolso em até 7 dias úteis.
        <br /><br />
        <span className="text-red-400 font-medium">Esta ação não pode ser desfeita.</span>
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 bg-[#2d3a52] text-[#94a3b8] rounded-lg text-sm font-medium hover:bg-[#3d4a62] transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={() => { onConfirm(orderId, 'cancel'); onClose(); }}
          className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Confirmar Cancelamento
        </button>
      </div>
    </div>
  </div>
);

// ─── Card de pedido ───────────────────────────────────────────────────────────
const ProductionCard = ({ order, onAction }) => {
  const [trackingCode, setTrackingCode]           = useState(order.tracking_code || '');
  const [showTrackingInput, setShowTrackingInput] = useState(false);
  const [showCancelModal, setShowCancelModal]     = useState(false);

  const statusConfig = PRODUCTION_STATUS[order.status] || PRODUCTION_STATUS.approved;
  const isCancelled  = order.status === 'cancelled';
  const isDelivered  = order.status === 'entregue';

  return (
    <>
      {showCancelModal && (
        <CancelModal
          orderId={order.id}
          onConfirm={onAction}
          onClose={() => setShowCancelModal(false)}
        />
      )}

      <div
        className={`bg-[#16202e] border rounded-xl p-5 transition-all ${
          isCancelled
            ? 'border-red-500/30 opacity-70'
            : 'border-[#2d3a52] hover:border-[#3b82f6]/30'
        }`}
        data-testid={`production-card-${order.id}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-[#94a3b8] mb-1">Pedido #{order.id?.substring(0, 8)}</p>
            <h3 className="text-lg font-semibold text-white">{order.person_name || 'Memorial'}</h3>
            <p className="text-sm text-[#94a3b8] mt-1">{order.user_email}</p>
          </div>
          <span className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
            bg-${statusConfig.color}-500/10 text-${statusConfig.color}-500 border border-${statusConfig.color}-500/20
          `}>
            {statusConfig.label}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#2d3a52]">
          <div>
            <p className="text-xs text-[#94a3b8] uppercase tracking-wide">Tipo</p>
            <p className="text-sm text-white font-medium mt-1">
              {order.plan_type === 'plaque' || order.plan_type === 'qrcode_plaque'
                ? 'Placa QR Code'
                : order.plan_type === 'complete'
                ? 'Plano Completo'
                : order.plan_type}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#94a3b8] uppercase tracking-wide">Valor</p>
            <p className="text-sm text-white font-medium mt-1">{formatCurrency(order.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-[#94a3b8] uppercase tracking-wide">Data do Pedido</p>
            <p className="text-sm text-white font-medium mt-1">{formatDate(order.created_at)}</p>
          </div>
          {order.memorial_slug && (
            <div>
              <p className="text-xs text-[#94a3b8] uppercase tracking-wide">Memorial</p>
              <a
                href={`/memorial/${order.memorial_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#3b82f6] font-medium mt-1 inline-flex items-center gap-1 hover:underline"
              >
                Ver <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        {!isCancelled && (
          <div className="flex items-center justify-between mb-4 px-1">
            {[
              { step: 1, label: 'Aguardando' },
              { step: 2, label: 'Produzindo' },
              { step: 3, label: 'Produzido'  },
              { step: 4, label: 'Enviado'    },
              { step: 5, label: 'Entregue'   },
            ].map((item, idx) => (
              <div key={item.step} className="flex items-center">
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
                  ${statusConfig.step >= item.step
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-[#2d3a52] text-[#94a3b8]'}
                `}>
                  {statusConfig.step > item.step ? <CheckCircle size={14} /> : item.step}
                </div>
                {idx < 4 && (
                  <div className={`w-7 h-0.5 ${statusConfig.step > item.step ? 'bg-[#3b82f6]' : 'bg-[#2d3a52]'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">

          {/* Iniciar Produção */}
          {(order.status === 'approved' || order.status === 'paid') && (
            <button
              onClick={() => onAction(order.id, 'start')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg font-medium text-sm hover:bg-purple-500/20 transition-colors"
              data-testid={`start-production-${order.id}`}
            >
              <Play size={16} />
              Iniciar Produção
            </button>
          )}

          {/* Marcar Produzido */}
          {order.status === 'in_production' && (
            <button
              onClick={() => onAction(order.id, 'complete')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg font-medium text-sm hover:bg-blue-500/20 transition-colors"
              data-testid={`complete-production-${order.id}`}
            >
              <Package size={16} />
              Marcar Produzido
            </button>
          )}

          {/* Opções de Envio */}
          {order.status === 'produced' && (
            <>
              {!showTrackingInput ? (
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={() => setShowTrackingInput(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg font-medium text-sm hover:bg-green-500/20 transition-colors"
                    data-testid={`ship-correios-${order.id}`}
                  >
                    <Truck size={16} />
                    Correios
                  </button>
                  <button
                    onClick={() => onAction(order.id, 'ship_local')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg font-medium text-sm hover:bg-orange-500/20 transition-colors"
                    data-testid={`ship-local-${order.id}`}
                  >
                    <MapPin size={16} />
                    Entrega Local
                  </button>
                </div>
              ) : (
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-[#94a3b8]">Código de rastreio (Correios):</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder="Ex: AA123456789BR"
                      className="flex-1 px-3 py-2 bg-[#0b121b] border border-[#2d3a52] rounded-lg text-white text-sm placeholder:text-[#94a3b8]/50 focus:border-[#3b82f6] outline-none"
                      data-testid={`tracking-input-${order.id}`}
                    />
                    <button
                      onClick={() => {
                        if (trackingCode.trim()) {
                          onAction(order.id, 'ship_correios', trackingCode);
                          setShowTrackingInput(false);
                        }
                      }}
                      disabled={!trackingCode.trim()}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid={`confirm-ship-${order.id}`}
                    >
                      <Send size={16} />
                    </button>
                    <button
                      onClick={() => setShowTrackingInput(false)}
                      className="px-3 py-2 bg-[#2d3a52] text-[#94a3b8] rounded-lg text-sm hover:bg-[#3d4a62] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Marcar como Entregue */}
          {order.status === 'shipped' && (
            <button
              onClick={() => onAction(order.id, 'deliver')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-medium text-sm hover:bg-emerald-500/20 transition-colors"
              data-testid={`deliver-${order.id}`}
            >
              <Home size={16} />
              Marcar como Entregue
            </button>
          )}

          {/* Info do envio */}
          {(order.status === 'shipped' || order.status === 'entregue') && (
            <div className="w-full bg-[#0b121b] rounded-lg px-4 py-2.5 text-center">
              {order.delivery_type === 'local' ? (
                <>
                  <p className="text-xs text-[#94a3b8]">Tipo de Entrega</p>
                  <p className="text-sm font-medium text-orange-400 mt-1">🛵 Entrega Local</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-[#94a3b8]">Código de Rastreio</p>
                  <p className="text-sm font-mono text-white mt-1">{order.tracking_code}</p>
                </>
              )}
            </div>
          )}

          {/* Cancelar */}
          {!isCancelled && !isDelivered && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/20 text-red-400 rounded-lg font-medium text-xs hover:bg-red-500/10 transition-colors mt-1"
              data-testid={`cancel-${order.id}`}
            >
              <XCircle size={14} />
              Cancelar Pedido
            </button>
          )}

        </div>
      </div>
    </>
  );
};

// ─── Seção auxiliar ───────────────────────────────────────────────────────────
const Section = ({ title, color, count, children }) => (
  <div>
    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      {title} ({count})
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

// ─── Página principal ─────────────────────────────────────────────────────────
const AdminProduction = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue]     = useState([]);

  useEffect(() => { fetchQueue(); }, [token]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/production-queue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
      toast.error('Erro ao carregar fila de produção');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId, action, trackingCode = null) => {
    try {
      let endpoint = '';
      let data     = {};

      switch (action) {
        case 'start':
          endpoint = `${API}/admin/production/${orderId}/start`;
          break;
        case 'complete':
          endpoint = `${API}/admin/production/${orderId}/complete`;
          break;
        case 'ship_correios':
          endpoint = `${API}/admin/orders/${orderId}/tracking`;
          data = { tracking_code: trackingCode, delivery_type: 'correios' };
          break;
        case 'ship_local':
          endpoint = `${API}/admin/orders/${orderId}/tracking`;
          data = { tracking_code: 'ENTREGA_LOCAL', delivery_type: 'local' };
          break;
        case 'deliver':
          endpoint = `${API}/admin/orders/${orderId}/status`;
          data = { status: 'entregue' };
          break;
        case 'cancel':
          endpoint = `${API}/admin/orders/${orderId}/cancel`;
          break;
        default:
          return;
      }

      await axios.put(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setQueue(prev => prev.map(order => {
        if (order.id !== orderId) return order;
        const statusMap = {
          start:         'in_production',
          complete:      'produced',
          ship_correios: 'shipped',
          ship_local:    'shipped',
          deliver:       'entregue',
          cancel:        'cancelled',
        };
        return {
          ...order,
          status: statusMap[action] || order.status,
          tracking_code: trackingCode || order.tracking_code,
          delivery_type:
            action === 'ship_local'    ? 'local'    :
            action === 'ship_correios' ? 'correios' :
            order.delivery_type,
        };
      }));

      const messages = {
        start:         '✅ Produção iniciada! Email enviado ao cliente.',
        complete:      '✅ Produção concluída! Email enviado ao cliente.',
        ship_correios: '✅ Pedido enviado! Email com rastreio enviado ao cliente.',
        ship_local:    '✅ Entrega local confirmada! Email enviado ao cliente.',
        deliver:       '✅ Pedido marcado como entregue!',
        cancel:        '✅ Pedido cancelado. Email enviado ao cliente.',
      };
      toast.success(messages[action] || 'Ação realizada com sucesso!');

    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Erro ao realizar ação');
    }
  };

  const statusGroups = {
    waiting:   queue.filter(o => o.status === 'approved' || o.status === 'paid'),
    producing: queue.filter(o => o.status === 'in_production'),
    produced:  queue.filter(o => o.status === 'produced'),
    shipped:   queue.filter(o => o.status === 'shipped'),
    delivered: queue.filter(o => o.status === 'entregue'),
    cancelled: queue.filter(o => o.status === 'cancelled'),
  };

  if (loading) {
    return (
      <div className="space-y-6" data-testid="production-loading">
        <div className="h-10 w-48 bg-[#16202e] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-[#16202e] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-production">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#3b82f6] mb-1">Gestão</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fila de Produção</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {[
            { color: 'bg-yellow-500',  label: `${statusGroups.waiting.length} aguardando`  },
            { color: 'bg-purple-500',  label: `${statusGroups.producing.length} produzindo` },
            { color: 'bg-blue-500',    label: `${statusGroups.produced.length} produzidos`  },
            { color: 'bg-green-500',   label: `${statusGroups.shipped.length} enviados`     },
            { color: 'bg-emerald-500', label: `${statusGroups.delivered.length} entregues`  },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-[#94a3b8]">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {queue.filter(o => o.status !== 'cancelled').length === 0 ? (
        <div className="bg-[#16202e] border border-[#2d3a52] rounded-xl p-12 text-center">
          <Package className="mx-auto mb-4 text-[#94a3b8]" size={48} />
          <h3 className="text-lg font-semibold text-white mb-2">Fila vazia</h3>
          <p className="text-[#94a3b8]">Não há pedidos de placas aguardando produção.</p>
        </div>
      ) : (
        <div className="space-y-8">

          {statusGroups.waiting.length > 0 && (
            <Section title="Aguardando Produção" color="bg-yellow-500" count={statusGroups.waiting.length}>
              {statusGroups.waiting.map(o => <ProductionCard key={o.id} order={o} onAction={handleAction} />)}
            </Section>
          )}

          {statusGroups.producing.length > 0 && (
            <Section title="Em Produção" color="bg-purple-500" count={statusGroups.producing.length}>
              {statusGroups.producing.map(o => <ProductionCard key={o.id} order={o} onAction={handleAction} />)}
            </Section>
          )}

          {statusGroups.produced.length > 0 && (
            <Section title="Produzidos — Aguardando Envio" color="bg-blue-500" count={statusGroups.produced.length}>
              {statusGroups.produced.map(o => <ProductionCard key={o.id} order={o} onAction={handleAction} />)}
            </Section>
          )}

          {statusGroups.shipped.length > 0 && (
            <Section title="Enviados — Aguardando Confirmação" color="bg-green-500" count={statusGroups.shipped.length}>
              {statusGroups.shipped.map(o => <ProductionCard key={o.id} order={o} onAction={handleAction} />)}
            </Section>
          )}

          {statusGroups.delivered.length > 0 && (
            <Section title="Entregues" color="bg-emerald-500" count={statusGroups.delivered.length}>
              {statusGroups.delivered.slice(0, 6).map(o => <ProductionCard key={o.id} order={o} onAction={handleAction} />)}
            </Section>
          )}

          {statusGroups.cancelled.length > 0 && (
            <Section title="Cancelados" color="bg-red-500" count={statusGroups.cancelled.length}>
              {statusGroups.cancelled.slice(0, 6).map(o => <ProductionCard key={o.id} order={o} onAction={handleAction} />)}
            </Section>
          )}

        </div>
      )}
    </div>
  );
};

export default AdminProduction;