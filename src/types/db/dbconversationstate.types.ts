import type { ConversationStates } from '../unions.types.js';

export interface DbConversationState {
  id: number;
  user_id: number;
  state: ConversationStates;
  payload: string | null;
  updated_at: string;
}
