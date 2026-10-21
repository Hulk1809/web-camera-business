import { ChatSession, ChatMessage, CustomerUser, AdvisorStaff, PRESET_STAFF_ACCOUNTS } from '../types/chat';

const CUSTOMER_SESSION_KEY = 'PROGEAR_CUSTOMER_SESSION';
const CHAT_TOKEN_KEY = 'PROGEAR_CHAT_ACCESS_TOKEN';
const ACTIVE_STAFF_KEY = 'PROGEAR_ACTIVE_STAFF';
let cache: ChatSession[] = [];
const listeners = new Set<(sessions: ChatSession[]) => void>();

const dateTime = (value: string) => new Date(value).toLocaleString('vi-VN');
const time = (value: string) => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const staffFromApi = (user: any): AdvisorStaff | null => {
  if (!user) return null;
  return PRESET_STAFF_ACCOUNTS.find((staff) => staff.name === user.fullName) || {
    id: user.id, name: user.fullName, email: '', role: 'Tư Vấn Viên', avatar: '', specialty: 'Tư vấn Pro Gear', status: 'ONLINE',
  };
};
const mapMessage = (message: any, session: any): ChatMessage => ({
  id: message.id, sessionId: session.id, sender: message.sender,
  senderName: message.sender === 'CUSTOMER' ? session.customer.displayName : message.senderUser?.fullName || 'Tư vấn viên Pro Gear',
  text: message.content, timestamp: time(message.createdAt),
});
const mapSession = (session: any): ChatSession => ({
  id: session.id,
  customer: { id: session.customer.id, name: session.customer.displayName, email: session.customer.email || '', phone: session.customer.phone || undefined, authProvider: 'EMAIL' },
  status: session.status === 'ACTIVE' ? 'IN_PROGRESS' : session.status === 'CLOSED' ? 'RESOLVED' : 'WAITING',
  assignedStaff: staffFromApi(session.assignedUser), createdAt: dateTime(session.createdAt), updatedAt: dateTime(session.updatedAt),
  messages: (session.messages || []).map((message: any) => mapMessage(message, session)),
  unreadCustomerCount: 0, unreadStaffCount: 0, currentProductViewing: session.subject || undefined,
});
const emit = () => listeners.forEach((listener) => listener([...cache]));

async function refreshCustomerSessions() {
  const token = localStorage.getItem(CHAT_TOKEN_KEY);
  if (!token) { cache = []; emit(); return; }
  const response = await fetch('/api/chat/customer/sessions', { headers: { 'x-chat-token': token } });
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem(CHAT_TOKEN_KEY);
    return;
  }
  const sessions = await response.json();
  cache = await Promise.all(sessions.map(async (session: any) => {
    const detail = await fetch(`/api/chat/customer/sessions/${session.id}?limit=50`, { headers: { 'x-chat-token': token } });
    return mapSession(detail.ok ? await detail.json() : session);
  }));
  emit();
}

export const chatSyncService = {
  getSessions: () => [...cache],
  getSessionById: (id: string) => cache.find((session) => session.id === id) || null,
  async getOrCreateCustomerSession(customer: CustomerUser, currentProduct?: string): Promise<ChatSession> {
    const token = localStorage.getItem(CHAT_TOKEN_KEY);
    if (token) {
      await refreshCustomerSessions();
      const existing = cache.find((session) => session.status !== 'RESOLVED');
      if (existing) return existing;
    }
    const response = await fetch('/api/chat/customer/sessions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: customer.name, email: customer.email || undefined, phone: customer.phone,
        subject: currentProduct, accessToken: token || undefined }),
    });
    if (!response.ok) throw new Error('Không thể tạo phiên tư vấn');
    const result = await response.json();
    if (result.accessToken) localStorage.setItem(CHAT_TOKEN_KEY, result.accessToken);
    await refreshCustomerSessions();
    return cache.find((session) => session.id === result.session.id) || mapSession(result.session);
  },
  async sendMessage(sessionId: string, _sender: string, _senderName: string, text: string) {
    const token = localStorage.getItem(CHAT_TOKEN_KEY);
    const response = await fetch(`/api/chat/customer/sessions/${sessionId}/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-chat-token': token || '' }, body: JSON.stringify({ content: text }),
    });
    if (!response.ok) throw new Error('Không thể gửi tin nhắn');
    await refreshCustomerSessions();
    return response.json();
  },
  getCustomerSession(): CustomerUser | null {
    try { const raw = localStorage.getItem(CUSTOMER_SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  saveCustomerSession(user: CustomerUser) { localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(user)); },
  clearCustomerSession() { localStorage.removeItem(CUSTOMER_SESSION_KEY); },
  getActiveStaff(): AdvisorStaff {
    try { const raw = localStorage.getItem(ACTIVE_STAFF_KEY); return raw ? JSON.parse(raw) : PRESET_STAFF_ACCOUNTS[0]; } catch { return PRESET_STAFF_ACCOUNTS[0]; }
  },
  setActiveStaff(staff: AdvisorStaff) {
    localStorage.setItem(ACTIVE_STAFF_KEY, JSON.stringify(staff));
    window.dispatchEvent(new CustomEvent('PROGEAR_STAFF_CHANGED', { detail: staff }));
  },
  subscribe(callback: (sessions: ChatSession[]) => void) {
    listeners.add(callback);
    refreshCustomerSessions().catch(() => undefined);
    const interval = window.setInterval(() => refreshCustomerSessions().catch(() => undefined), 3000);
    return () => { listeners.delete(callback); window.clearInterval(interval); };
  },
};
