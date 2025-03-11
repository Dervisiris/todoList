"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { format } from 'date-fns';
import { Todo } from '../types/todo';

interface SortableItemProps {
  id: string;
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  priorityColors: {
    [key: string]: string;
  };
}

export function SortableItem({ id, todo, onToggle, onDelete, priorityColors }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group p-4 mb-2 rounded-lg flex items-center gap-4 cursor-move ${
        todo.priority ? priorityColors[todo.priority] : 'bg-gray-100'
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded border-2 border-purple-300 text-purple-500 focus:ring-purple-500"
      />
      
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
        {todo.text}
      </span>

      {todo.category && (
        <span className="px-2 py-1 rounded bg-white/50 text-sm">
          {todo.category}
        </span>
      )}

      {todo.dueDate && (
        <span className="text-sm text-gray-600">
          {format(new Date(todo.dueDate), 'dd/MM/yyyy')}
        </span>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:text-red-500"
      >
        <FaTrash />
      </button>
    </motion.div>
  );
} 