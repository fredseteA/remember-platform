import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Package, Heart, ShoppingBag, Star, Check, X, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Admin = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [memorials, setMemorials] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [statsRes, ordersRes, memorialsRes, reviewsRes] = await Promise.all([
          axios.get(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/admin/memorials`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/admin/reviews`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setStats(statsRes.data);
        setOrders(ordersRes.data);
        setMemorials(memorialsRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Erro ao carregar dados administrativos');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAdminData();
  }, [user, token, navigate]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API}/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Tem certeza que deseja EXCLUIR este pedido? Esta ação não pode ser desfeita.')) return;
    
    try {
      await axios.delete(
        `${API}/admin/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(orders.filter(order => order.id !== orderId));
      
      // Atualizar stats
      setStats(prev => ({
        ...prev,
        total_orders: (prev?.total_orders || 1) - 1
      }));
      
      toast.success('Pedido excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Erro ao excluir pedido');
    }
  };

  const approveReview = async (reviewId) => {
    try {
      await axios.put(
        `${API}/admin/reviews/${reviewId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, approved: true } : review
      ));
      
      toast.success('Avaliação aprovada com sucesso!');
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Erro ao aprovar avaliação');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) return;
    
    try {
      await axios.delete(
        `${API}/admin/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReviews(reviews.filter(review => review.id !== reviewId));
      
      toast.success('Avaliação excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Erro ao excluir avaliação');
    }
  };

  const pendingReviews = reviews.filter(r => !r.approved).length;

  if (loading) {
    return (
      <div className="pt-32 pb-24" data-testid="admin-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        data-testid="admin-loading"
        style={{
          background: '#0f1824',
          minHeight: '100vh',
          paddingTop: 'clamp(100px, 14vw, 148px)',
          paddingBottom: 80,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Skeleton className="h-10 w-72 mb-10 rounded-xl opacity-20" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl opacity-10" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-hidden"
      data-testid="admin-page"
      style={{
        background: '#0f1824',
        fontFamily: '"Georgia", serif',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <style>{`
        /* Subtle grid background */
        .adm-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(90,168,224,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(90,168,224,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes revealAdm {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes revealRow {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Stat cards */
        .adm-stat {
          border-radius: 20px;
          padding: clamp(18px, 3vw, 26px);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .adm-stat:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(90,168,224,0.2);
        }

        /* Tabs */
        .adm-tabs { display: flex; gap: 4px; }
        .adm-tab {
          position: relative;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-family: "Georgia", serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.25s ease, background 0.25s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .adm-tab:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.04); }
        .adm-tab.active {
          color: white;
          background: rgba(90,168,224,0.15);
          border: 1px solid rgba(90,168,224,0.25);
        }
        .adm-tab .adm-badge {
          position: absolute;
          top: 6px; right: 6px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #f97316;
          color: white;
          font-size: 0.55rem;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }

        /* Rows */
        .adm-row {
          border-radius: 16px;
          padding: clamp(14px, 2.5vw, 20px);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: background 0.25s ease;
        }
        .adm-row:hover { background: rgba(255,255,255,0.055); }

        /* Badges */
        .adm-chip {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-family: "Georgia", serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Select */
        .adm-select {
          padding: 9px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.85);
          font-family: "Georgia", serif;
          font-size: 0.78rem;
          outline: none;
          cursor: pointer;
          transition: border-color 0.25s ease;
          min-width: 160px;
          -webkit-appearance: none;
          appearance: none;
        }
        .adm-select option { background: #1a2744; }
        .adm-select:focus { border-color: rgba(90,168,224,0.4); }

        /* Action buttons */
        .adm-btn-danger {
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
          padding: 8px 14px; border-radius: 10px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5; font-family: "Georgia", serif; font-size: 0.75rem; font-weight: 700;
          cursor: pointer; transition: all 0.25s ease; min-height: 36px;
          -webkit-tap-highlight-color: transparent;
        }
        .adm-btn-danger:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.4); }

        .adm-btn-approve {
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
          padding: 8px 14px; border-radius: 10px;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
          color: #86efac; font-family: "Georgia", serif; font-size: 0.75rem; font-weight: 700;
          cursor: pointer; transition: all 0.25s ease; min-height: 36px;
          -webkit-tap-highlight-color: transparent;
        }
        .adm-btn-approve:hover { background: rgba(34,197,94,0.18); border-color: rgba(34,197,94,0.4); }

        /* Memorial card */
        .adm-mem-card {
          border-radius: 18px; overflow: hidden;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .adm-mem-card:hover { transform: translateY(-3px); border-color: rgba(90,168,224,0.2); }
        .adm-mem-card img { transition: transform 0.5s ease; }
        .adm-mem-card:hover img { transform: scale(1.04); }

        /* Label */
        .adm-label {
          font-family: "Georgia", serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(90,168,224,0.7);
        }

        @media (max-width: 640px) {
          .adm-tabs { flex-wrap: wrap; }
          .adm-order-row { flex-direction: column !important; align-items: flex-start !important; }
          .adm-order-actions { flex-direction: column !important; width: 100% !important; }
          .adm-select { width: 100% !important; min-width: unset !important; }
        }
      `}</style>

      <div
        className="adm-root relative z-10"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 20px',
          paddingTop: 'clamp(96px, 14vw, 144px)',
          paddingBottom: 'clamp(60px, 8vw, 100px)',
        }}
      >

        {/* ── Header ── */}
        <div style={{ marginBottom: 'clamp(28px, 5vw, 44px)', animation: 'revealAdm 0.65s cubic-bezier(.22,1,.36,1) both' }}>
          <p className="adm-label" style={{ marginBottom: 10 }}>Área restrita</p>
          <h1
            data-testid="page-title"
            style={{
              fontFamily: '"Georgia", serif',
              fontSize: 'clamp(1.7rem, 4vw, 2.8rem)',
              fontWeight: 700, color: 'white', lineHeight: 1.1,
            }}
          >
            Painel Administrativo
          </h1>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'clamp(10px, 2vw, 16px)',
          marginBottom: 'clamp(28px, 5vw, 44px)',
        }}>
          {[
            { label: 'Memoriais', value: stats?.total_memorials || 0, icon: Heart, testId: 'stat-memorials', color: '#5aa8e0' },
            { label: 'Pedidos', value: stats?.total_orders || 0, icon: ShoppingBag, testId: 'stat-orders', color: '#7bbde8' },
            { label: 'Placas', value: stats?.total_plaques || 0, icon: Package, testId: 'stat-plaques', color: '#a8d8f0' },
            {
              label: 'Avaliações', value: reviews.length, icon: MessageSquare,
              testId: 'stat-reviews', color: '#f97316',
              sub: pendingReviews > 0 ? `${pendingReviews} pendente${pendingReviews > 1 ? 's' : ''}` : null,
            },
          ].map((s, i) => (
            <div
              key={s.testId}
              className="adm-stat"
              data-testid={s.testId}
              style={{ animation: `revealAdm 0.55s cubic-bezier(.22,1,.36,1) ${i * 0.07}s both` }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {s.label}
                  </p>
                  <p style={{ fontFamily: '"Georgia", serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                    {s.value}
                  </p>
                  {s.sub && (
                    <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.7rem', color: '#fb923c', marginTop: 4 }}>{s.sub}</p>
                  )}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `${s.color}18`, border: `1px solid ${s.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginBottom: 20 }}>
          <div className="adm-tabs">
            {['orders', 'memorials', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`adm-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                data-testid={`tab-${tab}`}
              >
                {tab === 'orders' ? 'Pedidos' : tab === 'memorials' ? 'Memoriais' : 'Avaliações'}
                {tab === 'reviews' && pendingReviews > 0 && (
                  <span className="adm-badge">{pendingReviews}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Pedidos ── */}
        {activeTab === 'orders' && (
          <div data-testid="orders-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.length === 0 ? (
              <div style={{
                borderRadius: 20, padding: '48px 24px', textAlign: 'center',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <ShoppingBag size={36} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 12px' }} />
                <p style={{ fontFamily: '"Georgia", serif', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
                  Nenhum pedido encontrado
                </p>
              </div>
            ) : (
              orders.map((order, idx) => (
                <div
                  key={order.id}
                  className="adm-row"
                  data-testid={`order-card-${order.id}`}
                  style={{ animation: `revealRow 0.4s ease ${idx * 0.04}s both` }}
                >
                  <div className="adm-order-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: '"Georgia", serif', fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
                          Pedido #{order.id.substring(0, 8)}
                        </span>
                        <span className="adm-chip" style={{ background: 'rgba(90,168,224,0.12)', color: '#7bbde8', border: '1px solid rgba(90,168,224,0.2)' }}>
                          {order.plan_type}
                        </span>
                      </div>
                      <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 2, wordBreak: 'break-all' }}>
                        {order.user_email}
                      </p>
                      <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="adm-order-actions" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <p style={{ fontFamily: '"Georgia", serif', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>
                        R$ {order.amount.toFixed(2).replace('.', ',')}
                      </p>
                      <select
                        className="adm-select"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        data-testid={`select-status-${order.id}`}
                      >
                        <option value="pending">Pendente</option>
                        <option value="approved">Aprovado</option>
                        <option value="in_process">Em Produção</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      <button className="adm-btn-danger" onClick={() => deleteOrder(order.id)} data-testid={`delete-order-${order.id}`}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Tab: Memoriais ── */}
        {activeTab === 'memorials' && (
          <div data-testid="memorials-tab-content">
            {memorials.length === 0 ? (
              <div style={{
                borderRadius: 20, padding: '48px 24px', textAlign: 'center',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <Heart size={36} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 12px' }} />
                <p style={{ fontFamily: '"Georgia", serif', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
                  Nenhum memorial encontrado
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'clamp(10px, 2vw, 16px)' }}>
                {memorials.map((memorial) => (
                  <div key={memorial.id} className="adm-mem-card" data-testid={`memorial-card-${memorial.id}`}>
                    <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                      {memorial.person_data.photo_url ? (
                        <img src={memorial.person_data.photo_url} alt={memorial.person_data.full_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'linear-gradient(135deg, rgba(90,168,224,0.15) 0%, rgba(26,39,68,0.3) 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Heart size={32} style={{ color: 'rgba(90,168,224,0.35)' }} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,24,36,0.7) 0%, transparent 50%)' }} />
                      {/* Badges sobre a imagem */}
                      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                        <span className="adm-chip" style={{
                          background: memorial.status === 'published' ? 'rgba(34,197,94,0.2)' : 'rgba(251,191,36,0.2)',
                          color: memorial.status === 'published' ? '#86efac' : '#fcd34d',
                          border: memorial.status === 'published' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(251,191,36,0.3)',
                          backdropFilter: 'blur(8px)',
                        }}>
                          {memorial.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                        <span className="adm-chip" style={{
                          background: memorial.person_data.public_memorial ? 'rgba(90,168,224,0.15)' : 'rgba(255,255,255,0.08)',
                          color: memorial.person_data.public_memorial ? '#7bbde8' : 'rgba(255,255,255,0.5)',
                          border: memorial.person_data.public_memorial ? '1px solid rgba(90,168,224,0.25)' : '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(8px)',
                        }}>
                          {memorial.person_data.public_memorial ? 'Público' : 'Privado'}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <h3 style={{ fontFamily: '"Georgia", serif', fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: 4 }}>
                        {memorial.person_data.full_name}
                      </h3>
                      <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)' }}>
                        {memorial.responsible.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Avaliações ── */}
        {activeTab === 'reviews' && (
          <div data-testid="reviews-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reviews.length === 0 ? (
              <div style={{
                borderRadius: 20, padding: '48px 24px', textAlign: 'center',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <MessageSquare size={36} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 12px' }} />
                <p style={{ fontFamily: '"Georgia", serif', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
                  Nenhuma avaliação encontrada
                </p>
              </div>
            ) : (
              reviews.map((review, idx) => (
                <div
                  key={review.id}
                  className="adm-row"
                  data-testid={`review-card-${review.id}`}
                  style={{
                    borderColor: review.approved ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.2)',
                    animation: `revealRow 0.4s ease ${idx * 0.04}s both`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: '"Georgia", serif', fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
                          {review.user_name}
                        </span>
                        <span className="adm-chip" style={{
                          background: review.approved ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)',
                          color: review.approved ? '#86efac' : '#fb923c',
                          border: review.approved ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(249,115,22,0.25)',
                        }}>
                          {review.approved ? 'Aprovada' : 'Pendente'}
                        </span>
                      </div>
                      <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 8, wordBreak: 'break-all' }}>
                        {review.user_email}
                      </p>
                      {/* Stars */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 10 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} style={{
                            fill: i < review.rating ? '#fbbf24' : 'transparent',
                            color: i < review.rating ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                          }} />
                        ))}
                        <span style={{ fontFamily: '"Georgia", serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>
                          {review.rating}/5
                        </span>
                      </div>
                      {review.title && (
                        <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.88rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
                          "{review.title}"
                        </p>
                      )}
                      {review.comment && (
                        <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 8 }}>
                          {review.comment}
                        </p>
                      )}
                      <p style={{ fontFamily: '"Georgia", serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)' }}>
                        {new Date(review.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Ações */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                      {!review.approved && (
                        <button className="adm-btn-approve" onClick={() => approveReview(review.id)} data-testid={`approve-${review.id}`}>
                          <Check size={13} /> Aprovar
                        </button>
                      )}
                      <button className="adm-btn-danger" onClick={() => deleteReview(review.id)} data-testid={`delete-${review.id}`}>
                        <Trash2 size={13} /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
