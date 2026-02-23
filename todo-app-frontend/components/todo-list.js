'use client';

import { useEffect, useState } from 'react';
import { fetchTodos, updateTodo, deleteTodo } from '@/lib/api';
import { TodoForm } from './todo-form';
import { TodoItem } from './todo-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await updateTodo(id, { completed });
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Todo List Updated
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TodoForm onTodoAdded={(todo) => setTodos([todo, ...todos])} />
        
        {loading ? (
          <div className="text-center py-4">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No todos yet. Add one above!
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}