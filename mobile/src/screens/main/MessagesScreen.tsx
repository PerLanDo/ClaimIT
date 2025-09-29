import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Avatar,
  Text as PaperText,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { api, endpoints } from '../../services/api';

interface Conversation {
  id: string;
  type: 'item' | 'claim' | 'direct';
  item?: {
    id: string;
    title: string;
    image_urls: string[];
  };
  claim?: {
    id: string;
    status: string;
  };
  otherUser: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unreadCount: number;
}

const MessagesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await api.get(endpoints.conversations);
      setConversations(response.data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => {
        // Navigate to conversation detail
        navigation.navigate('Conversation', {
          conversationId: item.id,
          type: item.type,
          otherUser: item.otherUser,
        });
      }}
    >
      <View style={styles.conversationContent}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={50}
            label={item.otherUser.name.charAt(0)}
            style={styles.avatar}
          />
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <PaperText style={styles.unreadText}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </PaperText>
            </View>
          )}
        </View>

        <View style={styles.messageInfo}>
          <View style={styles.messageHeader}>
            <PaperText style={styles.userName}>{item.otherUser.name}</PaperText>
            <PaperText style={styles.userRole}>({item.otherUser.role})</PaperText>
            <PaperText style={styles.timestamp}>
              {moment(item.lastMessage.created_at).format('MMM DD')}
            </PaperText>
          </View>

          <PaperText style={styles.lastMessage} numberOfLines={2}>
            {item.lastMessage.content}
          </PaperText>

          {item.item && (
            <View style={styles.contextInfo}>
              <PaperText style={styles.contextText}>
                📦 Re: {item.item.title}
              </PaperText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <PaperText style={styles.emptyText}>No conversations yet</PaperText>
      <PaperText style={styles.emptySubtext}>
        Start a conversation by messaging someone about an item
      </PaperText>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B1538" />
          <PaperText style={styles.loadingText}>Loading conversations...</PaperText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  conversationCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  conversationContent: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    backgroundColor: '#8B1538',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginRight: 6,
  },
  userRole: {
    fontSize: 12,
    color: '#757575',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 'auto',
  },
  lastMessage: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  contextInfo: {
    marginTop: 4,
  },
  contextText: {
    fontSize: 12,
    color: '#8B1538',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
  },
});

export default MessagesScreen;
