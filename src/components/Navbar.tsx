import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, GithubOutlined, BookOutlined, BellOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: () => {
          logout();
          navigate('/login');
        },
      },
    ],
  };

  const navItems = [
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: '/repositories',
      icon: <BookOutlined />,
      label: 'Repositories',
    },
    {
      key: '/subscriptions',
      icon: <BellOutlined />,
      label: 'Subscriptions',
    },
  ];

  return (
    <Header className="flex justify-between items-center bg-white shadow-sm border-b px-6">
      <div className="flex items-center">
        <GithubOutlined className="text-2xl mr-3 text-gray-700" />
        <Text strong className="text-lg text-gray-800">
          GitHub Integration
        </Text>
      </div>

      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={navItems}
        onClick={({ key }) => navigate(key)}
        className="border-0 flex-1 justify-center"
      />

      <Space>
        <Text className="text-gray-600">Welcome, {user?.name || user?.username}</Text>
        <Dropdown menu={userMenu} placement="bottomRight">
          <Avatar
            src={user?.avatarUrl}
            icon={<UserOutlined />}
            className="cursor-pointer"
          />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default Navbar;