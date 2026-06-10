import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';

interface SaleItem {
  id: number;
  menuItem: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  item?: { name: string };
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  branch: { name: string };
  items: SaleItem[];
}

export function CustomerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/api/sales/mine')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="grid">
        {/* Quick Actions */}
        <div className="form-card">
          <h2>Customer Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="/#menu" className="btn btn-full btn-primary" style={{ textDecoration: 'none' }}>Start New Order</a>
            <a href="/#feedback" className="btn btn-full btn-dark" style={{ textDecoration: 'none' }}>Leave Branch Feedback</a>
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <h3>Your Experience Matters</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
              We value your dining experience! Share your thoughts with us to help us improve.
            </p>
            <a href="/#feedback" className="btn btn-sm btn-primary" style={{ marginTop: '10px', textDecoration: 'none', display: 'inline-block' }}>
              Review Your Visit
            </a>
          </div>
        </div>

        {/* Orders Section */}
        <div className="table-card">
          <h2>My Order History</h2>
          <div className="order-list" style={{ marginTop: '15px' }}>
            {loading ? <p>Loading orders...</p> : 
             orders.length === 0 ? <p className="empty-state">No orders found. Why not start one today?</p> :
             orders.map(order => (
              <div key={order.id} className="card" style={{ marginBottom: '15px', borderLeft: '5px solid #e63946', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{order.orderNumber}</strong>
                  <span className={`status-tag ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                  <p style={{ margin: '4px 0' }}>📍 <strong>Branch:</strong> {order.branch.name}</p>
                  <p style={{ margin: '4px 0' }}>📅 <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <div style={{ marginTop: '10px', background: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>{item.quantity}x {item.item?.name || item.menuItem}</span>
                        <span>£{item.lineTotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '1rem', color: '#1a1a1a', marginTop: '10px', fontWeight: 'bold' }}>
                    Total Amount: £{order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
        .preparing { background: #17a2b8; color: white; }
        .ready { background: #28a745; color: white; }
        .completed { background: #6c757d; color: white; }
        
        .btn-outline-dark { border: 1px solid #333; color: #333; background: transparent; }
        .btn-outline-dark:hover { background: #333; color: white; }
        .btn-dark { background: #1a1a1a; color: white; }
      `}</style>
    </div>
  );
}
