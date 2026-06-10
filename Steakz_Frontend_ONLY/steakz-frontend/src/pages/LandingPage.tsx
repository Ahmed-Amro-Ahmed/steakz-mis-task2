import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';

interface Branch {
  id: number;
  name: string;
  location: string;
  phone?: string;
  description?: string;
  hours?: string;
}

interface Feedback {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  branch: { name: string };
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

const FEATURE_MENU = [
  { name: 'Signature Ribeye', price: 28.50, category: 'Main', desc: '300g Aged Scottish beef, served with triple-cooked chips.' },
  { name: 'Classic Sirloin', price: 24.00, category: 'Main', desc: 'Lean and tender with a thick cap of fat for extra flavor.' },
  { name: 'Fillet Mignon', price: 32.00, category: 'Main', desc: 'The most tender cut, melt-in-your-mouth texture.' },
  { name: 'Garlic Mushrooms', price: 6.50, category: 'Side', desc: 'Sautéed in butter with fresh parsley and garlic.' },
  { name: 'Peppercorn Sauce', price: 3.00, category: 'Sauce', desc: 'Creamy brandy-based sauce with crushed peppercorns.' },
];

const BRANCH_METADATA: Record<string, { hours: string; description: string }> = {
  'London Central': {
    hours: 'Mon–Thu 12:00–23:00, Fri–Sat 12:00–00:00',
    description: 'Our flagship restaurant in the heart of the city, offering a premium dining experience.'
  },
  'Manchester North': {
    hours: 'Mon–Thu 12:00–22:30, Fri–Sat 12:00–23:30',
    description: 'A stylish, industrial-chic space perfect for business lunches and evening celebrations.'
  },
  'Birmingham Bullring': {
    hours: 'Mon–Sun 12:00–22:30',
    description: 'Located in the iconic Bullring, perfect for a break from shopping with the finest steaks.'
  },
  'Edinburgh Royal Mile': {
    hours: 'Mon–Sun 12:00–22:00',
    description: 'Experience premium dining on the historic Royal Mile with locally sourced Scottish beef.'
  },
  'Cardiff Bay': {
    hours: 'Mon–Sun 12:00–22:30',
    description: 'Modern waterfront dining with stunning views and exceptional service.'
  }
};

export function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [reviews, setReviews] = useState<Feedback[]>([]);
  
  // Order / Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showBranchWarning, setShowBranchWarning] = useState(false);

