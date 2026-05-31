import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminApi } from '../services/api';
import { Shield, Users, Trash2, Crown, UserCheck, Search } from 'lucide-react';

interface UserData {
  user_id: number;
  username: string;
  display_name: string;
  email: string;
  role: string;
  tier: string;
  is_verified: boolean;
  created_at: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      const userList = data.users || data || [];
      setUsers(userList);
      const roles: Record<number, string> = {};
      userList.forEach((u: UserData) => {
        roles[u.user_id] = u.role;
      });
      setSelectedRole(roles);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: number) => {
    try {
      await adminApi.updateUserRole(userId, selectedRole[userId]);
      setError('');
      alert('Role updated successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u.user_id !== userId));
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.display_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      moderator: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      basic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${colors[role] || colors.basic}`}>
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Manage users, roles, and permissions</p>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Admins</span>
          </div>
          <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Verified</span>
          </div>
          <p className="text-2xl font-bold text-white">{users.filter(u => u.is_verified).length}</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search users by username, name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-900/80 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((u) => (
              <tr key={u.user_id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                      {u.display_name?.charAt(0) || u.username.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{u.display_name || u.username}</p>
                      <p className="text-gray-500 text-xs">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">{u.email}</td>
                <td className="px-4 py-3">{roleBadge(u.role)}</td>
                <td className="px-4 py-3">
                  <span className="text-gray-400 text-sm capitalize">{u.tier}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRole[u.user_id] || u.role}
                      onChange={(e) => setSelectedRole({ ...selectedRole, [u.user_id]: e.target.value })}
                      className="px-2 py-1 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="basic">Basic</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => updateRole(u.user_id)}
                      className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => deleteUser(u.user_id)}
                      className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
