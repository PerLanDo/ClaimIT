import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  Card,
  Button,
  Chip,
  Text as PaperText,
  Avatar,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import { api, endpoints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ItemDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  image_urls: string[];
  date_lost?: string;
  date_found?: string;
  status: 'active' | 'claimed' | 'archived';
  qr_code: string;
  created_at: string;
  categories: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  poster: {
    id: string;
    full_name: string;
    role: string;
    department?: string;
  };
  claimed_by_user?: {
    id: string;
    full_name: string;
    role: string;
  };
}

const { width } = Dimensions.get('window');

const ItemDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { itemId } = route.params as { itemId: string };

  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    loadItemDetails();
  }, [itemId]);

  const loadItemDetails = async () => {
    try {
      const response = await api.get(endpoints.itemDetail(itemId));
      setItem(response.data);
    } catch (error) {
      console.error('Error loading item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimItem = () => {
    navigation.navigate('ClaimProcess', { itemId: itemId });
  };

  const handleMessagePoster = () => {
    if (item?.poster) {
      // Navigate to messaging with the poster
      navigation.navigate('Messages', {
        screen: 'Conversation',
        params: {
          type: 'item',
          id: itemId,
          otherUser: item.poster,
        },
      });
    }
  };

  const renderImages = () => {
    if (!item?.image_urls || item.image_urls.length === 0) {
      return (
        <View style={styles.noImageContainer}>
          <PaperText style={styles.noImageText}>No Images Available</PaperText>
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_urls[imageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        {item.image_urls.length > 1 && (
          <View style={styles.imageThumbnails}>
            {item.image_urls.map((url, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setImageIndex(index)}
                style={[
                  styles.thumbnail,
                  index === imageIndex && styles.activeThumbnail
                ]}
              >
                <Image
                  source={{ uri: url }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderStatusChip = () => {
    let statusColor = '#4CAF50'; // Green for active
    let statusText = 'Active';

    if (item?.status === 'claimed') {
      statusColor = '#FF9800'; // Orange for claimed
      statusText = 'Claimed';
    } else if (item?.status === 'archived') {
      statusColor = '#757575'; // Gray for archived
      statusText = 'Archived';
    }

    return (
      <Chip
        mode="flat"
        style={[styles.statusChip, { backgroundColor: statusColor }]}
        textStyle={styles.statusChipText}
      >
        {statusText}
      </Chip>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B1538" />
          <PaperText style={styles.loadingText}>Loading item details...</PaperText>
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <PaperText style={styles.errorText}>Item not found</PaperText>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            buttonColor="#8B1538"
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnItem = user?.id === item.poster.id;
  const canClaim = !isOwnItem && item.status === 'active';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Item Overview Card */}
        <Card style={styles.overviewCard}>
          <Card.Content style={styles.overviewContent}>
            <View style={styles.overviewImage}>
              {item.image_urls && item.image_urls.length > 0 ? (
                <Image
                  source={{ uri: item.image_urls[0] }}
                  style={styles.overviewImageStyle}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.overviewImageStyle, styles.noImagePlaceholder]}>
                  <PaperText style={styles.noImageText}>No Image</PaperText>
                </View>
              )}
            </View>
            
            <View style={styles.overviewDetails}>
              <PaperText style={styles.overviewTitle}>{item.title}</PaperText>
              <PaperText style={styles.overviewDescription}>
                Description: {item.description}
              </PaperText>
            </View>
          </Card.Content>
        </Card>

        {/* Description Card */}
        <Card style={styles.descriptionCard}>
          <Card.Content>
            <PaperText style={styles.sectionTitle}>Description</PaperText>
            <View style={styles.descriptionItem}>
              <PaperText style={styles.descriptionLabel}>Category:</PaperText>
              <PaperText style={styles.descriptionValue}>{item.categories.name}</PaperText>
            </View>
            <View style={styles.descriptionItem}>
              <PaperText style={styles.descriptionLabel}>Location:</PaperText>
              <View style={styles.locationContainer}>
                <PaperText style={styles.descriptionValue}>{item.location}</PaperText>
                <View style={styles.verifiedIcon}>
                  <PaperText style={styles.verifiedText}>✓</PaperText>
                </View>
              </View>
            </View>
            <View style={styles.descriptionItem}>
              <PaperText style={styles.descriptionLabel}>Date:</PaperText>
              <PaperText style={styles.descriptionValue}>
                {moment(item.date_lost || item.date_found).format('MMM DD')}
              </PaperText>
            </View>
            {renderStatusChip()}
          </Card.Content>
        </Card>

        {/* Poster Details Card */}
        <Card style={styles.posterCard}>
          <Card.Content>
            <PaperText style={styles.sectionTitle}>Poster Details</PaperText>
            <View style={styles.posterInfo}>
              <Avatar.Text
                size={40}
                label={item.poster.full_name.charAt(0)}
                style={styles.posterAvatar}
              />
              <View style={styles.posterDetails}>
                <PaperText style={styles.posterName}>
                  Posted by: {item.poster.full_name} ({item.poster.role})
                </PaperText>
                {item.poster.department && (
                  <PaperText style={styles.posterDepartment}>
                    Department: {item.poster.department}
                  </PaperText>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        {!isOwnItem && (
          <View style={styles.actionButtons}>
            {canClaim && (
              <Button
                mode="contained"
                onPress={handleClaimItem}
                style={styles.claimButton}
                buttonColor="#8B1538"
                contentStyle={styles.buttonContent}
              >
                CLAIM ITEM
              </Button>
            )}
            
            <Button
              mode="contained"
              onPress={handleMessagePoster}
              style={styles.messageButton}
              buttonColor="#8B1538"
              contentStyle={styles.buttonContent}
            >
              MESSAGE POSTER
            </Button>
          </View>
        )}

        {/* QR Code */}
        <Card style={styles.qrCard}>
          <Card.Content style={styles.qrContent}>
            <QRCode
              value={JSON.stringify({
                id: item.id,
                title: item.title,
                location: item.location,
                date: item.date_lost || item.date_found
              })}
              size={200}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
            <PaperText style={styles.qrText}>Scan to verify ownership</PaperText>
          </Card.Content>
        </Card>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 20,
  },
  backButton: {
    borderRadius: 8,
  },
  overviewCard: {
    margin: 16,
    backgroundColor: 'white',
  },
  overviewContent: {
    flexDirection: 'row',
    padding: 16,
  },
  overviewImage: {
    marginRight: 16,
  },
  overviewImageStyle: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  noImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 16,
    borderRadius: 8,
  },
  noImageText: {
    color: '#757575',
    fontSize: 16,
  },
  overviewDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
  },
  overviewDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  imageContainer: {
    margin: 16,
  },
  mainImage: {
    width: width - 32,
    height: 250,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  imageThumbnails: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  thumbnail: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 4,
  },
  activeThumbnail: {
    borderColor: '#8B1538',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 16,
  },
  descriptionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
    width: 80,
  },
  descriptionValue: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verifiedIcon: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  posterCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterAvatar: {
    backgroundColor: '#8B1538',
    marginRight: 12,
  },
  posterDetails: {
    flex: 1,
  },
  posterName: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
    marginBottom: 4,
  },
  posterDepartment: {
    fontSize: 12,
    color: '#757575',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  claimButton: {
    flex: 1,
    borderRadius: 8,
  },
  messageButton: {
    flex: 1,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  qrCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: 'white',
  },
  qrContent: {
    alignItems: 'center',
    padding: 20,
  },
  qrText: {
    marginTop: 16,
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});

export default ItemDetailScreen;
