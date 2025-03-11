"use client";

import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-2">✨ Yapılacaklar Listesi v2 ✨</h1>
        <p className="text-gray-600">
          Görevlerinizi organize edin, önceliklendirin ve tamamlayın
        </p>
      </header>
      <TodoList />
    </main>
  );
}
