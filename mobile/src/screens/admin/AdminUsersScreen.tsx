import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Card,
  Button,
  Chip,
  Text as PaperText,
  ActivityIndicator,
  Menu,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { api, endpoints } from '../../services/api';

interface User {
  id: string;
  email: string;
  role: 'student' | 'staff' | 'teacher' | 'admin';
  full_name: string;
  student_id?: string;
  department?: string;
  phone?: string;
  points: number;
  created_at: string;
}

const AdminUsersScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'staff' | 'teacher' | 'admin'>('all');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [selectedRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 50 };
      if (selectedRole !== 'all') {
        params.role = selectedRole;
      }

      const response = await api.get(endpoints.adminUsers, { params });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(endpoints.updateUserRole(userId), { role: newRole });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ));
      setMenuVisible(null);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#8B1538';
      case 'teacher': return '#2196F3';
      case 'staff': return '#4CAF50';
      case 'student': return '#FF9800';
      default: return '#757575';
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <Card style={styles.userCard}>
      <Card.Content style={styles.userContent}>
        <View style={styles.userInfo}>
          <PaperText style={styles.userName}>{item.full_name}</PaperText>
          <PaperText style={styles.userEmail}>{item.email}</PaperText>
          {item.student_id && (
            <PaperText style={styles.userId}>ID: {item.student_id}</PaperText>
          )}
          {item.department && (
            <PaperText style={styles.userDepartment}>{item.department}</PaperText>
          )}
          <PaperText style={styles.userDate}>
            Joined: {moment(item.created_at).format('MMM DD, YYYY')}
          </PaperText>
        </View>

        <View style={styles.userActions}>
          <View style={styles.userStats}>
            <PaperText style={styles.userPoints}>🏆 {item.points} pts</PaperText>
            <Chip
              mode="flat"
              style={[styles.roleChip, { backgroundColor: getRoleColor(item.role) }]}
              textStyle={styles.roleChipText}
            >
              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
            </Chip>
          </View>

          <Menu
            visible={menuVisible === item.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuVisible(item.id)}
              >
                <PaperText style={styles.menuButtonText}>⋮</PaperText>
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => handleRoleChange(item.id, 'student')}
              title="Make Student"
              disabled={item.role === 'student'}
            />
            <Menu.Item
              onPress={() => handleRoleChange(item.id, 'staff')}
              title="Make Staff"
              disabled={item.role === 'staff'}
            />
            <Menu.Item
              onPress={() => handleRoleChange(item.id, 'teacher')}
              title="Make Teacher"
              disabled={item.role === 'teacher'}
            />
            <Menu.Item
              onPress={() => handleRoleChange(item.id, 'admin')}
              title="Make Admin"
              disabled={item.role === 'admin'}
            />
          </Menu>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <PaperText style={styles.emptyText}>No users found</PaperText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Role Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'student', 'staff', 'teacher', 'admin'].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterButton,
                selectedRole === role && styles.activeFilterButton
              ]}
              onPress={() => setSelectedRole(role as any)}
            >
              <PaperText style={[
                styles.filterButtonText,
                selectedRole === role && styles.activeFilterButtonText
              ]}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </PaperText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Users List */}
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadUsers}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#8B1538',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  userCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  userContent: {
    flexDirection: 'row',
    padding: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  userDate: {
    fontSize: 12,
    color: '#757575',
  },
  userActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  userStats: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  userPoints: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  roleChip: {
    alignSelf: 'flex-end',
  },
  roleChipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
});

export default AdminUsersScreen;