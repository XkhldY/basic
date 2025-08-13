'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, Users, BarChart3, Settings, Eye, UserX, UserCheck, Search, Shield, Activity, Database, Save } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { UserListItem, PlatformAnalytics } from '@/types/admin';

export default function AdminDashboard() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [settings, setSettings] = useState<any[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsUpdating, setSettingsUpdating] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    } else if (!loading && isAuthenticated && user?.user_type !== 'admin') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.user_type === 'admin') {
      loadInitialData();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'settings' && user?.user_type === 'admin') {
      loadSettings();
    }
  }, [activeTab, user]);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      const [usersResponse, analyticsResponse] = await Promise.all([
        apiClient.get('/api/admin/users?limit=50'),
        apiClient.get('/api/admin/analytics')
      ]);
      setUsers(usersResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await apiClient.get('/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await apiClient.put(`/api/settings/${key}`, { value });
      await loadSettings(); // Refresh settings
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const initializeSettings = async () => {
    setSettingsUpdating(true);
    try {
      await apiClient.post('/api/settings/initialize');
      await loadSettings(); // Refresh settings
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    } finally {
      setSettingsUpdating(false);
    }
  };

  const bulkToggleUsers = async (action: 'activate' | 'deactivate') => {
    if (selectedUsers.length === 0) return;
    
    setBulkUpdating(true);
    try {
      for (const userId of selectedUsers) {
        await apiClient.post(`/api/admin/users/${userId}/toggle-active`);
      }
      setSelectedUsers([]);
      // Refresh users list
      const response = await apiClient.get('/api/admin/users?limit=50');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to bulk update users:', error);
    } finally {
      setBulkUpdating(false);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleUserStatus = async (userId: number) => {
    try {
      await apiClient.post(`/api/admin/users/${userId}/toggle-active`);
      // Refresh users list
      const response = await apiClient.get('/api/admin/users?limit=50');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !userTypeFilter || user.user_type === userTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user.name} ({user.admin_role?.replace('_', ' ') || 'Admin'})
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'users'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              User Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'settings'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
          </nav>
        </div>

        {loadingData ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Loading admin data...</div>
          </div>
        ) : (
          <>
            {/* Analytics Tab */}
            {activeTab === 'dashboard' && analytics && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.user_stats.total_users}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <UserCheck className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.user_stats.active_users}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Activity className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">New This Month</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.user_stats.new_users_this_month}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Database className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Verified Users</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.user_stats.verified_users}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Type Breakdown */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Type Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{analytics.user_stats.candidates}</p>
                      <p className="text-sm text-gray-500">Candidates</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{analytics.user_stats.employers}</p>
                      <p className="text-sm text-gray-500">Employers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{analytics.user_stats.admins}</p>
                      <p className="text-sm text-gray-500">Admins</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                </div>

                {/* Filters and Bulk Actions */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <select
                          value={userTypeFilter}
                          onChange={(e) => setUserTypeFilter(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All User Types</option>
                          <option value="candidate">Candidates</option>
                          <option value="employer">Employers</option>
                          <option value="admin">Admins</option>
                        </select>
                      </div>
                    </div>
                    
                    {selectedUsers.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {selectedUsers.length} selected
                        </span>
                        <button
                          onClick={() => bulkToggleUsers('activate')}
                          disabled={bulkUpdating}
                          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          Bulk Activate
                        </button>
                        <button
                          onClick={() => bulkToggleUsers('deactivate')}
                          disabled={bulkUpdating}
                          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                          Bulk Deactivate
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(filteredUsers.map(user => user.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.user_type === 'employer' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.user_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleUserStatus(user.id)}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded ${
                                  user.is_active
                                    ? 'text-red-700 bg-red-100 hover:bg-red-200'
                                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                                }`}
                              >
                                {user.is_active ? (
                                  <><UserX className="mr-1 h-3 w-3" /> Deactivate</>
                                ) : (
                                  <><UserCheck className="mr-1 h-3 w-3" /> Activate</>
                                )}
                              </button>
                              <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200">
                                <Eye className="mr-1 h-3 w-3" /> View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                  <button
                    onClick={initializeSettings}
                    disabled={settingsUpdating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    {settingsUpdating ? 'Initializing...' : 'Initialize Defaults'}
                  </button>
                </div>

                {settingsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-lg">Loading settings...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Platform Settings */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Platform Settings
                      </h3>
                      <div className="space-y-4">
                        {settings.filter(s => s.category === 'platform').map((setting) => (
                          <div key={setting.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {setting.description || setting.key}
                            </label>
                            {setting.data_type === 'boolean' ? (
                              <select
                                value={setting.value}
                                onChange={(e) => updateSetting(setting.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            ) : (
                              <input
                                type={setting.data_type === 'integer' ? 'number' : 'text'}
                                value={setting.value || ''}
                                onChange={(e) => updateSetting(setting.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Enter ${setting.description || setting.key}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Security Settings
                      </h3>
                      <div className="space-y-4">
                        {settings.filter(s => s.category === 'security').map((setting) => (
                          <div key={setting.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {setting.description || setting.key}
                            </label>
                            {setting.data_type === 'boolean' ? (
                              <select
                                value={setting.value}
                                onChange={(e) => updateSetting(setting.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            ) : (
                              <input
                                type={setting.data_type === 'integer' ? 'number' : 'text'}
                                value={setting.value || ''}
                                onChange={(e) => updateSetting(setting.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Enter ${setting.description || setting.key}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Email Settings */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        Email Settings
                      </h3>
                      <div className="space-y-4">
                        {settings.filter(s => s.category === 'email').map((setting) => (
                          <div key={setting.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {setting.description || setting.key}
                            </label>
                            {setting.data_type === 'boolean' ? (
                              <select
                                value={setting.value}
                                onChange={(e) => updateSetting(setting.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            ) : (
                              <input
                                type={setting.data_type === 'integer' ? 'number' : 'text'}
                                value={setting.value || ''}
                                onChange={(e) => updateSetting(setting.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Enter ${setting.description || setting.key}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* UI Settings */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        UI Settings
                      </h3>
                      <div className="space-y-4">
                        {settings.filter(s => s.category === 'ui').map((setting) => (
                          <div key={setting.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {setting.description || setting.key}
                            </label>
                            <input
                              type={setting.key.includes('color') ? 'color' : 'text'}
                              value={setting.value || ''}
                              onChange={(e) => updateSetting(setting.key, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter ${setting.description || setting.key}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}