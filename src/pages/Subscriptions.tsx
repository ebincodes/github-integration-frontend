import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Empty, Spin, Typography, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Subscription, subscriptionService } from '../services/subscriptionService';
import RepositoryCard from '../components/RepositoryCard';
import { Repository } from '../services/repositoryService';

const { Title, Paragraph } = Typography;

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const subs = await subscriptionService.getUserSubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      message.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = () => {
    loadSubscriptions();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BellOutlined className="text-2xl text-blue-500" />
          <div>
            <Title level={2} className="mb-1">Repository Subscriptions</Title>
            <Paragraph className="text-gray-600 mb-0">
              You'll receive email notifications for pull requests in these repositories
            </Paragraph>
          </div>
        </div>
        <Paragraph>
          <strong>{subscriptions.length}</strong> active subscriptions
        </Paragraph>
      </Card>

      {subscriptions.length === 0 ? (
        <Card>
          <Empty
            description={
              <div>
                <Paragraph>You haven't subscribed to any repositories yet.</Paragraph>
                <Paragraph>
                  Visit the <a href="/repositories">Repositories</a> page to subscribe to pull request notifications.
                </Paragraph>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {subscriptions.map((subscription) => (
            <Col xs={24} sm={12} lg={8} key={subscription.id}>
              <RepositoryCard
                repository={subscription.repository as Repository}
                isSubscribed={true}
                onSubscriptionChange={handleUnsubscribe}
                showSubscriptionButton={true}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Subscriptions;