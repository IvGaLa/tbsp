import type { ConversationStates } from '../unions.types.js';

export interface ConversationState {
  id: number;
  userId: number;
  state: ConversationStates;
  payload?: string;
  updatedAt: Date;
}
