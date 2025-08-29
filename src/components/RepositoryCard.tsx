import React, { useState } from 'react';
import { Card, Button, Tag, Typography, Space, message } from 'antd';
import {
  StarOutlined,
  ForkOutlined,
  LockOutlined,
  UnlockOutlined,
  BellOutlined,
  BellFilled,
  LinkOutlined,
} from '@ant-design/icons';
import { Repository } from '../services/repositoryService';
import { subscriptionService } from '../services/subscriptionService';

const { Title, Text, Paragraph } = Typography;

interface RepositoryCardProps {
  repository: Repository;
  isSubscribed?: boolean;
  onSubscriptionChange?: () => void;
  showSubscriptionButton?: boolean;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  isSubscribed: initialSubscribed = false,
  onSubscriptionChange,
  showSubscriptionButton = true,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [loading, setLoading] = useState(false);

  const handleSubscriptionToggle = async () => {
    setLoading(true);
    try {
      if (isSubscribed) {
        await subscriptionService.unsubscribe(repository.id);
        message.success('Successfully unsubscribed');
        setIsSubscribed(false);
      } else {
        await subscriptionService.subscribe(repository.id);
        message.success('Successfully subscribed to pull request notifications');
        setIsSubscribed(true);
      }
      onSubscriptionChange?.();
    } catch (error) {
      message.error('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleExternalLink = () => {
    window.open(repository.htmlUrl, '_blank');
  };

  return (
    <Card
      hoverable
      className="h-full"
      actions={[
        showSubscriptionButton && (
          <Button
            type={isSubscribed ? 'default' : 'primary'}
            icon={isSubscribed ? <BellFilled /> : <BellOutlined />}
            loading={loading}
            onClick={handleSubscriptionToggle}
            className="w-full"
            style={{margin: '18px' }}
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe to PRs'}
          </Button>
        ),
        <Button
          type="link"
          icon={<LinkOutlined />}
          onClick={handleExternalLink}
          className="w-full"
          style={{ margin: '18px' }}
        >
          View on GitHub
        </Button>,
      ].filter(Boolean)}
    >
      <Space direction="vertical" className="w-full" size="small">
        <div className="flex justify-between items-start">
          <Title level={5} className="mb-1">
            {repository.name}
          </Title>
          {repository.private ? (
            <LockOutlined className="text-yellow-600" title="Private" />
          ) : (
            <UnlockOutlined className="text-green-600" title="Public" />
          )}
        </div>

        <Text type="secondary" className="text-sm">
          {repository.fullName}
        </Text>

        {repository.description ? (
          <Paragraph className="text-sm text-gray-600 mb-2" ellipsis={{ rows: 2 }}>
            {repository.description}
          </Paragraph>
        ) : <Paragraph className="text-sm text-gray-600 mb-2" ellipsis={{ rows: 2 }}>
            -- No description --
        </Paragraph>}

        <Space size="middle" className="text-sm">
          {repository.language && (
            <Tag color="blue">{repository.language}</Tag>
          )}
          <Space size="small">
            <StarOutlined />
            <Text>{repository.stargazersCount}</Text>
          </Space>
          <Space size="small">
            <ForkOutlined />
            <Text>{repository.forksCount}</Text>
          </Space>
        </Space>
      </Space>
    </Card>
  );
};

export default RepositoryCard;