"use client";

import { useState } from "react";

export default function TodoForm({ addTodo }) {

    const [task, setTask] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!task.trim()) {
            return;
        }

        addTodo(task);

        setTask("");
    };

    return (
        <form onSubmit={handleSubmit}>

            <input
                type="text"
                placeholder="Enter your task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />

            <button type="submit">
                Add Task
            </button>

        </form>
    );
}