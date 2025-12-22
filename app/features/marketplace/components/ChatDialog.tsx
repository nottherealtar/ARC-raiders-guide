"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Send, Gamepad2, MessageSquare, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface User {
  id: string;
  username: string | null;
  name: string | null;
  image: string | null;
  embark_id?: string | null;
  discord_username?: string | null;
  averageRating?: number;
  totalRatings?: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: User;
  created_at: string;
  read: boolean;
}

interface Listing {
  id: string;
  type: string;
  paymentType: string;
  seedsAmount: number | null;
  quantity: number;
  item: {
    id: string;
    name: string;
    icon: string | null;
    rarity: string | null;
  };
  user: User;
}

interface Chat {
  id: string;
  listing: Listing;
  participant1: User;
  participant2: User;
  messages: Message[];
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  otherUserId: string;
  currentUserId: string;
}

export function ChatDialog({
  open,
  onOpenChange,
  listingId,
  otherUserId,
  currentUserId,
}: ChatDialogProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = chat
    ? chat.participant1.id === currentUserId
      ? chat.participant2
      : chat.participant1
    : null;

  useEffect(() => {
    if (open && listingId && otherUserId) {
      loadChat();
    }
  }, [open, listingId, otherUserId]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!chat) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/${chat.id}/messages`);
        if (res.ok) {
          const newMessages = await res.json();
          setMessages(newMessages);
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, otherUserId }),
      });

      if (!res.ok) throw new Error("Failed to load chat");

      const chatData = await res.json();
      setChat(chatData);
      setMessages(chatData.messages || []);
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch(`/api/chat/${chat.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const message = await res.json();
        setMessages((prev) => [...prev, message]);
      } else {
        console.error("Failed to send message:", await res.text());
        // Restore the message if sending failed
        setNewMessage(content);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore the message if sending failed
      setNewMessage(content);
    }
  };

  const getRarityColor = (rarity: string | null) => {
    switch (rarity?.toUpperCase()) {
      case "LEGENDARY":
        return "text-orange-400";
      case "EPIC":
        return "text-purple-400";
      case "RARE":
        return "text-blue-400";
      case "UNCOMMON":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl h-[600px]">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!chat || !otherUser) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        {/* Header with listing info */}
        <DialogHeader className="p-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            {/* Item Icon */}
            <div className="w-12 h-12 shrink-0 bg-muted/30 rounded border border-border/50 flex items-center justify-center">
              {chat.listing.item.icon ? (
                <img
                  src={chat.listing.item.icon}
                  alt={chat.listing.item.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <Sparkles className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            {/* Listing Info */}
            <div className="flex-1">
              <DialogTitle className={`text-base ${getRarityColor(chat.listing.item.rarity)}`}>
                {chat.listing.item.name} x{chat.listing.quantity}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {chat.listing.type === "WTS" ? "للبيع" : "مطلوب"}
                </Badge>
                {chat.listing.paymentType === "SEEDS" && (
                  <span className="text-xs text-amber-400">
                    {chat.listing.seedsAmount?.toLocaleString()} بذور
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Other User Info */}
          <div className="flex items-center gap-3 mt-3 p-3 bg-muted/20 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser.image || undefined} />
              <AvatarFallback className="bg-gradient-orange text-white">
                {otherUser.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {otherUser.username || otherUser.name || "مستخدم"}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {otherUser.totalRatings && otherUser.totalRatings > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{otherUser.averageRating?.toFixed(1)} ({otherUser.totalRatings})</span>
                  </div>
                ) : (
                  <span>لا تقييمات</span>
                )}
                {otherUser.embark_id && (
                  <div className="flex items-center gap-1">
                    <Gamepad2 className="h-3 w-3" />
                    <span>{otherUser.embark_id}</span>
                  </div>
                )}
                {otherUser.discord_username && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{otherUser.discord_username}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              لا توجد رسائل بعد. ابدأ المحادثة!
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={message.sender.image || undefined} />
                    <AvatarFallback className={isOwn ? "bg-gradient-orange text-white" : "bg-muted"}>
                      {message.sender.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[70%] ${
                        isOwn
                          ? "bg-orange-600/20 text-orange-100"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="min-h-[60px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-orange-600 hover:bg-orange-700 h-[60px] px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            اضغط Enter للإرسال، Shift+Enter لسطر جديد
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
