import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { ManagerDashboard } from './dashboards/ManagerDashboard';
import { StaffDashboard } from './dashboards/StaffDashboard';
import { CustomerDashboard } from './dashboards/CustomerDashboard';
export function DashboardPage() { 
  const { user } = useAuth(); 
  if (!user) return <p>Not logged in.</p>; 
  
  return (
    <div>
      <h1>Dashboard — {user.name} ({user.role})</h1>
      {(user.role === 'ADMIN' || user.role === 'HEADQUARTER_MANAGER') && <AdminDashboard />}
      {user.role === 'BRANCH_MANAGER' && <ManagerDashboard />}
      {['CHEF', 'CASHIER', 'WAITER'].includes(user.role) && <StaffDashboard />}
      {user.role === 'CUSTOMER' && <CustomerDashboard />}
    </div>
  ); 
}
