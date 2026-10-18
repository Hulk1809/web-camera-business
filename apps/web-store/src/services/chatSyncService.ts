import { ChatSession, ChatMessage, CustomerUser, AdvisorStaff, PRESET_STAFF_ACCOUNTS } from '../types/chat';

const STORAGE_KEY = 'PROGEAR_CHAT_SESSIONS';
const CUSTOMER_SESSION_KEY = 'PROGEAR_CUSTOMER_SESSION';
const ACTIVE_STAFF_KEY = 'PROGEAR_ACTIVE_STAFF';

const INITIAL_DEMO_SESSIONS: ChatSession[] = [
  {
    id: 'CHAT-20261018-8812',
    customer: {
      id: 'cust_fb_102',
      name: 'Võ Minh Trí (Facebook)',
      email: 'tri.vo.dop@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      authProvider: 'FACEBOOK',
    },
    status: 'IN_PROGRESS',
    assignedStaff: PRESET_STAFF_ACCOUNTS[0], // Hoàng Nam
    assignedAt: '18/10/2026 16:45',
    createdAt: '18/10/2026 16:40',
    updatedAt: '18/10/2026 16:48',
    unreadCustomerCount: 0,
    unreadStaffCount: 0,
    currentProductViewing: 'Sony FX3 Cinema Line (ILME-FX3)',
    messages: [
      {
        id: 'msg_1',
        sessionId: 'CHAT-20261018-8812',
        sender: 'CUSTOMER',
        senderName: 'Võ Minh Trí',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: 'Chào shop, em đang quay phim ngắn độc lập, shop tư vấn giúp em body Sony FX3 kèm ống kính 24-70 GM II sẵn hàng không ạ?',
        timestamp: '16:40',
      },
      {
        id: 'msg_2',
        sessionId: 'CHAT-20261018-8812',
        sender: 'STAFF',
        senderName: 'Hoàng Nam (Tư Vấn 1)',
        senderAvatar: PRESET_STAFF_ACCOUNTS[0].avatar,
        text: 'Chào anh Trí! Pro Gear đang sẵn 2 combo Sony FX3 chính hãng Sony VN bảo hành 24T tại showroom Q1. Bên em đang trợ giá combo kèm lens 24-70 GM II giảm 4.000.000đ và tặng thẻ CFexpress Type A 160GB ạ!',
        timestamp: '16:45',
      },
      {
        id: 'msg_3',
        sessionId: 'CHAT-20261018-8812',
        sender: 'CUSTOMER',
        senderName: 'Võ Minh Trí',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: 'Dạ hay quá, em muốn đặt cọc giữ máy chiều mai ghé nhận được không anh?',
        timestamp: '16:48',
      },
    ],
  },
  {
    id: 'CHAT-20261018-9104',
    customer: {
      id: 'cust_em_305',
      name: 'Nguyễn Bích Ngọc',
      email: 'bichngoc.media@outlook.com',
      phone: '0918223344',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      authProvider: 'EMAIL',
    },
    status: 'WAITING',
    assignedStaff: null, // Unassigned waiting queue
    createdAt: '18/10/2026 17:15',
    updatedAt: '18/10/2026 17:15',
    unreadCustomerCount: 0,
    unreadStaffCount: 1,
    currentProductViewing: 'DJI Mavic 3 Pro Cine Combo',
    messages: [
      {
        id: 'msg_10',
        sessionId: 'CHAT-20261018-9104',
        sender: 'CUSTOMER',
        senderName: 'Nguyễn Bích Ngọc',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Shop ơi, em muốn hỏi gói DJI Mavic 3 Pro Cine có sẵn ổ SSD 1TB quay Apple ProRes không ạ? Ship ra Hà Nội bao lâu tới?',
        timestamp: '17:15',
      },
    ],
  },
];

