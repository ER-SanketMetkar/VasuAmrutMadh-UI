import React, { useState, useEffect } from 'react';
import { Lock, Eye, Check, RefreshCw, MessageSquare, Settings as SettingsIcon, LogOut, ArrowRight, Loader } from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 1,
    orderNumber: 'VAM-20260701-X7R2A',
    createdAt: new Date().toISOString(),
    customerName: 'Sanjay Patil',
    customerPhone: '9876543210',
    customerEmail: 'sanjay@gmail.com',
    shippingAddress: 'Flat 4, Shanti Niwas, Erandwane',
    city: 'Pune',
    postalCode: '411004',
    totalAmount: 430,
    status: 'Pending',
    notes: 'Please pack carefully.',
    orderItems: [
      { id: 11, productName: 'Vasu Amrut Raw Multifloral Honey', weight: '250g', quantity: 1, unitPrice: 150, totalPrice: 150 },
      { id: 12, productName: 'Vasu Amrut Wild Forest Honey', weight: '250g', quantity: 1, unitPrice: 180, totalPrice: 180 },
      { id: 13, productName: 'Vasu Amrut Raw Multifloral Honey', weight: '500g', quantity: 1, unitPrice: 280, totalPrice: 280 }
    ]
  }
];

const MOCK_SETTINGS = [
  { settingKey: 'WhatsAppNumber', settingValue: '917972317382', description: 'Shop WhatsApp number for order notifications (with country code, no symbols)' },
  { settingKey: 'AdminPassword', settingValue: 'Admin@VAM2026', description: 'Password for accessing the Store Orders Admin dashboard' },
  { settingKey: 'StoreEmail', settingValue: 'contact@godagirifarms.com', description: 'Contact email for the store' },
  { settingKey: 'StoreAddress', settingValue: 'Godagiri Farms, Rahuri, Ahmednagar, Maharashtra, India', description: 'Physical address of the farms/store' }
];

