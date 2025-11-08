"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import axios from 'axios';
import { useUserStore } from '@/stores/useUserStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const API_BASE_URL = "https://rental-app-backend-wk4u.onrender.com";

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar: string; };
  content: string;
  createdAt: string;
}

interface Conversation {
  _id: string; // This is the bookingId
  product: { name: string; };
  customer: { name: string; _id: string };
  seller: { name: string; _id: string };
}

const DEFAULT_AVATAR_URL = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

export default function InboxPage() {
  const { user } = useUserStore();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      const endpoint = user.role === 'seller' ? '/api/bookings/seller' : '/api/bookings/my-bookings';
      try {
        const { data } = await axios.get<Conversation[]>(`${API_BASE_URL}${endpoint}`);
        setConversations(data);

        const bookingId = searchParams.get('bookingId');
        const initialConvo = data.find((c) => c._id === bookingId) || data[0];
        if (initialConvo) {
          setActiveConversation(initialConvo);
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }
    };
    fetchConversations();
  }, [user, searchParams]);

  useEffect(() => {
    if (!activeConversation) return;

    socketRef.current = io(API_BASE_URL);
    socketRef.current.emit('join_chat', activeConversation._id);
    socketRef.current.on('receive_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get<Message[]>(`${API_BASE_URL}/api/chat/${activeConversation._id}`);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    fetchMessages();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [activeConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || !activeConversation || !socketRef.current) return;

    const receiverId = user.role === 'seller' ? activeConversation.customer._id : activeConversation.seller._id;

    // --- FIX: Add a check to ensure receiverId is valid before sending ---
    if (!receiverId) {
        toast.error("Error sending message", { description: "Could not identify the recipient. Please refresh." });
        return;
    }

    socketRef.current.emit('send_message', {
      booking: activeConversation._id,
      sender: user._id,
      receiver: receiverId,
      content: newMessage,
    });
    setNewMessage('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (name: string = "") => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-lg bg-card">
      <div className="w-full md:w-1/3 border-r">
        <h2 className="p-4 border-b font-semibold text-lg">Conversations</h2>
        <div className="flex flex-col overflow-y-auto">
          {conversations.map((convo) => (
            <button
              key={convo._id}
              onClick={() => setActiveConversation(convo)}
              className={`p-4 text-left hover:bg-muted ${activeConversation?._id === convo._id ? 'bg-muted' : ''}`}
            >
              <p className="font-semibold">{convo.product.name}</p>
              <p className="text-sm text-muted-foreground">
                With: {user?.role === 'seller' ? convo.customer.name : convo.seller.name}
              </p>
            </button>
          ))}
        </div>
      </div>
      
      <div className="hidden md:flex w-2/3 flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-4">
               <h3 className="font-semibold text-lg">{activeConversation.product.name}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-muted/20 space-y-4">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex items-end gap-2 my-2 ${msg.sender._id === user?._id ? 'justify-end' : ''}`}>
                   {msg.sender._id !== user?._id && 
                     <Avatar className="h-8 w-8">
                       <AvatarImage src={msg.sender.avatar || DEFAULT_AVATAR_URL} />
                       <AvatarFallback>{getInitials(msg.sender.name)}</AvatarFallback>
                     </Avatar>
                   }
                  <div className={`p-3 rounded-lg max-w-md ${msg.sender._id === user?._id ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">{format(new Date(msg.createdAt), 'p')}</p>
                  </div>
                </div>
              ))}
               <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}

