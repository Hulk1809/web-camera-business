import React, { useState, useEffect, useRef } from 'react';
import {
  ChatSession,
  ChatMessage,
  AdvisorStaff,
  PRESET_STAFF_ACCOUNTS,
} from '../types/chat';
import { chatSyncService } from '../services/chatSyncService';
import {
  MessageSquare,
  Search,
  UserCheck,
  Lock,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const AdminAdvisorChatView: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(chatSyncService.getSessions());
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [currentStaff, setCurrentStaff] = useState<AdvisorStaff>(chatSyncService.getActiveStaff());
  const [activeFilterTab, setActiveFilterTab] = useState<'WAITING' | 'IN_PROGRESS' | 'ALL'>('WAITING');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync state
  useEffect(() => {
    const unsub = chatSyncService.subscribe((list) => {
      setSessions([...list]);
    });

    const handleStaffChange = (e: any) => {
      if (e.detail) setCurrentStaff(e.detail);
    };
    window.addEventListener('PROGEAR_STAFF_CHANGED', handleStaffChange);

    return () => {
      unsub();
      window.removeEventListener('PROGEAR_STAFF_CHANGED', handleStaffChange);
    };
  }, []);

  // Default select first session
  useEffect(() => {
    if (!selectedSessionId && sessions.length > 0) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSessionId, sessions]);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || null;

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    if (activeFilterTab === 'WAITING' && s.status !== 'WAITING') return false;
    if (activeFilterTab === 'IN_PROGRESS' && s.status !== 'IN_PROGRESS') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.customer.name.toLowerCase().includes(q) ||
        s.customer.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const waitingCount = sessions.filter((s) => s.status === 'WAITING').length;
  const inProgressCount = sessions.filter((s) => s.status === 'IN_PROGRESS').length;

  // Check if session is locked by another staff
  const isAssignedToOther =
    selectedSession?.assignedStaff && selectedSession.assignedStaff.id !== currentStaff.id;

  const isAssignedToCurrent =
    selectedSession?.assignedStaff && selectedSession.assignedStaff.id === currentStaff.id;

  const isUnassigned = !selectedSession?.assignedStaff;

  // Actions
  const handleClaim = () => {
    if (!selectedSession) return;
    chatSyncService.claimSession(selectedSession.id, currentStaff).catch(() => undefined);
  };

  const handleResolve = () => {
    if (!selectedSession) return;
    chatSyncService.resolveSession(selectedSession.id).catch(() => undefined);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedSession) return;

    // If unassigned, automatically claim when staff replies
    if (isUnassigned) {
      chatSyncService.claimSession(selectedSession.id, currentStaff).catch(() => undefined);
    }

    chatSyncService.sendMessage(
      selectedSession.id,
      'STAFF',
      `${currentStaff.name} (${currentStaff.role})`,
      inputText.trim(),
      currentStaff.avatar
    ).catch(() => undefined);
    setInputText('');
  };

  const sendTemplateResponse = (text: string) => {
    if (!selectedSession) return;
    if (isUnassigned) {
      chatSyncService.claimSession(selectedSession.id, currentStaff).catch(() => undefined);
    }
    chatSyncService.sendMessage(
      selectedSession.id,
      'STAFF',
      `${currentStaff.name} (${currentStaff.role})`,
      text,
      currentStaff.avatar
    ).catch(() => undefined);
  };

  return (
    <div
      data-testid="admin-advisor-chat-view"
      className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]"
    >
      {/* Top Banner Alert for Current Staff */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">
            Bàn Điều Phối CSKH & Tư Vấn Trực Tuyến — Đang hoạt động dưới tài khoản:{' '}
            <strong className="text-amber-400 font-bold">{currentStaff.name}</strong> ({currentStaff.role})
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-300">
          <span>Khách chờ tiếp nhận: <strong className="text-amber-400 font-mono font-bold">{waitingCount}</strong></span>
          <span>•</span>
          <span>Đang được tư vấn: <strong className="text-emerald-400 font-mono font-bold">{inProgressCount}</strong></span>
        </div>
      </div>

      {/* 3-COLUMN MAIN WORKSPACE */}
      <div className="flex-1 grid grid-cols-12 divide-x divide-slate-200 overflow-hidden">
        {/* ================= COLUMN 1: SESSIONS QUEUE LIST (3.5 cols) ================= */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col bg-slate-50/50">
          {/* Filter Bar */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm khách hàng, email, mã phiên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Status Tabs */}
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <button
                onClick={() => setActiveFilterTab('WAITING')}
                data-testid="tab-chat-waiting"
                className={`py-1 rounded font-semibold text-center transition ${
                  activeFilterTab === 'WAITING'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Chờ ({waitingCount})
              </button>
              <button
                onClick={() => setActiveFilterTab('IN_PROGRESS')}
                data-testid="tab-chat-in-progress"
                className={`py-1 rounded font-semibold text-center transition ${
                  activeFilterTab === 'IN_PROGRESS'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Đang Tư Vấn ({inProgressCount})
              </button>
              <button
                onClick={() => setActiveFilterTab('ALL')}
                className={`py-1 rounded font-semibold text-center transition ${
                  activeFilterTab === 'ALL'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất Cả ({sessions.length})
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredSessions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Không có phiên trò chuyện nào phù hợp bộ lọc.
              </div>
            ) : (
              filteredSessions.map((sess) => {
                const isSelected = sess.id === selectedSessionId;
                const lastMsg = sess.messages[sess.messages.length - 1];
                const isClaimedByMe = sess.assignedStaff?.id === currentStaff.id;

                return (
                  <button
                    key={sess.id}
                    onClick={() => setSelectedSessionId(sess.id)}
                    data-testid={`session-item-${sess.id}`}
                    className={`w-full p-3 text-left transition flex items-start space-x-2.5 ${
                      isSelected
                        ? 'bg-indigo-50/90 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-100/80 bg-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={sess.customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={sess.customer.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      {sess.customer.authProvider === 'FACEBOOK' ? (
                        <span className="absolute -bottom-1 -right-1 bg-[#1877F2] text-white p-0.5 rounded-full text-[8px] font-bold">
                          FB
                        </span>
                      ) : (
                        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full text-[8px] font-bold">
                          @
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {sess.customer.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {lastMsg ? lastMsg.timestamp : sess.createdAt}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lastMsg ? lastMsg.text : 'Đã bắt đầu phiên chat'}
                      </p>

                      {/* ASSIGNED ADVISOR BADGE (CRITICAL REQUIREMENT) */}
                      <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                        {sess.assignedStaff ? (
                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              isClaimedByMe
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            }`}
                          >
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>
                              {isClaimedByMe
                                ? `Bạn đang tư vấn (${sess.assignedStaff.role})`
                                : `${sess.assignedStaff.name} (${sess.assignedStaff.role})`}
                            </span>
                          </span>
                        ) : (
                          <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Chờ nhân viên tiếp nhận</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ================= COLUMN 2: ACTIVE CHAT CONVERSATION (6 cols) ================= */}
        <div className="col-span-12 md:col-span-8 lg:col-span-6 flex flex-col bg-slate-50/30">
          {selectedSession ? (
            <>
              {/* Conversation Top Header */}
              <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={selectedSession.customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={selectedSession.customer.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{selectedSession.customer.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({selectedSession.id})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span>Email: {selectedSession.customer.email}</span>
                      {selectedSession.customer.phone && <span>• SĐT: {selectedSession.customer.phone}</span>}
                    </div>
                  </div>
                </div>

                {/* Header Actions: Claim / Resolve / Status */}
                <div className="flex items-center space-x-2">
                  {isUnassigned ? (
                    <button
                      onClick={handleClaim}
                      data-testid="btn-admin-claim-chat"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-sm transition flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Tiếp Nhận Tư Vấn</span>
                    </button>
                  ) : isAssignedToCurrent ? (
                    <button
                      onClick={handleResolve}
                      data-testid="btn-admin-resolve-chat"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md shadow-sm transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hoàn Tất Tư Vấn</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleClaim}
                      title="Chuyển phiên này sang cho bạn phụ trách"
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition"
                    >
                      Tiếp Nhận Lại
                    </button>
                  )}
                </div>
              </div>

              {/* COLLISION PREVENTION WARNING (CRITICAL REQUIREMENT) */}
              {isAssignedToOther && (
                <div
                  data-testid="chat-collision-warning"
                  className="bg-amber-50 border-b border-amber-200 p-2.5 px-4 flex items-center space-x-2.5 text-xs text-amber-900 shadow-2xs"
                >
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold">
                      Phiên này đang do {selectedSession.assignedStaff?.name} ({selectedSession.assignedStaff?.role}) trực tiếp tư vấn.
                    </span>
                    <span className="text-[11px] text-amber-800 block">
                      Hệ thống đang mở ở chế độ xem (Spectator) để tránh 2 tư vấn viên cùng nhắn tin làm khách nhầm lẫn.
                    </span>
                  </div>
                </div>
              )}

              {/* Messages Thread Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedSession.messages.map((msg) => {
                  const isStaff = msg.sender === 'STAFF';
                  const isSystem = msg.sender === 'SYSTEM';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="text-[10px] text-slate-500 bg-slate-200/60 px-2.5 py-0.5 rounded-full font-medium">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isStaff ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isStaff && (
                        <img
                          src={msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={msg.senderName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs ${
                          isStaff
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}
                      >
                        <div className="font-semibold text-[10px] opacity-80 mb-0.5">
                          {msg.senderName}
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                        <div
                          className={`text-[9px] mt-1 text-right ${
                            isStaff ? 'text-indigo-200' : 'text-slate-400'
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

              {/* Quick Template Replies */}
              <div className="p-2 bg-white border-t border-slate-200 flex flex-wrap gap-1.5 overflow-x-auto text-[11px]">
                <button
                  disabled={isAssignedToOther}
                  onClick={() =>
                    sendTemplateResponse(
                      `Chào bạn! Mình là ${currentStaff.name} (${currentStaff.role}) tại Pro Gear. Bạn đang quan tâm đến dòng thiết bị nào để mình tư vấn cấu hình tối ưu nhất ạ?`
                    )
                  }
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0 disabled:opacity-40"
                >
                  👋 Lời chào chuẩn
                </button>
                <button
                  disabled={isAssignedToOther}
                  onClick={() =>
                    sendTemplateResponse(
                      'Dạ hiện tại Showroom Pro Gear đang có sẵn máy trải nghiệm trực tiếp. Bạn ghé showroom sẽ được tặng kèm thẻ nhớ CFexpress và bảo hành chính hãng 24T ạ!'
                    )
                  }
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0 disabled:opacity-40"
                >
                  🎁 Ưu đãi Showroom
                </button>
                <button
                  disabled={isAssignedToOther}
                  onClick={() =>
                    sendTemplateResponse(
                      'Bên em hỗ trợ trả góp 0% qua thẻ tín dụng và CCCD duyệt hồ sơ chỉ 15 phút không cần chứng minh thu nhập ạ.'
                    )
                  }
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0 disabled:opacity-40"
                >
                  💳 Trả góp 0%
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  data-testid="input-admin-chat-message"
                  disabled={isAssignedToOther}
                  placeholder={
                    isAssignedToOther
                      ? '🔒 Đang khóa: Phiên này do nhân viên khác phụ trách...'
                      : 'Nhập câu trả lời tư vấn cho khách...'
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 disabled:bg-slate-100 disabled:text-slate-400"
                />
                <button
                  type="submit"
                  data-testid="btn-admin-send-chat"
                  disabled={isAssignedToOther || !inputText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-md shadow-sm transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <div className="font-bold text-sm text-slate-700">Chưa chọn phiên trò chuyện</div>
              <p className="text-xs max-w-xs mt-1">
                Chọn một khách hàng trong danh sách bên trái để xem nội dung và tiếp nhận tư vấn.
              </p>
            </div>
          )}
        </div>

        {/* ================= COLUMN 3: CUSTOMER & FAST VIETQR TOOLS (3 cols) ================= */}
        <div className="hidden lg:flex col-span-3 flex-col bg-white p-4 space-y-4 overflow-y-auto">
          {selectedSession ? (
            <>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  THÔNG TIN KHÁCH HÀNG
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div>Tên: <strong className="text-slate-900">{selectedSession.customer.name}</strong></div>
                  <div>Email: <span className="font-mono">{selectedSession.customer.email}</span></div>
                  <div>Kênh chat: <span className="font-bold text-indigo-700">{selectedSession.customer.authProvider}</span></div>
                  <div>Sản phẩm đang xem: <strong className="text-slate-900">{selectedSession.currentProductViewing || 'Sony FX3 Body'}</strong></div>
                </div>
              </div>

              {/* Fast VietQR Generator Shortcut */}
              <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-200 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-indigo-700 font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>Gửi Mã VietQR Báo Giá Khách</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Gửi nhanh mã QR đặt cọc giữ máy (MBBank - 888899996688) trực tiếp vào khung chat.
                </p>
                <button
                  disabled={isAssignedToOther}
                  onClick={() => {
                    sendTemplateResponse(
                      'Dạ em gửi anh/chị thông tin tài khoản ngân hàng Pro Gear để chuyển khoản cọc máy ạ:\n🏦 MBBank (Ngân Hàng Quân Đội)\n💳 STK: 8888 9999 6688\n👤 Chủ TK: CONG TY CP CONG NGHE PRO GEAR VIETNAM\n📝 Nội dung: COC_' +
                        selectedSession.id
                    );
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-md shadow-xs transition"
                >
                  Gửi Thông Tin VietQR Chuyển Khoản
                </button>
              </div>

              {/* Staff in charge card */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  NHÂN VIÊN PHỤ TRÁCH PHIÊN
                </div>
                {selectedSession.assignedStaff ? (
                  <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 flex items-center space-x-2.5">
                    <img
                      src={selectedSession.assignedStaff.avatar}
                      alt={selectedSession.assignedStaff.name}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-300"
                    />
                    <div>
                      <div className="font-bold text-xs text-emerald-950">
                        {selectedSession.assignedStaff.name}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        {selectedSession.assignedStaff.role}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Tiếp nhận lúc: {selectedSession.assignedAt || selectedSession.createdAt}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                    Chưa có nhân viên tiếp nhận. Bấm nút <strong>[Tiếp Nhận Tư Vấn]</strong> để bắt đầu hỗ trợ.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-xs text-center py-6">
              Chọn một phiên chat để xem thông tin chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
