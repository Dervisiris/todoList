export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
} 