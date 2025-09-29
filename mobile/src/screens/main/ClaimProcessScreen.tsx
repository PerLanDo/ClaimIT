import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Card,
  TextInput,
  Button,
  RadioButton,
  Text as PaperText,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { api, endpoints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Item {
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
}

const ClaimProcessScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { itemId } = route.params as { itemId: string };

  const [item, setItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    affiliation: '',
    reasonForClaiming: '',
  });
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadItemDetails();
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        studentId: user.studentId || '',
        affiliation: user.department || '',
      }));
    }
  }, [itemId, user]);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickProofImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      setProofImage(result.assets[0].uri);
    }
  };

  const takeProofPhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      setProofImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Proof Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: takeProofPhoto },
        { text: 'Photo Library', onPress: pickProofImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }

    if (!formData.studentId.trim()) {
      Alert.alert('Validation Error', 'Please enter your Student/Staff ID');
      return false;
    }

    if (!formData.affiliation.trim()) {
      Alert.alert('Validation Error', 'Please enter your affiliation/department');
      return false;
    }

    if (!formData.reasonForClaiming.trim()) {
      Alert.alert('Validation Error', 'Please provide a reason for claiming this item');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Add text fields
      submitData.append('itemId', itemId);
      submitData.append('proofDescription', formData.reasonForClaiming.trim());

      // Add proof image if available
      if (proofImage) {
        submitData.append('proofImage', {
          uri: proofImage,
          type: 'image/jpeg',
          name: 'proof_image.jpg',
        } as any);
      }

      const response = await api.post(endpoints.claims, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert(
        'Success',
        'Claim submitted successfully! The SID will review your claim and notify you of the decision.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error: any) {
      console.error('Error submitting claim:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to submit claim. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusIndicator = () => (
    <View style={styles.statusContainer}>
      <PaperText style={styles.statusTitle}>Claim Status Updates</PaperText>
      
      <View style={styles.statusOptions}>
        <View style={styles.statusOption}>
          <RadioButton
            value="pending"
            status={claimStatus === 'pending' ? 'checked' : 'unchecked'}
            onPress={() => setClaimStatus('pending')}
            color="#8B1538"
          />
          <PaperText style={[
            styles.statusText,
            claimStatus === 'pending' && styles.activeStatusText
          ]}>
            Pending
          </PaperText>
        </View>

        <View style={styles.statusOption}>
          <RadioButton
            value="approved"
            status={claimStatus === 'approved' ? 'checked' : 'unchecked'}
            onPress={() => setClaimStatus('approved')}
            color="#8B1538"
          />
          <PaperText style={[
            styles.statusText,
            claimStatus === 'approved' && styles.activeStatusText
          ]}>
            Approved
          </PaperText>
        </View>

        <View style={styles.statusOption}>
          <RadioButton
            value="rejected"
            status={claimStatus === 'rejected' ? 'checked' : 'unchecked'}
            onPress={() => setClaimStatus('rejected')}
            color="#8B1538"
          />
          <PaperText style={[
            styles.statusText,
            claimStatus === 'rejected' && styles.activeStatusText
          ]}>
            Rejected
          </PaperText>
        </View>
      </View>

      {/* Status Indicators */}
      <View style={styles.statusIndicators}>
        <View style={[styles.statusDot, claimStatus === 'pending' && styles.activeDot]} />
        <View style={[styles.statusDot, claimStatus === 'approved' && styles.activeDot]} />
        <View style={[styles.statusDot, claimStatus === 'rejected' && styles.activeDot]} />
      </View>
    </View>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Item Preview */}
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
              <PaperText style={styles.itemTitle}>{item.title}</PaperText>
              <PaperText style={styles.itemCategory}>{item.categories.name}</PaperText>
              <PaperText style={styles.itemLocation}>📍 {item.location}</PaperText>
            </View>
          </Card.Content>
        </Card>

        {/* Claim Form */}
        <Card style={styles.formCard}>
          <Card.Content>
            <PaperText style={styles.formTitle}>Claim Submission Form</PaperText>

            <TextInput
              label="Your Name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              style={styles.input}
              mode="outlined"
              placeholder="Enter your full name"
            />

            <TextInput
              label="Student/Staff ID"
              value={formData.studentId}
              onChangeText={(value) => handleInputChange('studentId', value)}
              style={styles.input}
              mode="outlined"
              placeholder="Enter your ID number"
            />

            <TextInput
              label="Affiliation/Department"
              value={formData.affiliation}
              onChangeText={(value) => handleInputChange('affiliation', value)}
              style={styles.input}
              mode="outlined"
              placeholder="e.g., Computer Science, Library Staff"
            />

            <TextInput
              label="Reason for Claiming"
              value={formData.reasonForClaiming}
              onChangeText={(value) => handleInputChange('reasonForClaiming', value)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Explain why you believe this item belongs to you. Provide specific details that can help verify your ownership..."
            />

            {/* Proof Image Upload */}
            <View style={styles.proofImageContainer}>
              <PaperText style={styles.proofImageLabel}>Upload Photo for Proof</PaperText>
              
              <TouchableOpacity
                style={styles.proofImageButton}
                onPress={showImageOptions}
              >
                <PaperText style={styles.proofImageButtonText}>
                  {proofImage ? 'Change Proof Photo' : 'Upload Proof Photo'}
                </PaperText>
              </TouchableOpacity>

              {proofImage && (
                <View style={styles.proofImagePreview}>
                  <Image source={{ uri: proofImage }} style={styles.proofImage} />
                  <TouchableOpacity
                    style={styles.removeProofButton}
                    onPress={() => setProofImage(null)}
                  >
                    <PaperText style={styles.removeProofText}>Remove</PaperText>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
              disabled={submitting}
              buttonColor="#8B1538"
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                'Submit Claim'
              )}
            </Button>
          </Card.Content>
        </Card>

        {/* Status Updates Section */}
        {renderStatusIndicator()}
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
  itemCard: {
    margin: 16,
    backgroundColor: 'white',
  },
  itemContent: {
    flexDirection: 'row',
    padding: 16,
  },
  itemImageContainer: {
    marginRight: 16,
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
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#757575',
  },
  formCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  proofImageContainer: {
    marginBottom: 20,
  },
  proofImageLabel: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 12,
  },
  proofImageButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
  },
  proofImageButtonText: {
    fontSize: 16,
    color: '#8B1538',
    fontWeight: '500',
  },
  proofImagePreview: {
    alignItems: 'center',
  },
  proofImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  removeProofButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeProofText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },
  statusContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 20,
  },
  statusOptions: {
    marginBottom: 20,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 12,
  },
  activeStatusText: {
    color: '#8B1538',
    fontWeight: 'bold',
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  activeDot: {
    backgroundColor: '#8B1538',
  },
});

export default ClaimProcessScreen;
