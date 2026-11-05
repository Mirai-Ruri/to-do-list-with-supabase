"use client";

import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // READ
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch Error:", error.message);
      setLoading(false);
      return;
    }

    setTodos(data);
    setLoading(false);
  };

  // FETCH WHEN PAGE LOADS
  useEffect(() => {
    fetchTodos();
  }, []);

  // CREATE
  const addTodo = async (task) => {
    const { error } = await supabase.from("todos").insert({
      title: task.trim(),
      completed: false,
    });

    if (error) {
      console.error("Insert Error:", error.message);
      alert(error.message);
      return;
    }

    await fetchTodos();
  };

  // UPDATE
  const editTodo = async (id) => {
    const newTitle = prompt("Enter updated task:");

    if (!newTitle || !newTitle.trim()) {
      return;
    }

    const { error } = await supabase
      .from("todos")
      .update({
        title: newTitle.trim(),
      })
      .eq("id", id);

    if (error) {
      console.error("Update Error:", error.message);
      alert(error.message);
      return;
    }

    await fetchTodos();
  };

  // DELETE
  const deleteTodo = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Delete Error:", error.message);
      alert(error.message);
      return;
    }

    await fetchTodos();
  };

  // COMPLETE
  const completeTodo = async (id, completed) => {
    const { error } = await supabase
      .from("todos")
      .update({
        completed: !completed,
      })
      .eq("id", id);

    if (error) {
      console.error("Complete Error:", error.message);
      alert(error.message);
      return;
    }

    await fetchTodos();
  };

  return (
    <div className="container">
      <h1>My To-Do List</h1>

      <TodoForm addTodo={addTodo} />

      <div className="todo-list">
        {loading ? (
          <p>Loading tasks...</p>
        ) : todos.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          todos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>

              <div className="buttons">
                <button onClick={() => completeTodo(todo.id, todo.completed)}>
                  {todo.completed ? "Undo" : "Complete"}
                </button>

                <button onClick={() => editTodo(todo.id)}>Edit</button>

                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
