import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import OrderFlow from './components/OrderFlow';
import AdminDashboard from './components/AdminDashboard';
import { Leaf, ShieldAlert, Award, Star } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5212';

// Fallback Mock Data in case backend is not running/configured yet
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Vasu Amrut Raw Multifloral Honey',
    description: '100% pure, natural, and unprocessed raw honey harvested from the organic farms of Godagiri. Rich in natural enzymes, antioxidants, and a delicate floral aroma. Perfect for daily consumption, immunity boosting, and natural sweetening.',
    category: 'Raw Honey',
    imageUrl: 'yellow_honey.jpg',
    isActive: true,
    prices: [
      { id: 101, productId: 1, weight: '250g', price: 150, stock: 100, isActive: true },
      { id: 102, productId: 1, weight: '500g', price: 280, stock: 100, isActive: true },
      { id: 103, productId: 1, weight: '1kg', price: 540, stock: 50, isActive: true }
    ]
  },
  {
    id: 2,
    name: 'Vasu Amrut Wild Forest Honey',
    description: 'Dark, rich, and robust honey sourced from deep wild forests. Collected from rare wild flowers, it offers a strong caramel-like flavor profile and intense therapeutic properties. Highly prized for its medicinal benefits and dark amber color.',
    category: 'Forest Honey',
    imageUrl: 'dark_honey.jpg',
    isActive: true,
    prices: [
      { id: 201, productId: 2, weight: '250g', price: 180, stock: 100, isActive: true },
      { id: 202, productId: 2, weight: '500g', price: 340, stock: 100, isActive: true },
      { id: 203, productId: 2, weight: '1kg', price: 640, stock: 50, isActive: true }
    ]
  }
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'checkout' | 'admin'
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const catalogRef = useRef(null);

  // Load products from API
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setProducts(data);
            setUsingFallbackData(false);
          } else {
            // Fallback if DB returns empty
            setProducts(MOCK_PRODUCTS);
            setUsingFallbackData(true);
          }
        } else {
          setProducts(MOCK_PRODUCTS);
          setUsingFallbackData(true);
        }
      } catch (err) {
        console.warn("Could not connect to Web API, using offline mock data:", err);
        setProducts(MOCK_PRODUCTS);
        setUsingFallbackData(true);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = (newItem) => {
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(
        item => item.productId === newItem.productId && item.weight === newItem.weight
      );

      if (existingIdx > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIdx].quantity += newItem.quantity;
        return updatedCart;
      }
      return [...prevCart, newItem];
    });
    // Open drawer to give micro-interaction feedback
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, weight, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, weight);
      return;
    }
    setCart(prevCart => prevCart.map(
      item => (item.productId === productId && item.weight === weight)
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  const handleRemoveItem = (productId, weight) => {
    setCart(prevCart => prevCart.filter(
      item => !(item.productId === productId && item.weight === weight)
    ));
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setCurrentView('home');
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation */}
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        onViewChange={(view) => setCurrentView(view)} 
        currentView={currentView}
      />

      {/* Cart Drawer Panel */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutClick={handleCheckoutClick}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Hero Banner */}
            <Hero onExploreClick={scrollToCatalog} />

            {/* Offline/Local database mode notice if API is down */}
            {usingFallbackData && (
              <div className="container" style={{ marginTop: '2rem' }}>
                <div style={{
                  background: 'hsl(var(--honey-primary-light) / 0.7)',
                  border: '1px solid hsl(var(--honey-primary-dark) / 0.15)',
                  borderRadius: '16px',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: 'hsl(var(--honey-primary-dark))',
                  fontSize: '0.9rem'
                }}>
                  <ShieldAlert size={20} />
                  <div>
                    <strong>Local Offline Mode Active</strong>: The ASP.NET Core API is currently not running or database is not set up. 
                    We are displaying preview products. Once you run the database script and start the backend, it will load live data from SQL Server.
                  </div>
                </div>
              </div>
            )}

            {/* Catalog Section */}
            <section ref={catalogRef} style={{ padding: '80px 0 60px 0' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-serif)', color: 'hsl(var(--honey-primary-dark))', marginBottom: '0.5rem' }}>
                    Our Natural Honey Range
                  </h2>
                  <p style={{ color: 'hsl(var(--text-muted))', maxWidth: '600px', margin: '0 auto' }}>
                    Handcrafted honey extracted using sustainable bee-friendly practices. Unheated and unadulterated to maintain maximum purity.
                  </p>
                </div>

                <div className="product-grid">
                  {products.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Premium Farm Story Section */}
            <section style={{ padding: '80px 0', background: '#F5F5F4' }}>
              <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1.25rem' }}>
                    Why Choose Vasu Amrut Madh?
                  </h2>
                  <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '1.5rem' }}>
                    Godagiri Farms takes pride in placing beehives in pesticide-free floral areas. Unlike mass-manufactured brands, our honey does not undergo ultra-filtration or industrial heating. This keeps the precious bee pollen, propolis, and essential royal jelly elements completely intact.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ background: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: 'hsl(var(--honey-primary))', flexShrink: 0 }}>
                        <Leaf size={24} style={{ alignSelf: 'center' }} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.15rem' }}>100% Raw & Organic</h4>
                        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Zero pasteurization or high heat filters. Rich in natural flavor and healing attributes.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ background: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: 'hsl(var(--nature-green))', flexShrink: 0 }}>
                        <Award size={24} style={{ alignSelf: 'center' }} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.15rem' }}>Lab Tested & Certified</h4>
                        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Rigorous testing to ensure absolutely zero sugar-syrup addition or antibiotic residues.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  {/* Frosted Glass Story Card */}
                  <div className="glass-card" style={{ padding: '2.5rem', borderLeft: '5px solid hsl(var(--honey-primary))' }}>
                    <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', color: '#F59E0B' }}>
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'hsl(var(--honey-primary-dark))', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', lineHeight: '1.5' }}>
                      "The taste of Vasu Amrut Madh is completely different from commercial honey. It has a beautiful floral scent and you can feel the premium quality instantly. My family uses it daily in warm water and green tea. Incredible taste!"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #78350f)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
                        SP
                      </div>
                      <div>
                        <h5 style={{ fontWeight: '700', fontSize: '0.9rem' }}>Sanjay Patil</h5>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Verified Customer, Pune</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'checkout' && (
          <OrderFlow 
            cartItems={cart}
            onBackToCart={() => {
              setCurrentView('home');
              setIsCartOpen(true); // Open cart side drawer again
            }}
            onOrderSuccess={handleOrderSuccess}
            apiBaseUrl={API_BASE_URL}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard apiBaseUrl={API_BASE_URL} usingFallbackData={usingFallbackData} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: 'hsl(var(--bg-dark))', color: 'hsl(var(--text-light))', padding: '3.5rem 0 2rem 0', borderTop: '2px solid hsl(var(--honey-primary-dark))' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          <div>
            <h3 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Vasu Amrut Madh
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-light) / 0.7)', lineHeight: '1.6' }}>
              An authentic initiative by Godagiri Farms to bring pure, raw, and unadulterated forest & multifloral honey directly to your homes.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'hsl(var(--honey-primary))', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><span onClick={() => { setCurrentView('home'); window.scrollTo(0,0); }} style={{ cursor: 'pointer', color: 'hsl(var(--text-light) / 0.8)' }}>Shop Honey</span></li>
              <li><span onClick={() => { setCurrentView('admin'); window.scrollTo(0,0); }} style={{ cursor: 'pointer', color: 'hsl(var(--text-light) / 0.8)' }}>Admin Dashboard</span></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'hsl(var(--honey-primary))', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contact Farms
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-light) / 0.7)', lineHeight: '1.5' }}>
              Godagiri Farms,<br />
              Rahuri, Ahmednagar,<br />
              Maharashtra, India<br />
              <strong>WhatsApp:</strong> +91 7972317382
            </p>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'hsl(var(--text-light) / 0.5)' }}>
          © {new Date().getFullYear()} Vasu Amrut Madh. Crafted for Purity & Nature.
        </div>
      </footer>
    </div>
  );
}
