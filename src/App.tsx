import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile';
import Repositories from './pages/Repositories';
import Subscriptions from './pages/Subscriptions';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const { Content } = Layout;

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout className="min-h-screen">
      {user && <Navbar />}
      <Content className={user ? "p-6" : ""}>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/profile" replace />} 
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/repositories" 
            element={user ? <Repositories /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/subscriptions" 
            element={user ? <Subscriptions /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/profile" : "/login"} replace />} 
          />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;