  // Feedback Form State
  const [customerName, setCustomerName] = useState('');
  const [branchId, setBranchId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchReviews = () => {
    axios.get('/api/feedback/public')
      .then(res => setReviews(res.data))
      .catch(err => console.error('Failed to load reviews', err));
  };

  useEffect(() => {
    axios.get('/api/admin/branches')
      .then(res => {
        const enriched = res.data.map((b: any) => ({
          ...b,
          description: BRANCH_METADATA[b.name]?.description || 'Experience the finest selection of premium steaks.',
          hours: BRANCH_METADATA[b.name]?.hours || '12:00 PM - 11:00 PM'
        }));
        setBranches(enriched);
      })
      .catch(() => {
        // Fallback for demo
        const fallback = [
          { id: 1, name: 'London Central', location: '123 Leicester Square, London' },
          { id: 2, name: 'Manchester North', location: '45 Deansgate, Manchester' },
          { id: 3, name: 'Birmingham Bullring', location: 'Bullring Shopping Centre, Birmingham' },
          { id: 4, name: 'Edinburgh Royal Mile', location: '18 Royal Mile, Edinburgh' },
          { id: 5, name: 'Cardiff Bay', location: 'Mermaid Quay, Cardiff' }
        ].map(b => ({
          ...b,
          description: BRANCH_METADATA[b.name]?.description,
          hours: BRANCH_METADATA[b.name]?.hours
        }));
        setBranches(fallback);
      });
    
    fetchReviews();
  }, []);

  // Handle cart
  const addToCart = (item: typeof FEATURE_MENU[0]) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { fromOrder: true } });
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      alert('Only customers can place orders through this flow. Please log in as a customer.');
      return;
    }
    if (!selectedBranchId) {
      setShowBranchWarning(true);
      scrollTo('menu');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { name: item.name, price: item.price, quantity: 1 }];
    });
    setOrderStatus('idle');
  };

  const placeOrder = async () => {
    if (!selectedBranchId || cart.length === 0) return;
    setOrderStatus('loading');
    try {
      await axios.post('/api/sales', {
        branchId: selectedBranchId,
        items: cart.map(i => ({
          menuItem: i.name,
          quantity: i.quantity,
          unitPrice: i.price
        }))
      });
      setOrderStatus('success');
      setCart([]);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Failed to place order:', err);
      setOrderStatus('error');
    }
  };

  const startOrderAt = (id: number) => {
    setSelectedBranchId(id);
    setShowBranchWarning(false);
    scrollTo('menu');
  };

  // Handle hash scrolling on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedback', {
        customerName,
        branchId: Number(branchId),
        rating: Number(rating),
        comment
      });
      setFeedbackMsg('Thank you for your feedback! It has been posted below.');
      setCustomerName('');
      setComment('');
      setBranchId('');
      fetchReviews(); // Refresh the list
    } catch (err) {
      setFeedbackMsg('Error submitting feedback. Please try again.');
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const leaveReviewFor = (id: number) => {
    setBranchId(String(id));
    scrollTo('feedback');
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay">
          <h1>STEAKZ PREMIUM MIS</h1>
          <p>Where Culinary Excellence Meets Intelligent Management</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">Portal Login</Link>
            <button onClick={() => scrollTo('branches')} className="btn btn-outline">Explore Branches</button>
          </div>
        </div>
      </header>

      {/* Branches Section */}
      <section id="branches" className="content-section">
        <div className="section-header">
          <h2>Our Branches</h2>
          <div className="accent-bar"></div>
        </div>
        <div className="branch-grid">
          {branches.map(branch => (
            <div key={branch.id} className={`branch-premium-card ${selectedBranchId === branch.id ? 'selected-branch' : ''}`}>
              <div className="card-tag">OPEN</div>
              <h3>{branch.name}</h3>
              <p className="branch-loc">{branch.location}</p>
              <p className="branch-desc">{branch.description}</p>
              <div className="branch-info">
                <span>🕒 {branch.hours}</span>
              </div>
              <div className="card-actions">
                <button className="btn btn-sm" onClick={() => scrollTo('menu')}>View Menu</button>
                <button className="btn btn-sm btn-outline-dark" onClick={() => leaveReviewFor(branch.id)}>Leave Review</button>
                <button className={`btn btn-sm ${selectedBranchId === branch.id ? 'btn-primary' : 'btn-dark'}`} onClick={() => startOrderAt(branch.id)}>
                  {selectedBranchId === branch.id ? 'Selected' : 'Start Order'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="content-section menu-section-bg">
        <div className="section-header">
          <h2>Featured Menu</h2>
          <div className="accent-bar"></div>
          {selectedBranchId && (
            <p style={{ marginTop: '10px', color: '#4CAF50', fontWeight: 'bold' }}>
              Ordering from: {branches.find(b => b.id === selectedBranchId)?.name}
            </p>
          )}
        </div>
        
        {showBranchWarning && !selectedBranchId && (
          <div className="branch-warning-card">
            <h3>Please choose a branch before adding items</h3>
            <p>Select a location to see local availability and start your order:</p>
            <div className="warning-branch-list">
              {branches.map(b => (
                <button key={b.id} className="btn btn-sm btn-outline-dark" onClick={() => startOrderAt(b.id)}>
                  {b.name}
                </button>
              ))}
            </div>
            <button className="close-warning" onClick={() => setShowBranchWarning(false)}>✕</button>
          </div>
        )}

        <div className="menu-container" style={{ display: 'grid', gridTemplateColumns: cart.length > 0 ? '2fr 1fr' : '1fr', gap: '30px' }}>
          <div className="menu-grid">
            {FEATURE_MENU.map((item, idx) => (
              <div key={idx} className="menu-item-card">
                <div className="menu-meta">
                  <span className="category-label">{item.category}</span>
                  <span className="price-label">£{item.price.toFixed(2)}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <button onClick={() => addToCart(item)} className="btn btn-sm btn-outline-dark">Add to Order</button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="cart-card">
              <h3>Your Order</h3>
              <div className="cart-items">
                {cart.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <span>{item.quantity}x {item.name}</span>
                    <span>£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total</strong>
                <strong>£{cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}</strong>
              </div>
              
              {orderStatus === 'success' ? (
                <div className="success-alert" style={{ marginTop: '20px' }}>Order placed! Redirecting...</div>
              ) : (
                <button className="btn btn-primary btn-full" onClick={placeOrder} disabled={orderStatus === 'loading'}>
                  {orderStatus === 'loading' ? 'Placing Order...' : 'Place Order'}
                </button>
              )}
              {orderStatus === 'error' && <p style={{ color: 'red', marginTop: '10px', fontSize: '0.8rem' }}>Error placing order. Please try again.</p>}
            </div>
          )}
        </div>
      </section>

      {/* Wall of Love - Real Reviews */}
      <section className="content-section">
        <div className="section-header">
          <h2>Recent Reviews</h2>
          <p>Real feedback from our diners</p>
          <div className="accent-bar"></div>
        </div>
        <div className="reviews-wall">
          {reviews.length === 0 ? <p className="empty-reviews">No reviews yet. Be the first!</p> :
            reviews.map(r => (
              <div key={r.id} className="review-bubble">
                <div className="review-meta">
                  <strong>{r.customerName || 'Anonymous'}</strong>
                  <span className="review-branch">@{r.branch.name}</span>
                </div>
                <div className="review-stars">{'⭐'.repeat(r.rating)}</div>
                <p className="review-comment">"{r.comment}"</p>
                <small className="review-date">{new Date(r.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          }
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="content-section feedback-section">
        <div className="feedback-container">
          <div className="feedback-header">
            <h2>Leave a Review</h2>
            <p>Tell us about your dining experience</p>
          </div>
          
          {feedbackMsg && <div className="success-alert">{feedbackMsg}</div>}
          
          <form className="feedback-form" onSubmit={handleFeedback}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Enter name" required />
              </div>
              <div className="form-group">
                <label>Select Branch</label>
                <select value={branchId} onChange={e => setBranchId(e.target.value)} required>
                  <option value="">Choose a branch...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Rating (1-5)</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" 
                    className={rating === String(n) ? 'active' : ''} 
                    onClick={() => setRating(String(n))}>
                    {n} ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Comment</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell us what you liked..." rows={4} required />
            </div>

            <button type="submit" className="btn btn-primary btn-full">Submit Feedback</button>
          </form>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Steakz Management Information System. All rights reserved.</p>
      </footer>

      <style>{`
        .landing-container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9f9f9; color: #333; scroll-behavior: smooth; }
        
        .selected-branch { border-color: #4CAF50 !important; transform: scale(1.02); }

        /* Branch Warning */
        .branch-warning-card { background: #fff3f3; border: 1px solid #ffcccc; padding: 20px; border-radius: 10px; margin-bottom: 30px; position: relative; text-align: center; }
        .branch-warning-card h3 { color: #d32f2f; margin-bottom: 10px; font-size: 1.1rem; }
        .branch-warning-card p { font-size: 0.9rem; color: #666; margin-bottom: 15px; }
        .warning-branch-list { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .close-warning { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #999; }

        /* Cart */
        .cart-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: sticky; top: 20px; align-self: flex-start; }
        .cart-items { margin: 20px 0; border-top: 1px solid #eee; padding-top: 15px; }
        .cart-item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.95rem; }
        .cart-total { display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #eee; margin-top: 10px; font-size: 1.1rem; }

        /* Hero */
        .hero-section { height: 60vh; background: url('https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center/cover; position: relative; }
        .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; text-align: center; padding: 20px; }
        .hero-section h1 { font-size: 3.5rem; margin-bottom: 10px; letter-spacing: 2px; }
        .hero-section p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
        .hero-actions { display: flex; gap: 20px; }

        /* Sections */
        .content-section { padding: 80px 20px; max-width: 1200px; margin: 0 auto; }
        .section-header { text-align: center; margin-bottom: 50px; }
        .section-header h2 { font-size: 2.5rem; color: #1a1a1a; margin-bottom: 10px; }
        .accent-bar { width: 60px; height: 4px; background: #e63946; margin: 0 auto; }
        .menu-section-bg { background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border-radius: 12px; }

        /* Buttons */
        .btn { padding: 12px 25px; border-radius: 6px; font-weight: 600; cursor: pointer; text-decoration: none; transition: 0.3s; border: none; display: inline-block; text-align: center; }
        .btn-sm { padding: 8px 15px; font-size: 0.85rem; }
        .btn-primary { background: #e63946; color: white; }
        .btn-primary:hover { background: #c1121f; }
        .btn-outline { border: 2px solid white; color: white; background: transparent; }
        .btn-outline:hover { background: white; color: black; }
        .btn-outline-dark { border: 1px solid #333; color: #333; background: transparent; }
        .btn-dark { background: #1a1a1a; color: white; }
        .btn-full { width: 100%; margin-top: 10px; }

        /* Branch Cards */
        .branch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
        .branch-premium-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); position: relative; border-top: 5px solid #e63946; }
        .card-tag { position: absolute; top: 15px; right: 15px; background: #4CAF50; color: white; padding: 2px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }
        .branch-premium-card h3 { font-size: 1.5rem; margin-bottom: 5px; }
        .branch-loc { color: #e63946; font-weight: 600; font-size: 0.9rem; margin-bottom: 15px; }
        .branch-desc { line-height: 1.6; color: #666; margin-bottom: 20px; }
        .branch-info { font-size: 0.85rem; color: #888; margin-bottom: 25px; }
        .card-actions { display: flex; gap: 10px; flex-wrap: wrap; }

        /* Menu Cards */
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
        .menu-item-card { background: #fcfcfc; padding: 25px; border-radius: 10px; border: 1px solid #eee; transition: 0.3s; }
        .menu-item-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .menu-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .category-label { background: #eee; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; color: #555; }
        .price-label { font-weight: bold; color: #1a1a1a; font-size: 1.1rem; }
        .menu-item-card h3 { margin-bottom: 10px; }
        .menu-item-card p { font-size: 0.9rem; color: #777; line-height: 1.5; margin-bottom: 20px; }

        /* Wall of Love - Real Reviews */
        .reviews-wall { display: flex; overflow-x: auto; gap: 20px; padding: 20px 5px; scrollbar-width: thin; }
        .review-bubble { flex: 0 0 300px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 4px solid #e63946; }
        .review-meta { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; }
        .review-branch { color: #e63946; font-weight: bold; }
        .review-stars { margin-bottom: 10px; font-size: 0.8rem; }
        .review-comment { font-style: italic; color: #444; margin-bottom: 15px; font-size: 0.95rem; line-height: 1.4; }
        .review-date { color: #999; font-size: 0.75rem; }
        .empty-reviews { text-align: center; color: #888; width: 100%; }

        /* Feedback Form */
        .feedback-section { background: #1a1a1a; color: white; border-radius: 12px; margin-top: 50px; margin-bottom: 50px; }
        .feedback-container { max-width: 600px; margin: 0 auto; }
        .feedback-header { text-align: center; margin-bottom: 30px; }
        .feedback-header h2 { color: white; font-size: 2.2rem; }
        .feedback-form { background: #2a2a2a; padding: 40px; border-radius: 12px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: #bbb; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; background: #333; border: 1px solid #444; border-radius: 6px; color: white; }
        .rating-selector { display: flex; gap: 10px; margin-top: 10px; }
        .rating-selector button { flex: 1; padding: 10px; background: #333; border: 1px solid #444; color: white; border-radius: 6px; cursor: pointer; transition: 0.2s; }
        .rating-selector button.active { background: #e63946; border-color: #e63946; }
        .success-alert { background: #4CAF50; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center; }
        
        .landing-footer { text-align: center; padding: 40px; border-top: 1px solid #eee; color: #888; font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
