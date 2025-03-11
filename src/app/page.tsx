"use client";

import { motion } from "framer-motion";
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 relative overflow-hidden">
      {/* Animasyonlu arka plan öğeleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
          className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Ana içerik */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-3xl mx-auto mt-8 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              ✨ Yapılacaklar Listesi v2 ✨
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
