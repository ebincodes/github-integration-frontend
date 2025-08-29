import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Input, Select, Space, message, Empty, Spin } from 'antd';
import { SyncOutlined, SearchOutlined } from '@ant-design/icons';
import { Repository, repositoryService } from '../services/repositoryService';
import { subscriptionService } from '../services/subscriptionService';
import RepositoryCard from '../components/RepositoryCard';

const { Search } = Input;
const { Option } = Select;

const Repositories: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  useEffect(() => {
    loadRepositories();
    loadSubscriptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [repositories, searchTerm, visibilityFilter, languageFilter]);

  const loadRepositories = async () => {
    try {
      const repos = await repositoryService.getUserRepositories();
      setRepositories(repos);
    } catch (error) {
      message.error('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const subs = await subscriptionService.getUserSubscriptions();
      const subIds = new Set(subs.map(sub => sub.repositoryId));
      setSubscriptions(subIds);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  };

  const syncRepositories = async () => {
    setSyncing(true);
    try {
      const repos = await repositoryService.syncRepositories();
      setRepositories(repos);
      message.success(`Synced ${repos.length} repositories from GitHub`);
    } catch (error) {
      message.error('Failed to sync repositories');
    } finally {
      setSyncing(false);
    }
  };

  const applyFilters = () => {
    let filtered = repositories;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Visibility filter
    if (visibilityFilter !== 'all') {
      filtered = filtered.filter(repo =>
        visibilityFilter === 'private' ? repo.private : !repo.private
      );
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(repo => repo.language === languageFilter);
    }

    setFilteredRepos(filtered);
  };

  const getUniqueLanguages = () => {
    const languages = repositories
      .map(repo => repo.language)
      .filter((lang): lang is string => Boolean(lang))
      .filter((lang, index, arr) => arr.indexOf(lang) === index)
      .sort();
    return languages;
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">My Repositories</h2>
            <p className="text-gray-600">
              {repositories.length} repositories • {subscriptions.size} subscriptions
            </p>
          </div>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={syncRepositories}
            loading={syncing}
          >
            Sync from GitHub
          </Button>
        </div>
      </Card>

      <Card className="mb-6">
        <Space direction="vertical" className="w-full" size="middle">
          <Search
            placeholder="Search repositories..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            allowClear
          />
          <Space wrap>
            <Select
              value={visibilityFilter}
              onChange={setVisibilityFilter}
              style={{ width: 120 }}
            >
              <Option value="all">All</Option>
              <Option value="public">Public</Option>
              <Option value="private">Private</Option>
            </Select>
            {/* <Select
              value={languageFilter}
              onChange={setLanguageFilter}
              style={{ width: 150 }}
            >
              <Option value="all">All Languages</Option>
              {getUniqueLanguages().map(lang => (
                <Option key={lang} value={lang}>{lang}</Option>
              ))}
            </Select> */}
          </Space>
        </Space>
      </Card>

      {filteredRepos.length === 0 ? (
        <Empty
          description="No repositories found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredRepos.map((repo) => (
            <Col xs={24} sm={12} lg={8} key={repo.id}>
              <RepositoryCard
                repository={repo}
                isSubscribed={subscriptions.has(repo.id)}
                onSubscriptionChange={() => {
                  loadSubscriptions();
                }}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Repositories;