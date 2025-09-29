import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Card,
  Button,
  Chip,
  Text as PaperText,
  ActivityIndicator,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { api, endpoints } from '../../services/api';

interface Claim {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  proof_description: string;
  proof_image_url?: string;
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
  item: {
    id: string;
    title: string;
    description: string;
    location: string;
    image_urls: string[];
    categories: {
      name: string;
    };
    poster: {
      full_name: string;
      role: string;
    };
  };
  claimant: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    student_id?: string;
  };
  reviewer?: {
    full_name: string;
    role: string;
  };
}

const AdminClaimsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);

  useEffect(() => {
    loadClaims();
  }, [selectedStatus]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 50 };
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      const response = await api.get(endpoints.claims, { params });
      setClaims(response.data.claims || []);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDecision = async (claimId: string, decision: 'approved' | 'rejected') => {
    try {
      await api.put(endpoints.claimStatus(claimId), {
        status: decision,
        adminNotes: adminNotes.trim() || undefined,
      });

      setClaims(prev => prev.map(claim => 
        claim.id === claimId 
          ? { 
              ...claim, 
              status: decision,
              admin_notes: adminNotes.trim(),
              reviewed_at: new Date().toISOString(),
              reviewer: { full_name: 'You', role: 'admin' }
            } 
          : claim
      ));

      setSelectedClaim(null);
      setAdminNotes('');
      Alert.alert('Success', `Claim ${decision} successfully`);
    } catch (error) {
      console.error('Error updating claim:', error);
      Alert.alert('Error', 'Failed to update claim status');
    }
  };

  const showDecisionDialog = (claimId: string) => {
    setSelectedClaim(claimId);
    setAdminNotes('');
  };

  const renderClaim = ({ item }: { item: Claim }) => (
    <Card style={styles.claimCard}>
      <Card.Content>
        {/* Claim Header */}
        <View style={styles.claimHeader}>
          <View style={styles.claimInfo}>
            <PaperText style={styles.claimTitle}>Claim #{item.id.slice(0, 8)}</PaperText>
            <PaperText style={styles.claimDate}>
              Submitted: {moment(item.created_at).format('MMM DD, YYYY')}
            </PaperText>
          </View>
          <Chip
            mode="flat"
            style={[
              styles.statusChip,
              {
                backgroundColor: 
                  item.status === 'pending' ? '#FF9800' :
                  item.status === 'approved' ? '#4CAF50' : '#F44336'
              }
            ]}
            textStyle={styles.statusChipText}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Chip>
        </View>

        {/* Item Information */}
        <View style={styles.itemSection}>
          <PaperText style={styles.sectionTitle}>Item Information</PaperText>
          <View style={styles.itemInfo}>
            <View style={styles.itemImageContainer}>
              {item.item.image_urls && item.item.image_urls.length > 0 ? (
                <Image
                  source={{ uri: item.item.image_urls[0] }}
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
              <PaperText style={styles.itemTitle}>{item.item.title}</PaperText>
              <PaperText style={styles.itemCategory}>{item.item.categories.name}</PaperText>
              <PaperText style={styles.itemLocation}>📍 {item.item.location}</PaperText>
              <PaperText style={styles.itemPoster}>
                Posted by: {item.item.poster.full_name} ({item.item.poster.role})
              </PaperText>
            </View>
          </View>
        </View>

        {/* Claimant Information */}
        <View style={styles.claimantSection}>
          <PaperText style={styles.sectionTitle}>Claimant Information</PaperText>
          <View style={styles.claimantInfo}>
            <PaperText style={styles.claimantName}>{item.claimant.full_name}</PaperText>
            <PaperText style={styles.claimantDetails}>
              {item.claimant.email} • {item.claimant.role}
            </PaperText>
            {item.claimant.student_id && (
              <PaperText style={styles.claimantDetails}>
                ID: {item.claimant.student_id}
              </PaperText>
            )}
          </View>
        </View>

        {/* Proof Description */}
        <View style={styles.proofSection}>
          <PaperText style={styles.sectionTitle}>Proof Description</PaperText>
          <PaperText style={styles.proofText}>{item.proof_description}</PaperText>
        </View>

        {/* Proof Image */}
        {item.proof_image_url && (
          <View style={styles.proofImageSection}>
            <PaperText style={styles.sectionTitle}>Proof Photo</PaperText>
            <Image
              source={{ uri: item.proof_image_url }}
              style={styles.proofImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Admin Notes */}
        {item.admin_notes && (
          <View style={styles.adminNotesSection}>
            <PaperText style={styles.sectionTitle}>Admin Notes</PaperText>
            <PaperText style={styles.adminNotesText}>{item.admin_notes}</PaperText>
            {item.reviewer && (
              <PaperText style={styles.reviewerInfo}>
                Reviewed by: {item.reviewer.full_name} ({item.reviewer.role})
              </PaperText>
            )}
            {item.reviewed_at && (
              <PaperText style={styles.reviewerInfo}>
                On: {moment(item.reviewed_at).format('MMM DD, YYYY HH:mm')}
              </PaperText>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => handleClaimDecision(item.id, 'approved')}
              style={styles.approveButton}
              buttonColor="#4CAF50"
            >
              Approve
            </Button>
            <Button
              mode="contained"
              onPress={() => handleClaimDecision(item.id, 'rejected')}
              style={styles.rejectButton}
              buttonColor="#F44336"
            >
              Reject
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <PaperText style={styles.emptyText}>No claims found</PaperText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
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

      {/* Claims List */}
      <FlatList
        data={claims}
        renderItem={renderClaim}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadClaims}
      />

      {/* Admin Notes Modal */}
      {selectedClaim && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <PaperText style={styles.modalTitle}>Add Admin Notes</PaperText>
            <TextInput
              label="Admin Notes (Optional)"
              value={adminNotes}
              onChangeText={setAdminNotes}
              style={styles.notesInput}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Add any notes about your decision..."
            />
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setSelectedClaim(null)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={() => handleClaimDecision(selectedClaim, 'approved')}
                style={styles.modalButton}
                buttonColor="#4CAF50"
              >
                Approve
              </Button>
              <Button
                mode="contained"
                onPress={() => handleClaimDecision(selectedClaim, 'rejected')}
                style={styles.modalButton}
                buttonColor="#F44336"
              >
                Reject
              </Button>
            </View>
          </View>
        </View>
      )}
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
  claimCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  claimInfo: {
    flex: 1,
  },
  claimTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  claimDate: {
    fontSize: 12,
    color: '#757575',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
  },
  itemInfo: {
    flexDirection: 'row',
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#757575',
    fontSize: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  itemLocation: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  itemPoster: {
    fontSize: 12,
    color: '#757575',
  },
  claimantSection: {
    marginBottom: 16,
  },
  claimantInfo: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  claimantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  claimantDetails: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  proofSection: {
    marginBottom: 16,
  },
  proofText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  proofImageSection: {
    marginBottom: 16,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  adminNotesSection: {
    marginBottom: 16,
  },
  adminNotesText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewerInfo: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
  },
  rejectButton: {
    flex: 1,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 16,
  },
  notesInput: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default AdminClaimsScreen;
