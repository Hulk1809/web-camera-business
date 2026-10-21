import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Headset, User, Mail, LogOut, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { CustomerUser, ChatSession, ChatMessage } from '../types/chat';
import { chatSyncService } from '../services/chatSyncService';

interface CustomerChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProductName?: string;
}

export const CustomerChatDrawer: React.FC<CustomerChatDrawerProps> = ({
  isOpen,
  onClose,
  currentProductName,
}) => {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(chatSyncService.getCustomerSession());
  const [session, setSession] = useState<ChatSession | null>(null);
  const [inputText, setInputText] = useState<string>('');

  // Email form states
  const [emailName, setEmailName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [emailPhone, setEmailPhone] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Customer can sign in from the Store header while this drawer is mounted.
  // Refresh the session whenever it opens so the chat does not show a second login form.
  useEffect(() => {
    if (isOpen) setCurrentUser(chatSyncService.getCustomerSession());
  }, [isOpen]);

  // Sync sessions
  useEffect(() => {
    if (!currentUser) return;
    let sessionId = '';
    let cancelled = false;
    chatSyncService.getOrCreateCustomerSession(currentUser, currentProductName)
      .then((created) => { if (!cancelled) { sessionId = created.id; setSession(created); } })
      .catch(() => undefined);
    const unsubscribe = chatSyncService.subscribe((sessions) => {
      const updated = sessions.find((s) => s.id === sessionId || s.customer.id === currentUser.id);
      if (updated && !cancelled) setSession({ ...updated });
    });
    return () => { cancelled = true; unsubscribe(); };
  }, [currentUser, currentProductName]);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages, isOpen]);

  if (!isOpen) return null;

  // Handle Email login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailName || !emailAddress) return;
    const emailUser: CustomerUser = {
      id: `em_${Date.now()}`,
      name: emailName,
      email: emailAddress,
      phone: emailPhone || '0908112233',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      authProvider: 'EMAIL',
    };
    chatSyncService.saveCustomerSession(emailUser);
    setCurrentUser(emailUser);
  };

  const handleLogout = () => {
    chatSyncService.clearCustomerSession();
    setCurrentUser(null);
    setSession(null);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !session || !currentUser) return;

    chatSyncService.sendMessage(
      session.id,
      'CUSTOMER',
      currentUser.name,
      inputText.trim(),
      currentUser.avatar
    ).catch(() => undefined);
    setInputText('');
  };

  const sendQuickPrompt = (prompt: string) => {
    if (!session || !currentUser) return;
    chatSyncService.sendMessage(session.id, 'CUSTOMER', currentUser.name, prompt, currentUser.avatar);
  };

  return (
    <div
      data-testid="customer-chat-drawer"
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity pointer-events-auto"
      />

      {/* Drawer Right Window */}
      <div className="absolute right-0 top-0 bottom-0 max-w-md w-full bg-white shadow-2xl flex flex-col pointer-events-auto border-l border-gray-200 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="bg-[#E30019] text-white p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-white text-[#E30019] flex items-center justify-center font-bold shadow-sm">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight flex items-center gap-1.5">
                <span>TƯ VẤN VIÊN PRO GEAR 24/7</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              </div>
              <div className="text-[10.5px] text-white/90 font-medium">
                {session?.assignedStaff ? (
                  <span className="text-amber-200 font-bold">
                    Đang trò chuyện cùng: {session.assignedStaff.name} ({session.assignedStaff.role})
                  </span>
                ) : (
                  <span>Chuyên viên kỹ thuật trực tuyến</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {currentUser && (
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="p-1 hover:bg-white/20 rounded text-white transition text-xs"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              data-testid="btn-close-chat"
              className="p-1 hover:bg-white/20 rounded text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Assigned Advisor Info Banner if Claimed */}
        {session?.assignedStaff && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 flex items-center space-x-2.5 text-xs text-emerald-950">
            <img
              src={session.assignedStaff.avatar}
              alt={session.assignedStaff.name}
              className="w-8 h-8 rounded-full border border-emerald-300 object-cover"
            />
            <div className="flex-1 truncate">
              <div className="font-bold text-[11px] text-emerald-900 flex items-center gap-1">
                <span>{session.assignedStaff.name}</span>
                <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-semibold">
                  Chuyên viên chính
                </span>
              </div>
              <div className="text-[10px] text-emerald-700 truncate">{session.assignedStaff.specialty}</div>
            </div>
          </div>
        )}

        {/* BODY AREA */}
        {!currentUser ? (
          /* LOGIN PROMPT (EMAIL OR FACEBOOK) */
          <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-center text-gray-900 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-red-100 text-[#E30019] rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-gray-900">Kết Nối Với Chuyên Viên</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Đăng nhập nhanh để gửi tin nhắn, nhận báo giá độc quyền và lưu lại lịch sử tư vấn.
              </p>
            </div>

            {/* Facebook login area */}
            <div className="space-y-1.5">
              <button
                type="button"
                disabled
                data-testid="btn-chat-login-facebook"
                className="w-full py-2.5 px-4 bg-gray-300 text-gray-600 font-bold text-xs rounded-md flex items-center justify-center space-x-2 cursor-not-allowed"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook OAuth Chưa Cấu Hình</span>
              </button>
              <div className="text-[10.5px] text-center text-gray-500">
                Vui lòng dùng tài khoản email trong thời gian chờ Meta credentials.
              </div>
            </div>

            <div className="flex items-center space-x-2 my-2 text-xs text-gray-400">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span>HOẶC ĐĂNG NHẬP EMAIL</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailLogin} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Họ tên của bạn *</label>
                <input
                  type="text"
                  required
                  data-testid="input-chat-name"
                  placeholder="Ví dụ: Nguyễn Văn Tuấn"
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#E30019]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email nhận báo giá *</label>
                <input
                  type="email"
                  required
                  data-testid="input-chat-email"
                  placeholder="email@example.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#E30019]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Số điện thoại (tùy chọn)</label>
                <input
                  type="tel"
                  data-testid="input-chat-phone"
                  placeholder="09..."
                  value={emailPhone}
                  onChange={(e) => setEmailPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#E30019]"
                />
              </div>

              <button
                type="submit"
                data-testid="btn-chat-login-email"
                className="w-full py-2.5 bg-[#E30019] hover:bg-red-700 text-white font-bold rounded-md shadow mt-2 transition"
              >
                Bắt Đầu Trò Chuyện
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN CHAT INTERFACE */
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Status pill */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-[10.5px] text-gray-600 shadow-xs">
                  {session?.status === 'WAITING' ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Đang chờ nhân viên tiếp nhận phiên tư vấn...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{session?.assignedStaff?.name} đang phụ trách phiên chat</span>
                    </>
                  )}
                </span>
              </div>

              {session?.messages.map((msg) => {
                const isCustomer = msg.sender === 'CUSTOMER';
                const isSystem = msg.sender === 'SYSTEM';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="text-[10px] text-gray-500 bg-gray-200/60 px-2.5 py-0.5 rounded-full font-medium">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isCustomer ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isCustomer && (
                      <img
                        src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs shadow-xs ${
                        isCustomer
                          ? 'bg-[#E30019] text-white rounded-br-xs'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                      }`}
                    >
                      <div className="font-semibold text-[10px] opacity-80 mb-0.5">
                        {msg.senderName}
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          isCustomer ? 'text-red-100' : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="p-2 bg-white border-t border-gray-200 flex flex-wrap gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => sendQuickPrompt('Shop tư vấn giúp mình Sony FX3 chính hãng ạ')}
                className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0"
              >
                🎥 Tư vấn Sony FX3
              </button>
              <button
                onClick={() => sendQuickPrompt('Gói trả góp 0% thủ tục như thế nào ạ?')}
                className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0"
              >
                💳 Thủ tục trả góp 0%
              </button>
              <button
                onClick={() => sendQuickPrompt('Máy cũ bên shop thu lại giá bao nhiêu?')}
                className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0"
              >
                🔄 Thu cũ đổi mới
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                data-testid="input-chat-message"
                placeholder="Nhập câu hỏi của bạn tại đây..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-100 border border-transparent rounded-full text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#E30019]"
              />
              <button
                type="submit"
                data-testid="btn-send-chat"
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-full bg-[#E30019] hover:bg-red-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
};
