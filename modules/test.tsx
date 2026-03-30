"use client"; //Tells Next.js this is a client-side component
import React, { FormEvent } from "react"; //Imports react and FormEvent (the type used for form submission events)
import { useState } from "react"; //Imports useState hook that allows you to create and manage state variables
import styles from "./test.module.css"; //Imports CSS file as an object so you can reference it

// Your Test Starts Here

type Priority = "Low" | "Medium" | "High"; //Custom type for priority that can only ever be those three strings
type Filter = "All" | "Active" | "Completed"; //Custome type for filter, same logic as priority

interface Task {
  //Defines the task object, every task has these five fields
  id: number;
  name: string;
  status: string;
  priority: Priority;
  completed: boolean;
}

export default function TaskManager(): JSX.Element {
  const [name, setName] = useState("");
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [priority, setPriority] = useState<Priority>("Medium");
  const [filter, setFilter] = useState<Filter>("All");
  const [error, setError] = useState("");

  //Add Task
  const handleAddTask = () => {
    if (!name.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    setError(""); //Clears existing error since validation passed

    setTaskList((prev) => [
      {
        id: Date.now(),
        name: name.trim(),
        status: "Active",
        priority,
        completed: false,
      }, //Adds the new task to the front of the array
      ...prev,
    ]);
    setName("");
    setPriority("Medium");
  };

  //Control Checkbox for completion
  const handleCheckbox = (id: number) => {
    //Takes the id of the task that was clicked
    setTaskList((prev) =>
      prev.map(
        (item) =>
          item.id === id ? { ...item, completed: !item.completed } : item, //loops through every task, if the current task's id matches the one clicked, it flips completed with !, otherwise it returns the task unchanged
      ),
    );
  };

  //Form Submission
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //Stops page from reloading
    handleAddTask();
  };

  //Task Deletion
  const handleDelete = (id: number) => {
    setTaskList((prev) => prev.filter((item) => item.id !== id)); //Filters the task list to keep only the items that the user did not click delete for
  };

  //Filtering
  const filteredTasks = taskList
    .filter((item) => {
      if (filter === "Active") return !item.completed;
      if (filter === "Completed") return item.completed;
      if (filter === "All") return true;
      return true;
    })
    .sort((a, b) => {
      if (!a.completed && b.completed) return -1; //-1 means that a comes first
      if (a.completed && !b.completed) return 1; //1 means that b comes first
      return 0; //0 means no change
    });

  //Enter key handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //Listens for key presses on the Enter key, calls handleAddTask if pressed
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  //React Portion
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>To Do List</h1>

      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            type="text"
            value={name}
            placeholder="Task name"
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
          />

          <select
            className={styles.select}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button className={styles.addButton} type="submit">
            Add Task
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>

      <div className={styles.filters}>
        {(["All", "Active", "Completed"] as Filter[]).map((f) => (
          <button
            key={f}
            className={`${styles.filterButton} ${filter === f ? styles.filterActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <p className={styles.empty}>No Applicable Tasks</p>
      ) : (
        <ul className={styles.taskList}>
          {filteredTasks.map((item) => (
            <li
              key={item.id}
              className={`${styles.taskItem} ${item.completed ? styles.taskCompleted : ""}`}
            >
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={item.completed}
                onChange={() => handleCheckbox(item.id)}
              />
              <span className={styles.taskTitle}>{item.name}</span>
              <span
                className={`${styles.badge} ${styles[`priority${item.priority}` as keyof typeof styles]}`}
              >
                {item.priority}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
