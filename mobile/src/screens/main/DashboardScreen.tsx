import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Card,
  Button,
  Searchbar,
  Chip,
  FAB,
  ActivityIndicator,
  Text as PaperText,
  Avatar,
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
  date_lost?: string;
  date_found?: string;
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
  };
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'all'>('lost');
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadItems = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setPage(1);
        setHasMore(true);
      }

      const currentPage = reset ? 1 : page;
      
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (activeTab !== 'all') {
        params.type = activeTab;
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await api.get(endpoints.items, { params });
      const newItems = response.data.items || [];

      if (reset) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }

      setHasMore(newItems.length === 20);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }, [activeTab, selectedCategory, searchQuery, page]);

  const loadCategories = async () => {
    try {
      const response = await api.get(endpoints.categories);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadItems(true);
  }, [activeTab, selectedCategory, searchQuery]);

  useEffect(() => {
    loadCategories();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems(true);
    setRefreshing(false);
  }, [loadItems]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadItems(false);
    }
  }, [hasMore, loading, loadItems]);

  const renderItem = ({ item }: { item: Item }) => (
    <Card style={styles.itemCard} onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}>
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
          
          <PaperText style={styles.itemDate}>
            Posted: {moment(item.created_at).format('MMM DD')}
          </PaperText>
          
          <PaperText style={styles.itemLocation} numberOfLines={1}>
            📍 {item.location}
          </PaperText>
          
          <View style={styles.itemFooter}>
            <View style={styles.posterInfo}>
              <Avatar.Text
                size={20}
                label={item.poster.full_name.charAt(0)}
                style={styles.posterAvatar}
              />
              <PaperText style={styles.posterName}>
                {item.poster.full_name}
              </PaperText>
            </View>
            
            <Chip
              mode="outlined"
              compact
              style={styles.roleChip}
              textStyle={styles.roleChipText}
            >
              {item.poster.role}
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#8B1538" />
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search items..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
      />

      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        <Chip
          mode={selectedCategory === null ? 'flat' : 'outlined'}
          onPress={() => setSelectedCategory(null)}
          style={[
            styles.categoryChip,
            selectedCategory === null && styles.selectedCategoryChip
          ]}
          textStyle={[
            styles.categoryChipText,
            selectedCategory === null && styles.selectedCategoryChipText
          ]}
        >
          All Categories
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            mode={selectedCategory === category.id ? 'flat' : 'outlined'}
            onPress={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.selectedCategoryChip
            ]}
            textStyle={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.selectedCategoryChipText
            ]}
          >
            {category.name}
          </Chip>
        ))}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <PaperText style={styles.emptyText}>
        No {activeTab === 'all' ? '' : activeTab} items found
      </PaperText>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('ReportItem')}
        style={styles.emptyButton}
        buttonColor="#8B1538"
      >
        Report First Item
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity>
              <PaperText style={styles.menuIcon}>☰</PaperText>
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <PaperText style={styles.headerTitle}>CLAIMIT</PaperText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <PaperText style={styles.headerIcon}>→</PaperText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lost' && styles.activeTab]}
          onPress={() => setActiveTab('lost')}
        >
          <PaperText style={[
            styles.tabText,
            activeTab === 'lost' && styles.activeTabText
          ]}>
            Lost
          </PaperText>
          {activeTab === 'lost' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'found' && styles.activeTab]}
          onPress={() => setActiveTab('found')}
        >
          <PaperText style={[
            styles.tabText,
            activeTab === 'found' && styles.activeTabText
          ]}>
            Found
          </PaperText>
          {activeTab === 'found' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <PaperText style={[
            styles.tabText,
            activeTab === 'all' && styles.activeTabText
          ]}>
            All
          </PaperText>
          {activeTab === 'all' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading ? renderEmpty : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#8B1538']}
              tintColor="#8B1538"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        label="Report Item"
        style={styles.fab}
        onPress={() => navigation.navigate('ReportItem')}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#8B1538',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  menuIcon: {
    color: 'white',
    fontSize: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcon: {
    color: 'white',
    fontSize: 20,
  },
  tabContainer: {
    backgroundColor: '#E0E0E0',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling handled by text color
  },
  tabText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#8B1538',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#8B1538',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  searchbar: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  categoryChip: {
    marginBottom: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#8B1538',
  },
  categoryChipText: {
    fontSize: 12,
  },
  selectedCategoryChipText: {
    color: 'white',
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
  itemDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  posterAvatar: {
    backgroundColor: '#8B1538',
    marginRight: 6,
  },
  posterName: {
    fontSize: 12,
    color: '#424242',
    flex: 1,
  },
  roleChip: {
    height: 24,
    borderColor: '#8B1538',
  },
  roleChipText: {
    fontSize: 10,
    color: '#8B1538',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
  },
  emptyButton: {
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#8B1538',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default DashboardScreen;
