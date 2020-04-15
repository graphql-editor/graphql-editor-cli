export type ActionType = 'add' | 'append';
export interface Action {
  type: ActionType;
  content: string;
  path: string;
}
