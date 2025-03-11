"use client";

import React, { useState, useCallback, memo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaCheck, FaFlag, FaClock, FaTags, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { SortableItem } from './SortableItem';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types/todo';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: Date | null;
}

const categories = ['İş', 'Kişisel', 'Alışveriş', 'Sağlık', 'Eğitim'];
const priorityColors = {
  low: 'bg-blue-100 hover:bg-blue-200',
  medium: 'bg-yellow-100 hover:bg-yellow-200',
  high: 'bg-red-100 hover:bg-red-200'
};

const ITEMS_PER_PAGE = 5; // Her sayfada gösterilecek görev sayısı

// Sayfalama kontrollerini içeren bileşen
const Pagination = memo(({ currentPage, totalPages, onPageChange }: { 
  currentPage: number; 
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`p-2 rounded-full ${
          currentPage === 0 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-purple-500 hover:bg-purple-100'
        }`}
      >
        <FaChevronLeft />
      </motion.button>
      
      <span className="text-sm text-gray-600">
        Sayfa {currentPage + 1} / {totalPages}
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`p-2 rounded-full ${
          currentPage === totalPages - 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-purple-500 hover:bg-purple-100'
        }`}
      >
        <FaChevronRight />
      </motion.button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

interface TodoFormProps {
  onSubmit: (e: React.FormEvent) => void;
  input: string;
  setInput: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPriority: 'low' | 'medium' | 'high';
  setSelectedPriority: (priority: 'low' | 'medium' | 'high') => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
}

// TodoForm component with performance optimizations
const TodoForm = memo(({ onSubmit, input, setInput, selectedCategory, setSelectedCategory, selectedPriority, setSelectedPriority, selectedDate, setSelectedDate, showDatePicker, setShowDatePicker }: TodoFormProps) => {
  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setSelectedCategory(e.target.value);
    });
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    startTransition(() => {
      setSelectedPriority(priority);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-2">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Yeni görev ekle..."
          className="flex-1 px-4 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-purple-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors"
        >
          <FaPlus />
          Ekle
        </motion.button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={`px-3 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none ${
            isPending ? 'opacity-70' : ''
          }`}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((priority) => (
            <motion.button
              key={priority}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePriorityChange(priority)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                selectedPriority === priority ? 'ring-2 ring-purple-500' : ''
              } ${priorityColors[priority]} ${isPending ? 'opacity-70' : ''}`}
            >
              <FaFlag />
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="relative">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
          >
            <FaClock />
            {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Tarih Seç'}
          </motion.button>
          {showDatePicker && (
            <div className="absolute top-12 left-0 z-10">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  startTransition(() => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  });
                }}
                inline
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
});

TodoForm.displayName = 'TodoForm';

// Empty state component
const EmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center space-y-4"
  >
    <div className="w-32 h-32 mx-auto relative">
      <Image
        src="https://illustrations.popsy.co/gray/task-list.svg"
        alt="Empty task list"
        fill
        sizes="(max-width: 128px) 100vw, 128px"
        priority={false}
        className="object-contain"
      />
    </div>
    <p className="text-gray-500">
      Henüz görev eklenmemiş 🌱
    </p>
  </motion.div>
));

EmptyState.displayName = 'EmptyState';

// Stats component
const Stats = memo(({ total, completed }: { total: number; completed: number }) => (
  <div className="border-t pt-4">
    <div className="flex justify-between text-sm text-gray-600">
      <span>Toplam: {total} görev</span>
      <span>Tamamlanan: {completed} görev</span>
    </div>
  </div>
));

Stats.displayName = 'Stats';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

interface DragItemProps {
  id: string;
  children: React.ReactNode;
}

const handleDragEnd = (event: { active: { id: string }; over: { id: string } | null }) => {
  // ... existing code ...
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.max(1, Math.ceil(todos.length / ITEMS_PER_PAGE));

  // Mevcut sayfadaki görevleri al
  const currentTodos = todos.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const addTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        priority: selectedPriority,
        category: selectedCategory,
        dueDate: selectedDate
      }]);
      setInput("");
      setSelectedDate(null);
      setShowDatePicker(false);
      // Yeni görev eklendiğinde son sayfaya git
      setCurrentPage(Math.ceil((todos.length + 1) / ITEMS_PER_PAGE) - 1);
    }
  }, [input, selectedPriority, selectedCategory, selectedDate, todos.length]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => {
      const newTodos = prev.filter((todo) => todo.id !== id);
      // Eğer sayfada başka görev kalmadıysa bir önceki sayfaya git
      if (newTodos.length <= currentPage * ITEMS_PER_PAGE && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
      return newTodos;
    });
  }, [currentPage]);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    startTransition(() => {
      setCurrentPage(newPage);
    });
  }, []);

  return (
    <div className="space-y-6">
      <TodoForm
        onSubmit={addTodo}
        input={input}
        setInput={setInput}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />

      <div className={isPending ? 'opacity-70' : ''}>
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={currentTodos.map(t => t.id)} 
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {currentTodos.map((todo) => (
                <SortableItem
                  key={todo.id}
                  id={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  priorityColors={priorityColors}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>

        {todos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Stats total={todos.length} completed={todos.filter(t => t.completed).length} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
} 