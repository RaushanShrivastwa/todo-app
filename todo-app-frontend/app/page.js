import { TodoList } from '@/components/todo-list';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <TodoList />
      </div>
    </main>
  );
}