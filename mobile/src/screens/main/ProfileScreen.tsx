import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Avatar,
  Text as PaperText,
  Button,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { api, endpoints } from '../../services/api';

interface UserStats {
  items: {
    total: number;
    lost: number;
    found: number;
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
  points: number;
}

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await api.get(endpoints.profileStatistics);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderStatCard = (title: string, value: number, color: string = '#8B1538') => (
    <View style={styles.statCard}>
      <PaperText style={styles.statValue}>{value}</PaperText>
      <PaperText style={styles.statTitle}>{title}</PaperText>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B1538" />
          <PaperText style={styles.loadingText}>Loading profile...</PaperText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user?.fullName?.charAt(0) || 'U'}
              style={styles.profileAvatar}
            />
            <View style={styles.profileInfo}>
              <PaperText style={styles.profileName}>
                {user?.fullName || 'User'}
              </PaperText>
              <PaperText style={styles.profileEmail}>
                {user?.email || 'user@university.edu'}
              </PaperText>
              <PaperText style={styles.profileRole}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </PaperText>
              {user?.studentId && (
                <PaperText style={styles.profileId}>
                  ID: {user.studentId}
                </PaperText>
              )}
              {user?.department && (
                <PaperText style={styles.profileDepartment}>
                  {user.department}
                </PaperText>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Points Display */}
        {stats && (
          <Card style={styles.pointsCard}>
            <Card.Content style={styles.pointsContent}>
              <PaperText style={styles.pointsTitle}>Your Points</PaperText>
              <PaperText style={styles.pointsValue}>🏆 {stats.points}</PaperText>
              <PaperText style={styles.pointsDescription}>
                Earn points by reporting found items and helping others!
              </PaperText>
            </Card.Content>
          </Card>
        )}

        {/* Statistics */}
        {stats && (
          <>
            {/* Items Statistics */}
            <Card style={styles.statsCard}>
              <Card.Content>
                <PaperText style={styles.sectionTitle}>Items Reported</PaperText>
                <View style={styles.statsGrid}>
                  {renderStatCard('Total', stats.items.total)}
                  {renderStatCard('Lost', stats.items.lost)}
                  {renderStatCard('Found', stats.items.found)}
                  {renderStatCard('Active', stats.items.active)}
                  {renderStatCard('Claimed', stats.items.claimed)}
                  {renderStatCard('Archived', stats.items.archived)}
                </View>
              </Card.Content>
            </Card>

            {/* Claims Statistics */}
            <Card style={styles.statsCard}>
              <Card.Content>
                <PaperText style={styles.sectionTitle}>Claims Made</PaperText>
                <View style={styles.statsGrid}>
                  {renderStatCard('Total', stats.claims.total)}
                  {renderStatCard('Pending', stats.claims.pending, '#FF9800')}
                  {renderStatCard('Approved', stats.claims.approved, '#4CAF50')}
                  {renderStatCard('Rejected', stats.claims.rejected, '#F44336')}
                </View>
              </Card.Content>
            </Card>
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            style={styles.actionButton}
            buttonColor="#8B1538"
            contentStyle={styles.actionButtonContent}
          >
            Edit Profile
          </Button>
          
          <Button
            mode="outlined"
            style={styles.actionButton}
            textColor="#8B1538"
            buttonColor="transparent"
            contentStyle={styles.actionButtonContent}
          >
            View My Items
          </Button>
          
          <Button
            mode="outlined"
            style={styles.actionButton}
            textColor="#8B1538"
            buttonColor="transparent"
            contentStyle={styles.actionButtonContent}
          >
            View My Claims
          </Button>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#F44336"
            buttonColor="transparent"
            contentStyle={styles.logoutButtonContent}
          >
            Logout
          </Button>
        </View>
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
  profileCard: {
    margin: 16,
    backgroundColor: 'white',
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    backgroundColor: '#8B1538',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#8B1538',
    fontWeight: '500',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  profileDepartment: {
    fontSize: 14,
    color: '#757575',
  },
  pointsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFF3E0',
  },
  pointsContent: {
    alignItems: 'center',
    padding: 20,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 8,
  },
  pointsDescription: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  statsCard: {
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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  actionButtons: {
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  logoutSection: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  logoutButton: {
    borderColor: '#F44336',
    borderRadius: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;
