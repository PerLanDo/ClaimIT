import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  Card,
  TextInput,
  Button,
  Chip,
  FAB,
  ActivityIndicator,
  Text as PaperText,
  Menu,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import { api, endpoints, uploadItem } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface Category {
  id: string;
  name: string;
  icon: string;
}

const ReportItemScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    dateLost: "",
    dateFound: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [itemType, setItemType] = useState<"lost" | "found">("lost");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get(endpoints.categories);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCategoryMenuVisible(false);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera is required!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImages((prev) => [...prev, result.assets[0].uri].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const showImageOptions = () => {
    Alert.alert("Add Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Please enter a title for the item");
      return false;
    }

    if (!formData.description.trim()) {
      Alert.alert("Validation Error", "Please enter a description");
      return false;
    }

    if (!selectedCategory) {
      Alert.alert("Validation Error", "Please select a category");
      return false;
    }

    if (!formData.location.trim()) {
      Alert.alert("Validation Error", "Please enter the location");
      return false;
    }

    if (itemType === "lost" && !formData.dateLost) {
      Alert.alert(
        "Validation Error",
        "Please enter the date when the item was lost"
      );
      return false;
    }

    if (itemType === "found" && !formData.dateFound) {
      Alert.alert(
        "Validation Error",
        "Please enter the date when the item was found"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: selectedCategory!.id,
        location: formData.location.trim(),
        dateLost: itemType === "lost" ? formData.dateLost : undefined,
        dateFound: itemType === "found" ? formData.dateFound : undefined,
      };

      const imageData = images.map((uri) => ({
        uri,
        type: "image/jpeg",
      }));

      const response = await uploadItem(submitData, imageData);

      Alert.alert("Success", "Item reported successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("Error submitting item:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          "Failed to submit item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderImageUpload = () => (
    <View style={styles.imageUploadContainer}>
      <PaperText style={styles.sectionTitle}>Upload Images</PaperText>

      <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions}>
        <PaperText style={styles.uploadButtonText}>Upload Image</PaperText>
      </TouchableOpacity>

      {images.length > 0 && (
        <View style={styles.imageGrid}>
          {images.map((imageUri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <PaperText style={styles.removeImageText}>×</PaperText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Item Type Selection */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              itemType === "lost" && styles.activeTypeButton,
            ]}
            onPress={() => setItemType("lost")}
          >
            <PaperText
              style={[
                styles.typeButtonText,
                itemType === "lost" && styles.activeTypeButtonText,
              ]}
            >
              Lost Item
            </PaperText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              itemType === "found" && styles.activeTypeButton,
            ]}
            onPress={() => setItemType("found")}
          >
            <PaperText
              style={[
                styles.typeButtonText,
                itemType === "found" && styles.activeTypeButtonText,
              ]}
            >
              Found Item
            </PaperText>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <Card style={styles.formCard}>
          <Card.Content>
            <TextInput
              label="Title"
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
              style={styles.input}
              mode="outlined"
              placeholder="e.g., Blue Water Bottle"
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Describe the item in detail..."
            />

            {/* Category Selection */}
            <View style={styles.categoryContainer}>
              <PaperText style={styles.inputLabel}>Category</PaperText>
              <Menu
                visible={categoryMenuVisible}
                onDismiss={() => setCategoryMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.categoryButton}
                    onPress={() => setCategoryMenuVisible(true)}
                  >
                    <PaperText style={styles.categoryButtonText}>
                      {selectedCategory
                        ? selectedCategory.name
                        : "Select Category"}
                    </PaperText>
                    <PaperText style={styles.categoryArrow}>↑</PaperText>
                  </TouchableOpacity>
                }
              >
                {categories.map((category) => (
                  <Menu.Item
                    key={category.id}
                    onPress={() => handleCategorySelect(category)}
                    title={category.name}
                  />
                ))}
              </Menu>
            </View>

            {/* Category Examples */}
            <View style={styles.categoryExamples}>
              <PaperText style={styles.categoryExamplesText}>
                e.g., Electronics, Apparel, Books
              </PaperText>
              <View style={styles.verifiedIcon}>
                <PaperText style={styles.verifiedText}>✓</PaperText>
              </View>
            </View>

            <TextInput
              label="Location"
              value={formData.location}
              onChangeText={(value) => handleInputChange("location", value)}
              style={styles.input}
              mode="outlined"
              placeholder="e.g., University Library, Cafeteria"
            />

            <TextInput
              label={`Date ${itemType === "lost" ? "Lost" : "Found"}`}
              value={
                itemType === "lost" ? formData.dateLost : formData.dateFound
              }
              onChangeText={(value) =>
                handleInputChange(
                  itemType === "lost" ? "dateLost" : "dateFound",
                  value
                )
              }
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
            />
          </Card.Content>
        </Card>

        {/* Image Upload */}
        {renderImageUpload()}

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            disabled={loading}
            buttonColor="#8B1538"
          >
            {loading ? <ActivityIndicator color="white" /> : "Submit"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  typeContainer: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTypeButton: {
    backgroundColor: "#8B1538",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#757575",
    fontWeight: "500",
  },
  activeTypeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  formCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  categoryButtonText: {
    fontSize: 16,
    color: "#424242",
  },
  categoryArrow: {
    fontSize: 16,
    color: "#757575",
  },
  categoryExamples: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryExamplesText: {
    fontSize: 12,
    color: "#757575",
    flex: 1,
  },
  verifiedIcon: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  imageUploadContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 12,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: "#8B1538",
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#8B1538",
    fontWeight: "500",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageContainer: {
    position: "relative",
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#F44336",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  submitButton: {
    borderRadius: 8,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },
});

export default ReportItemScreen;
