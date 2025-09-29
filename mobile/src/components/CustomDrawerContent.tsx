import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  Avatar,
  Text as PaperText,
  Divider,
  Button,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Avatar.Text
            size={60}
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
            {user?.points !== undefined && (
              <PaperText style={styles.profilePoints}>
                🏆 {user.points} points
              </PaperText>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Navigation Items */}
        <DrawerItemList {...props} />

        <Divider style={styles.divider} />

        {/* Additional Menu Items */}
        <TouchableOpacity style={styles.menuItem}>
          <PaperText style={styles.menuItemText}>📊 Statistics</PaperText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <PaperText style={styles.menuItemText}>⚙️ Settings</PaperText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <PaperText style={styles.menuItemText}>❓ Help & Support</PaperText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <PaperText style={styles.menuItemText}>📋 About ClaimIT</PaperText>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#F44336"
            buttonColor="transparent"
          >
            Logout
          </Button>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileSection: {
    padding: 20,
    backgroundColor: '#8B1538',
  },
  profileAvatar: {
    backgroundColor: 'white',
    alignSelf: 'center',
    marginBottom: 12,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  profilePoints: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  divider: {
    marginVertical: 8,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#424242',
  },
  logoutSection: {
    padding: 20,
    marginTop: 'auto',
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});

export default CustomDrawerContent;
