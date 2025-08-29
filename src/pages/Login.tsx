import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const handleGitHubLogin = () => {
    window.location.href = process.env.REACT_APP_GITHUB_AUTH_URL || 'http://localhost:3001/auth/github';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <Space direction="vertical" size="large" className="w-full text-center">
          <div>
            <GithubOutlined className="text-6xl text-gray-700 mb-4" />
            <Title level={2} className="mb-2">GitHub Integration</Title>
            <Paragraph className="text-gray-600">
              Connect your GitHub account to manage repositories and receive pull request notifications.
            </Paragraph>
          </div>

          <Space direction="vertical" size="middle" className="w-full">
            <Button
              type="primary"
              size="large"
              icon={<GithubOutlined />}
              onClick={handleGitHubLogin}
              className="w-full h-12"
            >
              Sign in with GitHub
            </Button>
            
            <div className="text-center">
              <Paragraph className="text-sm text-gray-500 mb-0">
                By signing in, you agree to grant access to your GitHub repositories.
              </Paragraph>
            </div>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default Login;