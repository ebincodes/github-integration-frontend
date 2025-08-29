import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      login(token)
        .then(() => {
          navigate('/profile');
        })
        .catch(() => {
          message.error('Login failed. Please try again.');
          navigate('/login');
        });
    } else {
      message.error('Authentication failed. No token received.');
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return <LoadingSpinner />;
};

export default AuthCallback;