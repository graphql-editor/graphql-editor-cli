export type ActionType = 'add' | 'append' | 'addIfNotExist';
export interface Action {
  type: ActionType;
  content: string;
  path: string;
}
