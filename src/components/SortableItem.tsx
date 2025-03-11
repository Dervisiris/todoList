"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { FaTrash, FaCheck, FaGripVertical, FaClock, FaTags } from "react-icons/fa";
import { format } from 'date-fns';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: Date | null;
}

interface Props {
  todo: Todo;
  id: number;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  priorityColors: Record<string, string>;
}

export function SortableItem({ todo, id, onToggle, onDelete, priorityColors }: Props) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`group flex items-center justify-between p-4 rounded-lg ${
        todo.completed ? "bg-green-50" : priorityColors[todo.priority]
      } border border-gray-200 shadow-sm hover:shadow-md transition-all`}
    >
      <div className="flex items-center gap-3">
        <button
          className="opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <FaGripVertical className="text-gray-500" />
        </button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            todo.completed
              ? "border-green-500 bg-green-500"
              : "border-gray-300"
          }`}
        >
          {todo.completed && <FaCheck className="text-white text-sm" />}
        </motion.button>

        <div className="flex flex-col">
          <span
            className={`${
              todo.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {todo.text}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FaTags className="text-purple-500" />
              {todo.category}
            </span>
            {todo.dueDate && (
              <span className="flex items-center gap-1">
                <FaClock className="text-blue-500" />
                {format(new Date(todo.dueDate), 'dd/MM/yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FaTrash />
      </motion.button>
    </motion.div>
  );
} 