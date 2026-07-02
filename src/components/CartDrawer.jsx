import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckoutClick }) {
  if (!isOpen) return null;

  const grandTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="drawer">
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} style={{ color: 'hsl(var(--honey-primary-dark))' }} />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Shopping Cart ({cartItems.length})</h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              color: 'hsl(var(--text-muted))', 
              padding: '0.25rem', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'hsl(var(--border-color) / 0.3)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body (Cart Items) */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '1rem',
              color: 'hsl(var(--text-muted))'
            }}>
              <ShoppingBag size={48} strokeWidth={1} style={{ color: 'hsl(var(--honey-primary-light))' }} />
              <p style={{ fontWeight: '500' }}>Your cart is empty.</p>
              <button 
                onClick={onClose}
                className="btn btn-outline"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.productId}-${item.weight}`} className="cart-item">
                {/* Image */}
                <img src={`/${item.imageUrl}`} alt={item.name} className="cart-item-img" />

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.15rem' }}>{item.name}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        {item.weight}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                        ₹{item.price} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Control & Delete */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem',
                      background: 'hsl(var(--border-color) / 0.3)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '8px'
                    }}>
                      <button 
                        onClick={() => onUpdateQuantity(item.productId, item.weight, item.quantity - 1)}
                        style={{ display: 'flex', alignItems: 'center', color: 'hsl(var(--text-main))' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.productId, item.weight, item.quantity + 1)}
                        style={{ display: 'flex', alignItems: 'center', color: 'hsl(var(--text-main))' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.productId, item.weight)}
                      style={{ color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#b91c1c'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--text-muted))'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', minWidth: '70px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'hsl(var(--honey-primary-dark))' }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer (Subtotal & CTA) */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: 'hsl(var(--text-muted))' }}>Subtotal</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(var(--honey-primary-dark))' }}>
                ₹{grandTotal}
              </span>
            </div>
            
            <button 
              onClick={onCheckoutClick}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.75rem' }}>
              Orders will be completed & processed over WhatsApp.
            </p>
          </div>
        )}

      </div>
    </>
  );
}
