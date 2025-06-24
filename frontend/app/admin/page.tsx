import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel. Manage your application here.</p>
      <div>
        <button style={{ marginRight: '10px' }}>Manage Users</button>
        <button>Manage Rooms</button>
      </div>
    </div>
  );
};

export default AdminPage;