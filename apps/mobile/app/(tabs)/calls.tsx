import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Call {
  id: string;
  name: string;
  avatar?: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: Date;
  duration?: number;
}

const mockCalls: Call[] = [
  {
    id: '1',
    name: 'John Doe',
    type: 'outgoing',
    timestamp: new Date(Date.now() - 3600000),
    duration: 120,
  },
  {
    id: '2',
    name: 'Jane Smith',
    type: 'incoming',
    timestamp: new Date(Date.now() - 7200000),
    duration: 300,
  },
  {
    id: '3',
    name: 'Team Meeting',
    type: 'missed',
    timestamp: new Date(Date.now() - 86400000),
  },
];

export default function CallsScreen() {
  const renderCallItem = ({ item }: { item: Call }) => (
    <TouchableOpacity style={styles.callItem}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.callContent}>
        <Text style={styles.callName}>{item.name}</Text>
        <View style={styles.callInfo}>
          <Ionicons 
            name={
              item.type === 'incoming' ? 'call' :
              item.type === 'outgoing' ? 'call' : 'call-outline'
            } 
            size={14} 
            color={
              item.type === 'missed' ? '#FF3B30' : '#4CAF50'
            } 
          />
          <Text style={[
            styles.callType,
            { color: item.type === 'missed' ? '#FF3B30' : '#666' }
          ]}>
            {item.type === 'incoming' ? 'Incoming' :
             item.type === 'outgoing' ? 'Outgoing' : 'Missed'}
          </Text>
          {item.duration && (
            <>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.callDuration}>
                {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
              </Text>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.callActions}>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.videoButton}>
          <Ionicons name="videocam" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calls</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockCalls}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        style={styles.callList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    padding: 8,
  },
  callList: {
    flex: 1,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  callContent: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callType: {
    fontSize: 12,
    marginLeft: 4,
  },
  separator: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
  },
  callDuration: {
    fontSize: 12,
    color: '#666',
  },
  callActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  callButton: {
    padding: 8,
  },
  videoButton: {
    padding: 8,
  },
});
