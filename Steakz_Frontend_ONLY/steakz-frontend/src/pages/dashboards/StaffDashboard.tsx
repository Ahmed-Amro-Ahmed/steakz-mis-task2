import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

interface Item { id: number; name: string; quantity: number; unit: string; reorderLevel: number }
interface Sale { 
  id: number; 
  orderNumber: string; 
  totalAmount: number; 
  status: string; 
  createdAt: string; 
  createdBy?: { name: string };
  items: Array<{ menuItem: string; quantity: number; lineTotal: number }> 
}

export function StaffDashboard() {
  const { user } = useAuth();
  const isChef = user?.role === 'CHEF';
  const isCashierOrWaiter = ['CASHIER', 'WAITER'].includes(user?.role || '');
  const [items, setItems] = useState<Item[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [menuItem, setMenuItem] = useState('Steak Meal');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('18.99');
  const [msg, setMsg] = useState('');

  const myRecentSales = sales
    .filter(s => s.createdBy?.name === user?.name)
    .slice(0, 5);

  async function fetchData() {
    try {
      const [i, s] = await Promise.all([
        axiosInstance.get('/api/inventory'),
        axiosInstance.get('/api/sales/mine')
      ]);
      setItems(i.data);
      setSales(s.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  useEffect(() => { void fetchData() }, []);

  async function recordSale(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    await axiosInstance.post('/api/sales', { items: [{ menuItem, quantity: Number(quantity), unitPrice: Number(unitPrice) }] });
    setMsg('Transaction recorded successfully.');
    await fetchData();
  }

  async function updateStatus(id: number, status: string) {
    await axiosInstance.patch(`/api/sales/${id}/status`, { status });
    await fetchData();
  }

  async function useStock(id: number) {
    await axiosInstance.patch(`/api/inventory/${id}/quantity`, { quantity: items.find(i => i.id === id)!.quantity - 1 });
    await fetchData();
  }

  return (
    <div className="dashboard-container">
      <div className="section-header">
        <h2>{isChef ? `Kitchen Orders — ${user?.branch || 'Local'}` : `${user?.role} Terminal — ${user?.branch || 'Local'}`}</h2>
      </div>
      <div className="grid">
        {/* POS Section - Visible to Cashiers and Waiters */}
        {isCashierOrWaiter && (
          <div className="form-card">
            <h2>Record Customer Sale</h2>
            {msg && <div className="success-message">{msg}</div>}
            <form onSubmit={recordSale}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Menu Item</label>
                <input value={menuItem} onChange={e => setMenuItem(e.target.value)} placeholder="e.g. Ribeye Steak" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Quantity</label>
                  <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Unit Price (£)</label>
                  <input type="number" step="0.01" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} required />
                </div>
              </div>
              <button className="btn btn-full">Submit Transaction</button>
            </form>

            <div style={{ marginTop: '30px' }}>
              <h3>My Recent Transactions</h3>
              {myRecentSales.length === 0 ? <p className="empty-state">No sales recorded yet.</p> :
                myRecentSales.map(s => (
                  <div key={s.id} className="card" style={{ marginBottom: '8px', padding: '10px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{s.orderNumber}</strong>
                      <span className={`status-tag ${s.status.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '2px 5px' }}>{s.status}</span>
                    </div>
                    <div style={{ color: '#555', marginTop: '5px' }}>
                      {s.items[0]?.menuItem} (x{s.items[0]?.quantity}) — £{s.totalAmount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px' }}>
                      {new Date(s.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* Order Pipeline - Visible to Chefs, Managers, and Cashiers (to Complete) */}
        {['CHEF', 'BRANCH_MANAGER', 'CASHIER', 'WAITER'].includes(user?.role || '') && (
          <div className="table-card">
            <h2>Orders Pipeline</h2>
            {sales.filter(s => s.status !== 'COMPLETED').length === 0 ? <p className="empty-state">No active orders.</p> :
              <table className="table">
                <thead><tr><th>Order #</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {sales.filter(s => s.status !== 'COMPLETED').map(s => (
                    <tr key={s.id}>
                      <td>{s.orderNumber}</td>
                      <td><span className={`status-tag ${s.status.toLowerCase()}`}>{s.status}</span></td>
                      <td>
                        {s.status === 'PENDING' && isChef && <button className="btn small" onClick={() => updateStatus(s.id, 'PREPARING')}>Mark Preparing</button>}
                        {s.status === 'PREPARING' && isChef && <button className="btn small" onClick={() => updateStatus(s.id, 'READY')}>Mark Ready</button>}
                        {s.status === 'READY' && isChef && <span className="ready-text" style={{ color: '#28a745', fontWeight: '600', fontSize: '0.85rem' }}>Waiting for pickup</span>}
                        {s.status === 'READY' && isCashierOrWaiter && <button className="btn small" onClick={() => updateStatus(s.id, 'COMPLETED')}>Mark Completed</button>}
                        {(s.status === 'PENDING' || s.status === 'PREPARING') && isCashierOrWaiter && <span style={{ fontSize: '0.8rem', color: '#888' }}>In Kitchen</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        )}

        <div className="table-card">
          <h2>{user?.role === 'CASHIER' ? 'Branch Stock Overview' : (isCashierOrWaiter ? 'Stock Awareness' : 'Stock Inventory')}</h2>
          {items.length === 0 ? <p className="empty-state">No stock items available.</p> :
            <table className="table">
              <thead><tr><th>Item</th><th>Qty</th>{(!isChef && !isCashierOrWaiter) && <th>Action</th>}</tr></thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} className={i.quantity <= i.reorderLevel ? 'warning-row' : ''}>
                    <td>{i.name}</td>
                    <td>{i.quantity} {i.unit}</td>
                    {(!isChef && !isCashierOrWaiter) && <td><button className="btn small" onClick={() => void useStock(i.id)}>Use 1</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      </div>

      <style>{`
        .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
        .pending { background: #ffc107; color: black; }
        .preparing { background: #17a2b8; color: white; }
        .ready { background: #28a745; color: white; }
        .completed { background: #6c757d; color: white; }
      `}</style>
    </div>
  );
}
