export type ActionType = 'add' | 'append' | 'addIfNotExist' | 'get';
export interface Action {
  type: ActionType;
  content: string;
  path: string;
}
