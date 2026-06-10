import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

interface Stats{totalItems:number;lowStock:number;staff:number;orders:number;revenue:number;stockMovements:number}
interface Item{id:number;name:string;category:string;unit:string;quantity:number;reorderLevel:number;costPerUnit:number}
interface Staff{id:number;name:string;email:string;isActive:boolean}
interface Activity { id: string; type: string; details: string; time: string }

export function ManagerDashboard(){
 const { user } = useAuth();
 const [stats,setStats]=useState<Stats|null>(null); 
 const [items,setItems]=useState<Item[]>([]); 
 const [staff,setStaff]=useState<Staff[]>([]); 
 const [activities, setActivities] = useState<Activity[]>([]);
 const [activeTab,setActiveTab]=useState<'overview'|'inventory'|'staff'>('overview'); 
 const [msg,setMsg]=useState('');
 
 const [name,setName]=useState(''); const [category,setCategory]=useState(''); const [unit,setUnit]=useState('kg'); const [quantity,setQuantity]=useState(''); const [reorderLevel,setReorderLevel]=useState(''); const [cost,setCost]=useState('');
 const [staffName,setStaffName]=useState(''); const [staffEmail,setStaffEmail]=useState(''); const [staffPassword,setStaffPassword]=useState('');
 
 async function fetchData(){ 
   const [d,i,s, sales] = await Promise.all([
     axiosInstance.get('/api/manager/dashboard'),
     axiosInstance.get('/api/inventory'),
     axiosInstance.get('/api/manager/staff'),
     axiosInstance.get('/api/manager/sales')
   ]); 
   setStats(d.data); 
   setItems(i.data); 
   setStaff(s.data); 

   // Generate realistic activity from real sales + stock
   const acts: Activity[] = sales.data.slice(0, 3).map((sale: any) => ({
     id: `sale-${sale.id}`,
     type: 'SALE',
     details: `New sale recorded — ${sale.orderNumber} — £${sale.totalAmount.toFixed(2)}`,
     time: new Date(sale.createdAt).toLocaleTimeString()
   }));
   
   const lowStockItems = i.data.filter((item: any) => item.quantity <= item.reorderLevel);
   lowStockItems.forEach((item: any) => {
     acts.push({ 
       id: `alert-${item.id}`, 
       type: 'ALERT', 
       details: `Low stock warning — ${item.name}`, 
       time: 'Just now' 
     });
   });

   setActivities(acts);
 }

 useEffect(()=>{void fetchData()},[]);

 async function addItem(e:React.FormEvent){e.preventDefault(); await axiosInstance.post('/api/inventory',{name,category,unit,quantity:Number(quantity),reorderLevel:Number(reorderLevel),costPerUnit:Number(cost)}); setMsg('Inventory item added.'); setName(''); setCategory(''); setQuantity(''); setReorderLevel(''); setCost(''); await fetchData();}
 async function addMovement(id:number,type:string,amount:string){await axiosInstance.patch(`/api/inventory/${id}/movement`,{type,quantity:Number(amount),note:'Updated from manager dashboard'}); await fetchData();}
 async function addStaff(e:React.FormEvent){e.preventDefault(); await axiosInstance.post('/api/manager/staff',{name:staffName,email:staffEmail,password:staffPassword}); setMsg('Staff account created.'); setStaffName(''); setStaffEmail(''); setStaffPassword(''); await fetchData();}    
 
 return <div className="dashboard-container">
  <div className="section-header" style={{ marginBottom: '10px' }}>
    <h1 style={{ fontSize: '1.5rem', color: '#e63946' }}>Managing: {user?.branch || 'All Operations'}</h1>
  </div>

  <div className="tabs">
    <button className={`tab ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}>Branch Reports</button>
    <button className={`tab ${activeTab==='inventory'?'active':''}`} onClick={()=>setActiveTab('inventory')}>Inventory Management</button>
    <button className={`tab ${activeTab==='staff'?'active':''}`} onClick={()=>setActiveTab('staff')}>Staff Management</button>
  </div>
  
  {msg&&<div className="success-message">{msg}</div>}

  {activeTab==='overview'&&<div>
    <div className="section-header"><h2>Branch Performance Overview</h2></div>
    {stats ? <div className="stats-grid">
      <div className="stat-card"><h3>Total Revenue</h3><p style={{ color: '#2e7d32', fontWeight: 'bold' }}>£{stats.revenue.toFixed(2)}</p></div>
      <div className="stat-card"><h3>Total Orders</h3><p>{stats.orders}</p></div>
      <div className="stat-card"><h3>Stock Items</h3><p>{stats.totalItems}</p></div>
      <div className="stat-card"><h3>Low Stock</h3><p style={{color: stats.lowStock > 0 ? '#d32f2f' : 'inherit', fontWeight: stats.lowStock > 0 ? 'bold' : 'normal'}}>{stats.lowStock}</p></div>
      <div className="stat-card"><h3>Active Staff</h3><p>{stats.staff}</p></div>
    </div> : <p className="empty-state">Loading branch statistics...</p>}
    
    <div className="card" style={{marginTop:'25px'}}>
      <h3>Recent Branch Activity</h3>
      {activities.length === 0 ? <p className="empty-state">No recent activity recorded.</p> : (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
          {activities.map(act => (
            <li key={act.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <strong style={{ color: act.type === 'ALERT' ? '#d32f2f' : '#333' }}>[{act.type}]</strong> {act.details}
              </span>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>{act.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>}

  {activeTab==='inventory'&&<div>
    <div className="section-header"><h2>Inventory Control</h2></div>
    <div className="grid">
      <div className="form-card"><h2>Add Inventory Item</h2><form onSubmit={addItem}><input placeholder="Item name" value={name} onChange={e=>setName(e.target.value)} required/><input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required/><input placeholder="Unit (e.g. kg, pcs)" value={unit} onChange={e=>setUnit(e.target.value)} required/><input placeholder="Starting Quantity" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} required/><input placeholder="Reorder level" type="number" value={reorderLevel} onChange={e=>setReorderLevel(e.target.value)} required/><input placeholder="Cost per unit" type="number" value={cost} onChange={e=>setCost(e.target.value)} required/><button className="btn">Add Item</button></form></div>
      <div className="table-card"><h2>Current Inventory</h2>
        {items.length === 0 ? <p className="empty-state">Inventory is empty. Add items to track stock.</p> :
        <table className="table"><thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Reorder</th><th>Action</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className={i.quantity<=i.reorderLevel?'warning-row':''}><td>{i.name}</td><td>{i.category}</td><td>{i.quantity} {i.unit}</td><td>{i.reorderLevel}</td><td><button className="btn small" onClick={()=>void addMovement(i.id,'PURCHASE','5')}>+5</button><button className="btn small secondary" onClick={()=>void addMovement(i.id,'USAGE','1')}>-1</button></td></tr>)}</tbody></table>
        }
      </div>
    </div>
  </div>}

  {activeTab==='staff'&&<div>
    <div className="section-header"><h2>Branch Staff Directory</h2></div>
    <div className="grid">
      <div className="form-card"><h2>Create Staff Account</h2><form onSubmit={addStaff}><input placeholder="Name" value={staffName} onChange={e=>setStaffName(e.target.value)} required/><input placeholder="Email" type="email" value={staffEmail} onChange={e=>setStaffEmail(e.target.value)} required/><input placeholder="Password" value={staffPassword} onChange={e=>setStaffPassword(e.target.value)} required/><button className="btn">Create Staff</button></form></div>
      <div className="table-card"><h2>Active Personnel</h2>
        {staff.length === 0 ? <p className="empty-state">No staff accounts found for this branch.</p> :
        <div className="staff-list">{staff.map(s=><div key={s.id} className="card" style={{marginBottom:'10px', padding:'10px 15px', display:'flex', justifyContent:'space-between', alignItems:'center'}}><span><strong>{s.name}</strong> ({s.email})</span> <span style={{color: s.isActive ? '#1b6b1b' : '#7a1111'}}>{s.isActive?'Active':'Inactive'}</span></div>)}</div>
        }
      </div>
    </div>
  </div>}
 </div>;
}
