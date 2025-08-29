import React, { useState } from 'react';
import { Card, Avatar, Typography, Row, Col, Statistic, Space, Divider, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  MailOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const refreshProfile = async () => {
    setLoading(true);
    try {
      await api.get('/user/profile');
      // Update context or refresh page
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8} className="text-center">
            <Avatar
              size={120}
              src={user.avatarUrl}
              icon={<UserOutlined />}
              className="mb-4"
            />
            <Space direction="vertical" size="small">
              <Title level={3} className="ml-5">
                {user.name || user.username}
              </Title>
              <Text type="secondary" className="text-base">
                @{user.username}
              </Text>
              {user.email && (
                <Space>
                  <MailOutlined />
                  <Text>{user.email}</Text>
                </Space>
              )}
            </Space>
          </Col>

          <Col xs={24} md={16}>
            <Space direction="vertical" size="large" className="w-full">
              {user.bio && (
                <div>
                  <Title level={5}>Bio</Title>
                  <Paragraph>{user.bio}</Paragraph>
                </div>
              )}

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Followers"
                    value={user.followers}
                    prefix={<TeamOutlined />}
                    className="text-center"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Following"
                    value={user.following}
                    prefix={<TeamOutlined />}
                    className="text-center"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Public Repos"
                    value={user.publicRepos}
                    prefix={<BookOutlined />}
                    className="text-center"
                  />
                </Col>
              </Row>

              <Divider />

              <Space>
                <Button
                  type="primary"
                  icon={<BookOutlined />}
                  onClick={() => navigate('/repositories')}
                >
                  View Repositories
                </Button>
                <Button
                  icon={<GithubOutlined />}
                  onClick={refreshProfile}
                  loading={loading}
                >
                  Refresh from GitHub
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Title level={4}>Quick Actions</Title>
        <Space wrap>
          <Button
            type="default"
            onClick={() => navigate('/repositories')}
          >
            Browse Repositories
          </Button>
          <Button
            type="default"
            onClick={() => navigate('/subscriptions')}
          >
            Manage Subscriptions
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Profile;