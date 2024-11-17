import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TaskColumn } from './components/TaskColumn';
import { TaskDialog } from './components/TaskDialog';
import { SearchBar } from './components/SearchBar';
import { useTaskStore } from './store';
import { Task } from './types';
import { ClipboardList, Trash2 } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    clearCompletedTasks,
    searchQuery,
    filterPriority,
  } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Task['status']>('todo');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask || !overTask) return;

    const activeIndex = tasks.indexOf(activeTask);
    const overIndex = tasks.indexOf(overTask);

    if (activeIndex !== overIndex) {
      reorderTasks(arrayMove(tasks, activeIndex, overIndex));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    if (overId === activeTask.status) return;

    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      updateTask(activeTask.id, { status: overId });
    }
  };

  const handleAddTask = (status: Task['status']) => {
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="cyber-gradient" />
      
      <header className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-sky-400 animate-glow" />
              <h1 className="text-xl font-semibold text-slate-200 neon-text">Task Board</h1>
            </div>
            <button
              onClick={clearCompletedTasks}
              className="cyber-button flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Completed
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar />
        
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="flex gap-6 h-[calc(100vh-16rem)]">
            <TaskColumn
              title="To Do"
              status="todo"
              tasks={todoTasks}
              onAddTask={handleAddTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
            <TaskColumn
              title="In Progress"
              status="in-progress"
              tasks={inProgressTasks}
              onAddTask={handleAddTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
            <TaskColumn
              title="Done"
              status="done"
              tasks={doneTasks}
              onAddTask={handleAddTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          </div>
        </DndContext>
      </main>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={(task) => addTask({ ...task, status: selectedStatus })}
        initialStatus={selectedStatus}
      />
    </div>
  );
}

export default App;