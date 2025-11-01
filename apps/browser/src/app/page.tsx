'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Video, MoreVertical, Search, Plus, Users } from 'lucide-react';
import type { Chat, Message } from '@chat-app/types';

// Mock data with group and direct
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    type: 'direct',
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    lastMessageAt: new Date(),
  },
  {
    id: '2',
    name: 'Team Chat',
    type: 'group',
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    lastMessageAt: new Date(),
  },
  {
    id: '3',
    name: 'Jane Smith',
    type: 'direct',
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    lastMessageAt: new Date(),
  },
  {
    id: '4',
    name: 'Study Group',
    type: 'group',
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    lastMessageAt: new Date(),
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey! How are you doing?',
    senderId: '2',
    chatId: '1',
    type: 'text',
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
  },
  {
    id: '2',
    content: "I'm doing great! Thanks for asking. How about you?",
    senderId: '1',
    chatId: '1',
    type: 'text',
    timestamp: new Date(Date.now() - 3500000),
    isRead: true,
  },
  {
    id: '3',
    content: 'Pretty good! Just working on some new projects.',
    senderId: '2',
    chatId: '1',
    type: 'text',
    timestamp: new Date(Date.now() - 3400000),
    isRead: true,
  },
  {
    id: '4',
    content: 'That sounds exciting! What kind of projects?',
    senderId: '1',
    chatId: '1',
    type: 'text',
    timestamp: new Date(Date.now() - 300000),
    isRead: false,
  },
];

export default function ChatApp() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const filteredChats = mockChats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Split chats for simple group/direct toggle
  const directChats = filteredChats.filter(chat => chat.type === 'direct');
  const groupChats = filteredChats.filter(chat => chat.type === 'group');
  const [chatView, setChatView] = useState<'direct' | 'group'>('direct');

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message.trim(),
        senderId: '1', // Current user
        chatId: selectedChat.id,
        type: 'text',
        timestamp: new Date(),
        isRead: false,
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-900">Chats</h1>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Plus className="w-5 h-5 text-blue-600" />
            </button>
          </div>
          {/* Simple direct/group switch */}
          <div className="flex items-center mb-3 space-x-2">
            <button
              className={`flex-1 py-1 rounded ${chatView === 'direct' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setChatView('direct')}
            >
              Direct
            </button>
            <button
              className={`flex-1 py-1 rounded ${chatView === 'group' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setChatView('group')}
            >
              Groups
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${chatView === 'group' ? 'groups' : 'chats'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatView === 'group'
            ? groupChats.length > 0
              ? groupChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition ${
                      selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900 truncate">{chat.name}</span>
                          <span className="text-xs text-gray-500">
                            {chat.lastMessageAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : (
                <p className="p-4 text-sm text-gray-500 text-center">No groups found</p>
              )
            : directChats.length > 0
            ? directChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition ${
                    selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative w-9 h-9">
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-base">
                          {chat.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      {chat.type === 'direct' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 truncate">{chat.name}</span>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessageAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : <p className="p-4 text-sm text-gray-500 text-center">No chats found</p>
          }
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {selectedChat.type === 'group' ? (
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{selectedChat.name?.charAt(0).toUpperCase() || '?'}</span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {selectedChat.name}
                    </h2>
                    <p className="text-xs text-green-600">{selectedChat.type === 'group' ? 'Group' : 'Online'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <Video className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50">
              {messages.filter(msg => msg.chatId === selectedChat.id).map((msg) => {
                const isOwnMessage = msg.senderId === '1';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-3">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    rows={1}
                    style={{ minHeight: '32px', maxHeight: '96px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Select a chat or group
              </h3>
              <p className="text-gray-500 text-sm">
                Choose a conversation from the sidebar to begin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}