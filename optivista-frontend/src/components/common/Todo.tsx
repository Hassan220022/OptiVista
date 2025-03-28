import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    // Load todos from localStorage on initial load
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever they change
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const newItem: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false
    };
    
    setTodos([...todos, newItem]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Todo List</h2>
        
        <div className="flex mb-4">
          <input 
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <Button 
            variant="primary"
            onClick={addTodo}
            className="rounded-l-none"
          >
            Add
          </Button>
        </div>
        
        <ul className="space-y-2">
          {todos.length === 0 ? (
            <li className="text-gray-500 text-center py-2">No todos yet. Add one above!</li>
          ) : (
            todos.map(todo => (
              <li 
                key={todo.id}
                className="flex items-center justify-between p-3 border rounded shadow-sm bg-white"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                    {todo.text}
                  </span>
                </div>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
};

export default TodoList; 