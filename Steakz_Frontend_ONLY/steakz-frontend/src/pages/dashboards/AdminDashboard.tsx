import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

interface Branch { id:number; name:string; location:string; phone?:string; isActive:boolean; _count:{users:number; inventory:number; sales:number} }
interface User { id:number; name:string; email:string; role:string; isActive:boolean; branch?:{name:string} }
interface Overview { branches:number; users:number; inventory:number; lowStock:number; orders:number; revenue:number }

export function AdminDashboard(){
 const { user } = useAuth();
 const isAdmin = user?.role === 'ADMIN';
 const [branches,setBranches]=useState<Branch[]>([]); 
 const [users,setUsers]=useState<User[]>([]); 
 const [overview, setOverview]=useState<Overview | null>(null);
 const [activeTab,setActiveTab]=useState<'branches'|'users'|'permissions'>('branches'); 
 const [msg,setMsg]=useState('');
 
 const [branchName,setBranchName]=useState(''); const [location,setLocation]=useState(''); const [phone,setPhone]=useState(''); const [managerName,setManagerName]=useState(''); const [managerEmail,setManagerEmail]=useState(''); const [managerPassword,setManagerPassword]=useState(''); 
 
 async function fetchData(){ 
   const [b,u,o] = await Promise.all([
     axiosInstance.get('/api/admin/branches'),
     axiosInstance.get('/api/admin/users'),
     axiosInstance.get('/api/admin/overview')
   ]); 
   setBranches(b.data); 
   setUsers(u.data);
   setOverview(o.data);
 }

 useEffect(()=>{void fetchData()},[]);

 async function createBranch(e:React.FormEvent){ 
   e.preventDefault(); 
   setMsg(''); 
   try{ 
     await axiosInstance.post('/api/admin/branches',{branchName,location,phone,managerName,managerEmail,managerPassword}); 
     setMsg('Branch and manager created.'); 
     setBranchName(''); setLocation(''); setPhone(''); setManagerName(''); setManagerEmail(''); setManagerPassword(''); 
     await fetchData(); 
   }catch{ 
     setMsg('Could not create branch. Manager email may already exist.'); 
   }
 }

 async function toggleUser(id:number,active:boolean){ 
   await axiosInstance.patch(`/api/admin/users/${id}/${active?'terminate':'activate'}`); 
   await fetchData(); 
 }

 return <div className="dashboard-container">
  {/* Summary Cards */}
  <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ fontSize: '0.9rem', color: '#666' }}>Total Branches</h3>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{overview?.branches || 0}</p>
    </div>
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ fontSize: '0.9rem', color: '#666' }}>Total Revenue</h3>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2e7d32' }}>£{overview?.revenue?.toFixed(2) || '0.00'}</p>
    </div>
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ fontSize: '0.9rem', color: '#666' }}>Total Orders</h3>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{overview?.orders || 0}</p>
    </div>
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ fontSize: '0.9rem', color: '#666' }}>Inventory Items</h3>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{overview?.inventory || 0}</p>
    </div>
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ fontSize: '0.9rem', color: '#666' }}>Active Users</h3>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{overview?.users || 0}</p>
    </div>
    <div className="card" style={{ borderLeft: '4px solid #d32f2f', textAlign: 'center' }}>
      <h3 style={{ fontSize: '0.9rem', color: '#666' }}>Low Stock Alert</h3>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#d32f2f' }}>{overview?.lowStock || 0}</p>
    </div>
  </div>

  <div className="tabs">
    <button className={`tab ${activeTab==='branches'?'active':''}`} onClick={()=>setActiveTab('branches')}>Branches</button>
    <button className={`tab ${activeTab==='users'?'active':''}`} onClick={()=>setActiveTab('users')}>Users</button>
    <button className={`tab ${activeTab==='permissions'?'active':''}`} onClick={()=>setActiveTab('permissions')}>Role Access Panel</button>
  </div>
  
  {msg&&<div className="success-message">{msg}</div>}

  {activeTab==='branches'&&<div>
    <div className="section-header">
      <h2>{isAdmin ? 'System Branch Management' : 'All Branch Performance Overview'}</h2>
    </div>
    <div className={isAdmin ? 'grid' : 'full-width'}>
      {isAdmin && (
        <div className="form-card">
          <h2>Create Branch + Manager</h2>
          <form onSubmit={createBranch}>
            <input placeholder="Branch name" value={branchName} onChange={e=>setBranchName(e.target.value)} required/>
            <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} required/>
            <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)}/>
            <input placeholder="Manager name" value={managerName} onChange={e=>setManagerName(e.target.value)} required/>
            <input placeholder="Manager email" type="email" value={managerEmail} onChange={e=>setManagerEmail(e.target.value)} required/>
            <input placeholder="Manager password" value={managerPassword} onChange={e=>setManagerPassword(e.target.value)} required/>
            <button className="btn">Create</button>
          </form>
        </div>
      )}
      <div className="table-card">
        <h2>{isAdmin ? 'Registered Branches' : 'Branch Performance Comparison'}</h2>
        {branches.length === 0 ? <p className="empty-state">No branches found.</p> :
        <table className="table">
          <thead>
            <tr>
              <th>Branch Name</th>
              <th>Location</th>
              <th>Users</th>
              <th>Stock Items</th>
              <th>Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(b=>(
              <tr key={b.id}>
                <td><strong>{b.name}</strong></td>
                <td>{b.location}</td>
                <td>{b._count.users}</td>
                <td>{b._count.inventory}</td>
                <td>{b._count.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
        }
      </div>
    </div>
  </div>}

  {activeTab==='users'&&<div className="table-card">
    <div className="section-header"><h2>User Account Control</h2></div>
    {users.length === 0 ? <p className="empty-state">No users registered in the system.</p> :
    <table className="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Active</th>{isAdmin && <th>Action</th>}</tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.branch?.name||'-'}</td><td>{u.isActive?'Yes':'No'}</td>{isAdmin && <td><button className="btn small" onClick={()=>void toggleUser(u.id,u.isActive)}>{u.isActive?'Terminate':'Activate'}</button></td>}</tr>)}</tbody></table>
    }
  </div>}

  {activeTab==='permissions'&&<div className="card">
    <div className="section-header"><h2>Role Access Matrix</h2></div>
    <p>This panel outlines the granular access levels for each role within the Steakz MIS.</p>
    <div style={{ overflowX: 'auto' }}>
      <table className="permission-matrix" style={{ minWidth: '800px', fontSize: '0.9rem' }}>
        <thead>
          <tr>
            <th>Feature / Permission</th>
            <th>Admin</th>
            <th>HQ Manager</th>
            <th>Branch Manager</th>
            <th>Chef</th>
            <th>Cashier</th>
            <th>Waiter</th>
            <th>Customer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Create/Manage Branches</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>System-wide Statistics</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>Manage Users/Roles</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>View Own Branch Reports</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>Manage Branch Inventory</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>View Stock Awareness</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>Kitchen Order Preparation</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>Record Customer Sales</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>Complete Ready Orders</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="check">✔</td>
            <td className="check">✔</td>
            <td className="cross">✘</td>
          </tr>
          <tr>
            <td>Browse Menu / Leave Feedback</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="cross">✘</td>
            <td className="check">✔</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>}
 </div>;
}

