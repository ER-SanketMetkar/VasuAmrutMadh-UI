import React from 'react';
import { Leaf, Award, CheckCircle } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="bg-honey-gradient" style={{ position: 'relative', paddingTop: '140px', paddingBottom: '100px', overflow: 'hidden' }}>
      
      {/* Background SVG honeycombs */}
      <svg className="honeycomb-svg animate-float-slow" style={{ top: '10%', right: '5%', width: '120px', height: '120px' }} viewBox="0 0 100 100">
        <path d="M50 2.5 L93.3 27.5 L93.3 77.5 L50 97.5 L6.7 77.5 L6.7 27.5 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 12.5 L84.6 32.5 L84.6 72.5 L50 92.5 L15.4 72.5 L15.4 32.5 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="honeycomb-svg animate-float" style={{ bottom: '15%', left: '3%', width: '180px', height: '180px' }} viewBox="0 0 100 100">
        <path d="M50 2.5 L93.3 27.5 L93.3 77.5 L50 97.5 L6.7 77.5 L6.7 27.5 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M50 35 L71.6 47.5 L71.6 72.5 L50 85 L28.4 72.5 L28.4 47.5 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Text Area */}
        <div className="animate-fade-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDF4', color: '#15803D', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '1.5rem', border: '1px solid #bcf0da' }}>
            <Leaf size={14} /> 100% ORGANIC & ARTISAN HONEY
          </div>
          
          <h1 style={{ fontSize: 'calc(1.8rem + 1.5vw)', lineHeight: '1.15', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', color: 'hsl(var(--honey-primary-dark))' }}>
            The Nectar of Nature <br />
            <span style={{ fontStyle: 'italic', fontWeight: '400', color: 'hsl(var(--honey-primary-hover))' }}>
              वसुअमृत मध
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'hsl(var(--text-muted))', marginBottom: '2.5rem', maxWidth: '520px' }}>
            Directly sourced from the pristine orchards and wild forests of <strong>Godagiri Farms</strong>. Unprocessed, unheated, and unfiltered to preserve all natural enzymes, antioxidants, and pure health benefits.
          </p>

          {/* Core Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              <CheckCircle size={18} style={{ color: 'hsl(var(--nature-green))' }} /> Raw & Unpasteurized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              <CheckCircle size={18} style={{ color: 'hsl(var(--nature-green))' }} /> Zero Added Sugar
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              <CheckCircle size={18} style={{ color: 'hsl(var(--nature-green))' }} /> Loaded with Nutrients
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              <CheckCircle size={18} style={{ color: 'hsl(var(--nature-green))' }} /> Direct from Farms
            </div>
          </div>

          <button onClick={onExploreClick} className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
            Explore Our Products
          </button>
        </div>

        {/* Visual Showcase */}
        <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          {/* Circular backdrop shadow */}
          <div style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1
          }} />

          {/* Double Jar composition */}
          <div style={{ position: 'relative', width: '340px', height: '340px' }}>
            {/* Dark Forest Jar in background slightly offset */}
            <img 
              src="/dark_honey.jpg" 
              alt="Wild Forest Honey Jar" 
              style={{
                position: 'absolute',
                width: '180px',
                height: '240px',
                objectFit: 'contain',
                bottom: '10px',
                left: '20px',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(28, 25, 16, 0.2)',
                border: '2px solid rgba(255,255,255,0.7)',
                transform: 'rotate(-6deg)'
              }}
            />

            {/* Golden Raw Honey Jar in foreground */}
            <img 
              src="/yellow_honey.jpg" 
              alt="Raw Multifloral Honey Jar" 
              style={{
                position: 'absolute',
                width: '200px',
                height: '260px',
                objectFit: 'contain',
                top: '10px',
                right: '10px',
                borderRadius: '20px',
                boxShadow: '0 20px 45px rgba(120, 53, 15, 0.25)',
                border: '3px solid rgba(255,255,255,0.9)',
                transform: 'rotate(4deg)'
              }}
            />
          </div>
        </div>

      </div>

      {/* Dripping honey SVG bottom divider */}
      <svg className="honey-drip-divider" viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <path d="M0,0 Q120,15 240,5 T480,20 T720,5 T960,30 T1200,8 T1440,0 L1440,40 L0,40 Z" fill="#FAF9F6" />
      </svg>
    </section>
  );
}
