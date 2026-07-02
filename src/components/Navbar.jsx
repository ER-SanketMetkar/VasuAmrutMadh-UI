import React, { useState, useEffect } from 'react';
import { ShoppingBag, Lock, Coffee } from 'lucide-react';

export default function Navbar({ cartCount, onCartClick, onViewChange, currentView }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`glass-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onViewChange('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <img 
            src="/logo.jpg" 
            alt="Vasu Amrut Madh Logo" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid hsl(var(--honey-primary))',
              boxShadow: '0 4px 10px rgba(245, 158, 11, 0.2)'
            }}
          />
          <div>
            <span style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: 'hsl(var(--honey-primary-dark))',
              display: 'block',
              lineHeight: '1.1'
            }}>
              वसुअमृत मध
            </span>
            <span style={{ 
              fontSize: '0.65rem', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              color: 'hsl(var(--nature-green))',
              fontWeight: '600'
            }}>
              Godagiri Farms
            </span>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span 
            onClick={() => onViewChange('home')}
            style={{ 
              fontFamily: "var(--font-ui)", 
              fontWeight: '500', 
              cursor: 'pointer',
              color: currentView === 'home' ? 'hsl(var(--honey-primary-dark))' : 'hsl(var(--text-muted))',
              borderBottom: currentView === 'home' ? '2px solid hsl(var(--honey-primary))' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'var(--transition-smooth)'
            }}
          >
            Home Shop
          </span>

          <span 
            onClick={() => onViewChange('admin')}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontFamily: "var(--font-ui)", 
              fontWeight: '500', 
              cursor: 'pointer',
              color: currentView === 'admin' ? 'hsl(var(--honey-primary-dark))' : 'hsl(var(--text-muted))',
              borderBottom: currentView === 'admin' ? '2px solid hsl(var(--honey-primary))' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Lock size={14} /> Admin Portal
          </span>

          {/* Cart Icon trigger */}
          <div 
            onClick={onCartClick}
            style={{ position: 'relative', cursor: 'pointer', padding: '0.25rem' }}
          >
            <ShoppingBag size={24} style={{ color: 'hsl(var(--honey-primary-dark))' }} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, hsl(var(--nature-green)), hsl(var(--nature-green-hover)))',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(21, 128, 61, 0.3)'
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
