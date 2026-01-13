
export enum LeadStatus {
  NEW = 'Novo',
  QUALIFYING = 'Qualificando',
  HOT = 'Quente (Pronto)',
  COLD = 'Frio',
  FOLLOW_UP = 'Follow-up'
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: LeadStatus;
  lastMessage: string;
  timestamp: string;
  score: number;
  interests: string[];
  isAiPaused?: boolean;
  monitoringActive?: boolean;
  waitingHours?: number;
  interactionCount: number;
  lastSpeaker: 'ai' | 'lead';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  event: 'receive' | 'process' | 'send' | 'error' | 'monitor';
  message: string;
  details?: string;
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  verifyToken: string;
  webhookUrl: string;
  isActive: boolean;
  guardianMode: {
    enabled: boolean;
    timeoutHours: number;
    intensity: 'soft' | 'persuasive';
    monitorNewLeads: boolean;
  };
}
