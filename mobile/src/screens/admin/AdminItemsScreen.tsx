import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
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
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { api, endpoints } from '../../services/api';

interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  image_urls: string[];
  status: 'active' | 'claimed' | 'archived';
  created_at: string;
  categories: {
    name: string;
    icon: string;
  };
  poster: {
    id: string;
    full_name: string;
    role: string;
    email: string;
  };
  claimed_by_user?: {
    id: string;
    full_name: string;
    role: string;
    email: string;
  };
}

const AdminItemsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'claimed' | 'archived'>('all');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, [selectedStatus]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 50 };
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      const response = await api.get(endpoints.adminItems, { params });
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await api.put(endpoints.updateItemStatus(itemId), { status: newStatus });
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status: newStatus as any } : item
      ));
      setMenuVisible(null);
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.delete(endpoints.deleteItem(itemId));
      setItems(prev => prev.filter(item => item.id !== itemId));
      setMenuVisible(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <Card style={styles.itemCard}>
      <Card.Content style={styles.itemContent}>
        <View style={styles.itemImageContainer}>
          {item.image_urls && item.image_urls.length > 0 ? (
            <Image
              source={{ uri: item.image_urls[0] }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.itemImage, styles.placeholderImage]}>
              <PaperText style={styles.placeholderText}>No Image</PaperText>
            </View>
          )}
        </View>
        
        <View style={styles.itemDetails}>
          <PaperText style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </PaperText>
          
          <PaperText style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </PaperText>
          
          <PaperText style={styles.itemLocation}>
            📍 {item.location}
          </PaperText>
          
          <PaperText style={styles.itemDate}>
            Posted: {moment(item.created_at).format('MMM DD, YYYY')}
          </PaperText>
          
          <View style={styles.itemFooter}>
            <View style={styles.posterInfo}>
              <PaperText style={styles.posterName}>
                By: {item.poster.full_name} ({item.poster.role})
              </PaperText>
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
                onPress={() => handleStatusChange(item.id, 'active')}
                title="Mark as Active"
                disabled={item.status === 'active'}
              />
              <Menu.Item
                onPress={() => handleStatusChange(item.id, 'claimed')}
                title="Mark as Claimed"
                disabled={item.status === 'claimed'}
              />
              <Menu.Item
                onPress={() => handleStatusChange(item.id, 'archived')}
                title="Archive Item"
                disabled={item.status === 'archived'}
              />
              <Menu.Item
                onPress={() => handleDeleteItem(item.id)}
                title="Delete Item"
                titleStyle={{ color: '#F44336' }}
              />
            </Menu>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <Chip
            mode="flat"
            style={[
              styles.statusChip,
              {
                backgroundColor: 
                  item.status === 'active' ? '#4CAF50' :
                  item.status === 'claimed' ? '#FF9800' : '#757575'
              }
            ]}
            textStyle={styles.statusChipText}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <PaperText style={styles.emptyText}>No items found</PaperText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'active', 'claimed', 'archived'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.activeFilterButton
              ]}
              onPress={() => setSelectedStatus(status as any)}
            >
              <PaperText style={[
                styles.filterButtonText,
                selectedStatus === status && styles.activeFilterButtonText
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </PaperText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Items List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadItems}
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
  itemCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#757575',
    fontSize: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 12,
    color: '#424242',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#757575',
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusChipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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

export default AdminItemsScreen;
