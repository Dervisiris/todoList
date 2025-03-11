"use client";

import { motion } from "framer-motion";
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4 relative overflow-hidden">
      {/* Optimize edilmiş arka plan öğeleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
          className="absolute top-1/2 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl"
        />
      </div>

      {/* Ana içerik */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-2xl mx-auto mt-10 bg-white/95 backdrop-blur rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              ✨ Yapılacaklar Listesi ✨
            </h1>
            <p className="text-gray-600">
              Görevlerinizi organize edin, önceliklendirin ve tamamlayın
            </p>
          </motion.div>
          <TodoList />
        </div>
      </motion.div>
    </main>
  );
}