export const chatSyncService = {
  getSessions(): ChatSession[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SESSIONS));
        return INITIAL_DEMO_SESSIONS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_SESSIONS;
    }
  },

  saveSessions(sessions: ChatSession[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    // Broadcast event across windows
    window.dispatchEvent(new CustomEvent('PROGEAR_CHAT_EVENT', { detail: sessions }));
  },

  getSessionById(sessionId: string): ChatSession | null {
    const list = this.getSessions();
    return list.find((s) => s.id === sessionId) || null;
  },

  getOrCreateCustomerSession(customer: CustomerUser, currentProduct?: string): ChatSession {
    const list = this.getSessions();
    let existing = list.find((s) => s.customer.id === customer.id || s.customer.email === customer.email);
    if (!existing) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${timeStr}`;

      existing = {
        id: `CHAT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer,
        status: 'WAITING',
        assignedStaff: null,
        createdAt: dateStr,
        updatedAt: dateStr,
        unreadCustomerCount: 0,
        unreadStaffCount: 1,
        currentProductViewing: currentProduct,
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            sessionId: '',
            sender: 'SYSTEM',
            senderName: 'Hệ Thống Pro Gear',
            text: `Xin chào ${customer.name}! Bạn đã kết nối với Trung Tâm Tư Vấn Pro Gear. Tư vấn viên sẽ phản hồi bạn trong giây lát.`,
            timestamp: timeStr,
          },
        ],
      };
      existing.messages[0].sessionId = existing.id;
      list.unshift(existing);
      this.saveSessions(list);
    }
    return existing;
  },

  sendMessage(
    sessionId: string,
    sender: 'CUSTOMER' | 'STAFF' | 'SYSTEM',
    senderName: string,
    text: string,
    senderAvatar?: string,
    productRef?: any
  ): ChatMessage {
    const list = this.getSessions();
    const session = list.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${timeStr}`;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      sender,
      senderName,
      senderAvatar,
      text,
      timestamp: timeStr,
      productRef,
    };

    session.messages.push(newMsg);
    session.updatedAt = dateStr;

    if (sender === 'CUSTOMER') {
      session.unreadStaffCount += 1;
    } else if (sender === 'STAFF') {
      session.unreadCustomerCount += 1;
    }

    this.saveSessions(list);
    return newMsg;
  },

  claimSession(sessionId: string, staff: AdvisorStaff): ChatSession {
    const list = this.getSessions();
    const session = list.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${timeStr}`;

    session.assignedStaff = staff;
    session.assignedAt = dateStr;
    session.status = 'IN_PROGRESS';
    session.updatedAt = dateStr;

    // Add a system event message
    session.messages.push({
      id: `sys_${Date.now()}`,
      sessionId,
      sender: 'SYSTEM',
      senderName: 'Hệ Thống',
      text: `${staff.name} (${staff.role}) đã tiếp nhận cuộc trò chuyện này.`,
      timestamp: timeStr,
    });

    this.saveSessions(list);
    return session;
  },

  resolveSession(sessionId: string): ChatSession {
    const list = this.getSessions();
    const session = list.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'RESOLVED';
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    session.messages.push({
      id: `sys_${Date.now()}`,
      sessionId,
      sender: 'SYSTEM',
      senderName: 'Hệ Thống',
      text: `Phiên tư vấn đã được hoàn tất. Cảm ơn quý khách đã tin tưởng Pro Gear!`,
      timestamp: timeStr,
    });

    this.saveSessions(list);
    return session;
  },

  // Customer Authentication helpers
  getCustomerSession(): CustomerUser | null {
    try {
      const raw = localStorage.getItem(CUSTOMER_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveCustomerSession(user: CustomerUser): void {
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(user));
  },

  clearCustomerSession(): void {
    localStorage.removeItem(CUSTOMER_SESSION_KEY);
  },

  // Staff Account Switcher helpers
  getActiveStaff(): AdvisorStaff {
    try {
      const raw = localStorage.getItem(ACTIVE_STAFF_KEY);
      return raw ? JSON.parse(raw) : PRESET_STAFF_ACCOUNTS[0]; // Default: Hoàng Nam (Tư Vấn 1)
    } catch {
      return PRESET_STAFF_ACCOUNTS[0];
    }
  },

  setActiveStaff(staff: AdvisorStaff): void {
    localStorage.setItem(ACTIVE_STAFF_KEY, JSON.stringify(staff));
    window.dispatchEvent(new CustomEvent('PROGEAR_STAFF_CHANGED', { detail: staff }));
  },

  // Event listener subscription
  subscribe(callback: (sessions: ChatSession[]) => void): () => void {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch {}
      }
    };

    const handleCustom = (e: any) => {
      callback(e.detail || this.getSessions());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('PROGEAR_CHAT_EVENT', handleCustom);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('PROGEAR_CHAT_EVENT', handleCustom);
    };
  },
};
