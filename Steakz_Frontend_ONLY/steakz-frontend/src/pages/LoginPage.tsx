import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
export function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const fromOrder = location.state?.fromOrder;
  const [email,setEmail]=useState(fromOrder ? 'customer@gmail.com' : 'admin@steakz.com');
  const [password,setPassword]=useState(fromOrder ? 'Customer@123' : 'Admin@123');
  const [error,setError]=useState('');
  const [showDemo, setShowDemo] = useState(false);
  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); setError(''); try { const res = await axiosInstance.post('/api/auth/login',{email,password}); login(res.data.token,res.data.user); if (fromOrder) { navigate('/'); } else { navigate('/dashboard'); } } catch { setError('Invalid credentials or inactive account.'); } }
  return <div className="auth-card">
    <h1>{fromOrder ? 'Customer Sign In' : 'Steakz MIS Portal Login'}</h1>
    <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
      {fromOrder ? 'Please log in as a customer to continue your order.' : 'Staff and customer access portal'}
    </p>

    {error && <div className="error-message">{error}</div>}
    <form onSubmit={handleSubmit}>
      <label>Email</label><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
      <label>Password</label><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
      <button className="btn" type="submit">Login</button>
    </form>
    
    <div className="demo-credentials-section" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
      {!showDemo ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '10px' }}>
            Demo credentials are available in the submission evidence file.
          </p>
          <button type="button" onClick={() => setShowDemo(true)} style={{ background: 'none', border: 'none', color: '#e63946', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
            Show Demo Credentials
          </button>
        </div>
      ) : (
        <div className="demo-credentials">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Demo Credentials</h3>
            <button type="button" onClick={() => setShowDemo(false)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', cursor: 'pointer' }}>
              Hide
            </button>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#e63946', marginBottom: '5px' }}>Customer</h4>
            <div className="credential-row" onClick={() => { setEmail('customer@gmail.com'); setPassword('Customer@123'); }} style={{ cursor: 'pointer', fontSize: '0.85rem', background: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
              customer@gmail.com / Customer@123
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#1a1a1a', marginBottom: '5px' }}>Internal Roles</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              {[
                { role: 'Admin', email: 'admin@steakz.com', pass: 'Admin@123' },
                { role: 'HQ Manager', email: 'hq@steakz.com', pass: 'Hq@123' },
                { role: 'Branch Manager', email: 'manager@steakz.com', pass: 'Manager@123' },
                { role: 'Chef', email: 'chef@steakz.com', pass: 'Chef@123' },
                { role: 'Cashier', email: 'cashier@steakz.com', pass: 'Cashier@123' },
                { role: 'Waiter', email: 'waiter@steakz.com', pass: 'Waiter@123' }
              ].map(staff => (
                <div key={staff.role} className="credential-row" onClick={() => { setEmail(staff.email); setPassword(staff.pass); }} style={{ cursor: 'pointer', fontSize: '0.85rem', background: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
                  <strong>{staff.role}:</strong> {staff.email} / {staff.pass}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>;
}
