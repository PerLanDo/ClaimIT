import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Card,
  Text as PaperText,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, endpoints } from '../../services/api';

interface DashboardStats {
  items: {
    total: number;
    active: number;
    claimed: number;
    archived: number;
  };
  claims: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  users: {
    total: number;
    students: number;
    staff: number;
    teachers: number;
    admins: number;
  };
  categories: Record<string, any>;
  recentActivity: any[];
}

const AdminDashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await api.get(endpoints.adminDashboard);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (title: string, value: number, color: string = '#8B1538') => (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statCardContent}>
        <PaperText style={[styles.statValue, { color }]}>{value}</PaperText>
        <PaperText style={styles.statTitle}>{title}</PaperText>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B1538" />
          <PaperText style={styles.loadingText}>Loading dashboard...</PaperText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <PaperText style={styles.welcomeTitle}>Admin Dashboard</PaperText>
            <PaperText style={styles.welcomeSubtitle}>
              Manage lost and found items, review claims, and oversee user activity
            </PaperText>
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        {stats && (
          <>
            {/* Items Overview */}
            <Card style={styles.sectionCard}>
              <Card.Content>
                <PaperText style={styles.sectionTitle}>Items Overview</PaperText>
                <View style={styles.statsGrid}>
                  {renderStatCard('Total Items', stats.items.total)}
                  {renderStatCard('Active', stats.items.active, '#4CAF50')}
                  {renderStatCard('Claimed', stats.items.claimed, '#FF9800')}
                  {renderStatCard('Archived', stats.items.archived, '#757575')}
                </View>
              </Card.Content>
            </Card>

            {/* Claims Overview */}
            <Card style={styles.sectionCard}>
              <Card.Content>
                <PaperText style={styles.sectionTitle}>Claims Overview</PaperText>
                <View style={styles.statsGrid}>
                  {renderStatCard('Total Claims', stats.claims.total)}
                  {renderStatCard('Pending', stats.claims.pending, '#FF9800')}
                  {renderStatCard('Approved', stats.claims.approved, '#4CAF50')}
                  {renderStatCard('Rejected', stats.claims.rejected, '#F44336')}
                </View>
              </Card.Content>
            </Card>

            {/* Users Overview */}
            <Card style={styles.sectionCard}>
              <Card.Content>
                <PaperText style={styles.sectionTitle}>Users Overview</PaperText>
                <View style={styles.statsGrid}>
                  {renderStatCard('Total Users', stats.users.total)}
                  {renderStatCard('Students', stats.users.students)}
                  {renderStatCard('Staff', stats.users.staff)}
                  {renderStatCard('Teachers', stats.users.teachers)}
                </View>
              </Card.Content>
            </Card>

            {/* Category Breakdown */}
            <Card style={styles.sectionCard}>
              <Card.Content>
                <PaperText style={styles.sectionTitle}>Items by Category</PaperText>
                {Object.entries(stats.categories).map(([category, data]: [string, any]) => (
                  <View key={category} style={styles.categoryRow}>
                    <PaperText style={styles.categoryName}>{category}</PaperText>
                    <PaperText style={styles.categoryCount}>{data.total}</PaperText>
                  </View>
                ))}
              </Card.Content>
            </Card>

            {/* Recent Activity */}
            <Card style={styles.sectionCard}>
              <Card.Content>
                <PaperText style={styles.sectionTitle}>Recent Activity</PaperText>
                {stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <View key={index} style={styles.activityRow}>
                    <PaperText style={styles.activityText}>
                      {activity.title} - {activity.poster.full_name}
                    </PaperText>
                    <PaperText style={styles.activityDate}>
                      {new Date(activity.created_at).toLocaleDateString()}
                    </PaperText>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
  },
  welcomeCard: {
    margin: 16,
    backgroundColor: '#8B1538',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  statCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryName: {
    fontSize: 14,
    color: '#424242',
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B1538',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activityText: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
  },
  activityDate: {
    fontSize: 12,
    color: '#757575',
  },
});

export default AdminDashboardScreen;
