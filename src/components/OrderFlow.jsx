import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, ArrowLeft, ShoppingBag, Loader } from 'lucide-react';

export default function OrderFlow({ cartItems, onBackToCart, onOrderSuccess, apiBaseUrl }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [whatsAppNumber, setWhatsAppNumber] = useState('917972317382'); // default fallback

  // Fetch WhatsApp number on load
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/settings/whatsapp`)
      .then(res => res.json())
      .then(data => {
        if (data && data.number) {
          // Remove spaces/special characters
          setWhatsAppNumber(data.number.replace(/\s+/g, ''));
        }
      })
      .catch(err => console.error("Error fetching WhatsApp number:", err));
  }, [apiBaseUrl]);

  const grandTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const payload = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || null,
      shippingAddress: formData.shippingAddress,
      city: formData.city,
      postalCode: formData.postalCode,
      notes: formData.notes || null,
      items: cartItems.map(item => ({
        productId: item.productId,
        weight: item.weight,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to submit order to server.');
      }

      const result = await response.json();
      setOrderResult(result);
    } catch (err) {
      setErrorMessage(err.message || 'Could not place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!orderResult) return;

    // Construct WhatsApp pre-filled text
    let messageText = `*Namaste! I would like to complete my order from Vasu Amrut Madh.*\n\n`;
    messageText += `*Order Number:* ${orderResult.orderNumber}\n`;
    messageText += `*Customer:* ${orderResult.customerName}\n`;
    messageText += `*Phone:* ${orderResult.customerPhone}\n`;
    messageText += `*Address:* ${orderResult.shippingAddress}, ${orderResult.city} - ${orderResult.postalCode}\n\n`;
    
    messageText += `*Items Ordered:*\n`;
    orderResult.orderItems.forEach(item => {
      messageText += `- ${item.quantity} x ${item.productName} (${item.weight}) @ ₹${item.unitPrice} = *₹${item.totalPrice}*\n`;
    });
    
    messageText += `\n*Total Amount:* *₹${orderResult.totalAmount}*\n`;
    
    if (orderResult.notes) {
      messageText += `*Notes:* ${orderResult.notes}\n`;
    }

    messageText += `\n_Please confirm my order and share delivery and payment details._`;

    // URL encode the message
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');

    // Notify parent to empty cart and return home
    onOrderSuccess();
  };

  // If order was successfully saved to DB, show WhatsApp redirect page
  if (orderResult) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '600px', marginTop: '70px' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          
          <div style={{
            background: 'hsl(var(--nature-green-light))',
            color: 'hsl(var(--nature-green))',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(21, 128, 61, 0.15)'
          }}>
            <CheckCircle size={44} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'hsl(var(--honey-primary-dark))', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
              Order Saved Successfully!
            </h2>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem' }}>
              Your order has been registered in our database as <strong>{orderResult.orderNumber}</strong>.
            </p>
          </div>

          <div style={{
            background: 'hsl(var(--honey-primary-light) / 0.5)',
            border: '1.5px dashed hsl(var(--honey-primary-dark) / 0.3)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            width: '100%',
            textAlign: 'left',
            fontSize: '0.9rem',
            color: 'hsl(var(--honey-primary-dark))'
          }}>
            <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Next Step Required:</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
              To complete your order, click the WhatsApp button below. This will send your order summary directly to Godagiri Farms so we can arrange payment and delivery details.
            </p>
          </div>

          <button 
            onClick={handleWhatsAppRedirect}
            className="btn btn-secondary animate-float"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', gap: '0.75rem' }}
          >
            <Send size={20} /> Complete Order on WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '100px 1.5rem 60px 1.5rem', marginTop: '20px' }}>
      
      {/* Back button */}
      <button 
        onClick={onBackToCart} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'hsl(var(--honey-primary-dark))', marginBottom: '1.5rem', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Checkout Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'hsl(var(--honey-primary-dark))', marginBottom: '1.5rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.75rem' }}>
            Shipping Details
          </h2>

          {errorMessage && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-group">
              <label htmlFor="customerName">Full Name *</label>
              <input 
                type="text" 
                id="customerName" 
                name="customerName" 
                required 
                className="form-control" 
                placeholder="e.g., Ramesh Patil" 
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerPhone">Mobile Number (WhatsApp Preferred) *</label>
              <input 
                type="tel" 
                id="customerPhone" 
                name="customerPhone" 
                required 
                className="form-control" 
                placeholder="e.g., 9876543210" 
                value={formData.customerPhone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email Address (Optional)</label>
              <input 
                type="email" 
                id="customerEmail" 
                name="customerEmail" 
                className="form-control" 
                placeholder="e.g., ramesh@gmail.com" 
                value={formData.customerEmail}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="shippingAddress">Shipping / Delivery Address *</label>
              <textarea 
                id="shippingAddress" 
                name="shippingAddress" 
                required 
                rows="3" 
                className="form-control" 
                placeholder="e.g., flat no. 12, Shivajinagar" 
                value={formData.shippingAddress}
                onChange={handleInputChange}
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  required 
                  className="form-control" 
                  placeholder="Pune" 
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Pincode *</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode" 
                  required 
                  className="form-control" 
                  placeholder="411005" 
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Special Instructions (Optional)</label>
              <input 
                type="text" 
                id="notes" 
                name="notes" 
                className="form-control" 
                placeholder="e.g. Leave with security, call before delivery" 
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader size={18} className="animate-spin" /> Registering Order...
                </span>
              ) : 'Submit Order'}
            </button>
          </form>
        </div>

        {/* Order Summary sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', color: 'hsl(var(--honey-primary-dark))', marginBottom: '1.25rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} /> Order Summary
            </h3>

            {/* List of items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.25rem' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', borderBottom: '1px solid hsl(var(--border-color) / 0.5)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                      Size: {item.weight} | Qty: {item.quantity}
                    </span>
                  </div>
                  <span style={{ fontWeight: '700', color: 'hsl(var(--honey-primary-dark))' }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid hsl(var(--border-color))', paddingTop: '1rem' }}>
              <span style={{ fontWeight: '700', fontSize: '1rem' }}>Total Amount</span>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'hsl(var(--honey-primary-dark))' }}>
                ₹{grandTotal}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
