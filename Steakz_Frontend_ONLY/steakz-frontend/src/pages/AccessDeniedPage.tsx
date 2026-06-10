import { Link } from 'react-router-dom';

export default function AccessDeniedPage() {
  return (
    <div className="error-page" style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/dashboard" className="btn">Back to Dashboard</Link>
    </div>
  );
}