export default function AdminDashboard({ apiBaseUrl, usingFallbackData }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'settings'

  // Settings states
  const [settings, setSettings] = useState([]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    if (usingFallbackData) {
      setTimeout(() => {
        if (password === 'Admin@VAM2026') {
          setIsLoggedIn(true);
          sessionStorage.setItem('admin-authenticated', 'true');
          setOrders(MOCK_ORDERS);
          setSettings(MOCK_SETTINGS);
        } else {
          setLoginError('Incorrect password (Local Offline Mode).');
        }
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem('admin-authenticated', 'true');
        fetchOrders();
        fetchSettings();
      } else {
        setLoginError(data.message || 'Incorrect password.');
      }
    } catch (err) {
      setLoginError('Server connection error. Please make sure the backend API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin-authenticated');
    setPassword('');
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    if (usingFallbackData) {
      setOrders(statusFilter ? MOCK_ORDERS.filter(o => o.status === statusFilter) : MOCK_ORDERS);
      setIsLoading(false);
      return;
    }

    try {
      const url = statusFilter ? `${apiBaseUrl}/api/orders?status=${statusFilter}` : `${apiBaseUrl}/api/orders`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    if (usingFallbackData) {
      setSettings(MOCK_SETTINGS);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    // Check session storage on mount
    const auth = sessionStorage.getItem('admin-authenticated');
    if (auth === 'true') {
      setIsLoggedIn(true);
      fetchOrders();
      fetchSettings();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [statusFilter, isLoggedIn]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (usingFallbackData) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        alert('Failed to update order status.');
      }
    } catch (err) {
      console.error('Error changing status:', err);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => prev.map(s => s.settingKey === key ? { ...s, settingValue: value } : s));
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    if (usingFallbackData) {
      setTimeout(() => {
        alert('Store settings updated successfully (Local Offline Mode)!');
        setIsSavingSettings(false);
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Store settings updated successfully!');
        fetchSettings();
      } else {
        alert('Failed to update settings.');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Helper to open direct WhatsApp conversation with client
  const handleOpenWhatsAppChat = (phone, orderNum) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const prefix = cleanPhone.startsWith('91') ? '' : '91';
    const fullPhone = cleanPhone.length === 10 ? `${prefix}${cleanPhone}` : cleanPhone;
    
    const text = `Namaste! Regarding your Vasu Amrut Madh order ${orderNum}...`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ padding: '120px 1.5rem 60px 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{
              background: 'hsl(var(--honey-primary-light))',
              color: 'hsl(var(--honey-primary-dark))',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-ui)', fontWeight: '700' }}>Admin Login</h2>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
              {usingFallbackData ? 'Offline Preview mode is active. Password is: Admin@VAM2026' : 'Enter your store password to access order management.'}
            </p>
          </div>

          {loginError && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="adminPassword">Store Password</label>
              <input 
                type="password" 
                id="adminPassword" 
                required 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '100px 1.5rem 60px 1.5rem' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)' }}>Store Manager</h1>
          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
            {usingFallbackData ? 'Viewing Local Offline Mock Orders' : 'Manage customer orders and configure farm store details.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', background: 'hsl(var(--border-color) / 0.3)', padding: '0.25rem', borderRadius: '10px' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                background: activeTab === 'orders' ? 'white' : 'transparent',
                color: activeTab === 'orders' ? 'hsl(var(--honey-primary-dark))' : 'hsl(var(--text-muted))',
                boxShadow: activeTab === 'orders' ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              Orders ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                background: activeTab === 'settings' ? 'white' : 'transparent',
                color: activeTab === 'settings' ? 'hsl(var(--honey-primary-dark))' : 'hsl(var(--text-muted))',
                boxShadow: activeTab === 'settings' ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><SettingsIcon size={14} /> Settings</span>
            </button>
          </div>

          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              color: '#b91c1c', 
              fontWeight: '600', 
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1.5px solid #fee2e2'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: '2rem', alignItems: 'flex-start' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'hsl(var(--text-muted))' }}>Status Filter:</span>
                <select 
                  className="form-control"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button 
                onClick={fetchOrders} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(var(--honey-primary-dark))' }}
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--text-muted))' }}>
                No orders found.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr 
                      key={order.id} 
                      style={{ 
                        cursor: 'pointer',
                        background: selectedOrder?.id === order.id ? 'hsl(var(--honey-primary-light) / 0.3)' : 'transparent'
                      }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td style={{ fontWeight: '700' }}>{order.orderNumber}</td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{order.customerPhone}</div>
                      </td>
                      <td style={{ fontWeight: '700', color: 'hsl(var(--honey-primary-dark))' }}>₹{order.totalAmount}</td>
                      <td>
                        <span className={`status-pill status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            style={{ padding: '0.35rem', background: '#f5f5f4', borderRadius: '6px', color: 'hsl(var(--text-main))' }}
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleOpenWhatsAppChat(order.customerPhone, order.orderNumber)}
                            style={{ padding: '0.35rem', background: '#dcfce7', borderRadius: '6px', color: '#15803d' }}
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selectedOrder && (
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Order Details</h3>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', fontWeight: '600' }}
                >
                  Close
                </button>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', display: 'block' }}>Order Number</span>
                <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'hsl(var(--honey-primary-dark))' }}>{selectedOrder.orderNumber}</span>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', display: 'block', marginTop: '0.2rem' }}>
                  Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{ background: 'hsl(var(--border-color) / 0.2)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'hsl(var(--honey-primary-dark))', display: 'block', marginBottom: '0.35rem' }}>
                  Update Order Status
                </label>
                <select 
                  className="form-control"
                  style={{ width: '100%', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>Customer Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                  <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
                  {selectedOrder.customerEmail && <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>}
                  <div><strong>Address:</strong> {selectedOrder.shippingAddress}, {selectedOrder.city} - {selectedOrder.postalCode}</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>Items Ordered</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px dashed hsl(var(--border-color) / 0.5)', paddingBottom: '0.25rem' }}>
                      <div>
                        <strong>{item.productName}</strong> <br />
                        <span style={{ color: 'hsl(var(--text-muted))' }}>{item.weight} x {item.quantity}</span>
                      </div>
                      <span style={{ fontWeight: '600' }}>₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div style={{ fontSize: '0.85rem', background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                  <strong>Notes:</strong> {selectedOrder.notes}
                </div>
              )}

              <button 
                onClick={() => handleOpenWhatsAppChat(selectedOrder.customerPhone, selectedOrder.orderNumber)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.65rem', display: 'inline-flex', gap: '0.5rem', fontSize: '0.9rem' }}
              >
                <MessageSquare size={16} /> Open Customer WhatsApp
              </button>
            </div>
          )}

        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'hsl(var(--honey-primary-dark))', marginBottom: '1.5rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.75rem' }}>
            Store Settings
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {settings.map((setting) => (
              <div key={setting.settingKey} className="form-group">
                <label style={{ textTransform: 'capitalize' }}>
                  {setting.settingKey.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input 
                  type={setting.settingKey.includes('Password') ? 'password' : 'text'}
                  className="form-control"
                  value={setting.settingValue}
                  onChange={(e) => handleSettingChange(setting.settingKey, e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.15rem' }}>
                  {setting.description}
                </span>
              </div>
            ))}

            <button 
              onClick={handleSaveSettings}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
              disabled={isSavingSettings}
            >
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
