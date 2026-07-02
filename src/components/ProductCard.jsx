import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  // Select the first active price option as default
  const activePrices = product.prices ? product.prices.filter(p => p.isActive) : [];
  const [selectedPriceOption, setSelectedPriceOption] = useState(activePrices[0] || null);

  if (!selectedPriceOption) return null;

  const handleWeightChange = (priceOptionId) => {
    const option = activePrices.find(p => p.id === parseInt(priceOptionId));
    if (option) {
      setSelectedPriceOption(option);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      category: product.category,
      imageUrl: product.imageUrl,
      weight: selectedPriceOption.weight,
      price: selectedPriceOption.price,
      quantity: 1
    });
  };

  const isForestHoney = product.category.toLowerCase().includes('forest');

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Product Image Panel */}
      <div style={{
        height: '280px',
        background: 'linear-gradient(180deg, #ffffff 0%, hsl(var(--honey-primary-light) / 0.15) 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        {/* Category Badge */}
        <span 
          className={`badge ${isForestHoney ? 'badge-green' : 'badge-gold'}`} 
          style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 5 }}
        >
          {product.category}
        </span>

        <img 
          src={`/${product.imageUrl}`} 
          alt={product.name} 
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 20px rgba(120, 53, 15, 0.12))',
            transition: 'transform 0.4s ease'
          }}
          className="product-card-img"
        />
      </div>

      {/* Product Details */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.8rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-ui)', fontWeight: '700' }}>
          {product.name}
        </h3>
        
        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--text-muted))', flex: 1 }}>
          {product.description}
        </p>

        {/* Size Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'hsl(var(--honey-primary-dark) / 0.7)', letterSpacing: '0.05em' }}>
            Select Weight
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {activePrices.map((option) => (
              <label 
                key={option.id} 
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem 0',
                  border: selectedPriceOption.id === option.id 
                    ? `2px solid ${isForestHoney ? 'hsl(var(--nature-green))' : 'hsl(var(--honey-primary-dark))'}` 
                    : '2.5px solid hsl(var(--border-color))',
                  borderRadius: '10px',
                  background: selectedPriceOption.id === option.id 
                    ? (isForestHoney ? 'hsl(var(--nature-green-light))' : 'hsl(var(--honey-primary-light))') 
                    : 'hsl(var(--bg-white) / 0.5)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: selectedPriceOption.id === option.id 
                    ? (isForestHoney ? 'hsl(var(--nature-green))' : 'hsl(var(--honey-primary-dark))') 
                    : 'hsl(var(--text-muted))',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <input 
                  type="radio" 
                  name={`weight-${product.id}`} 
                  value={option.id}
                  checked={selectedPriceOption.id === option.id}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  style={{ display: 'none' }}
                />
                {option.weight}
              </label>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Panel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid hsl(var(--border-color) / 0.5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Price
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(var(--honey-primary-dark))' }}>
              ₹{selectedPriceOption.price}
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`btn ${isForestHoney ? 'btn-secondary' : 'btn-primary'}`}
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <ShoppingCart size={18} /> Add
          </button>
        </div>

      </div>

    </div>
  );
}
