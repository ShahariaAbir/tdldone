import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onAddTask: (status: Task['status']) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
}

export function TaskColumn({
  title,
  tasks,
  status,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      className={clsx(
        'flex flex-col h-full w-80',
        'bg-column glass-effect rounded-xl p-4',
        'border border-slate-700/50',
        'transition-all duration-200',
        isOver && 'scale-105 border-sky-500/50 neon-border'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-200">{title}</h2>
        <span className="text-sm text-slate-400 bg-slate-700/30 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <button
        onClick={() => onAddTask(status)}
        className={clsx(
          'w-full py-2 px-4 rounded-lg mb-4',
          'text-sm font-medium flex items-center justify-center gap-2',
          'bg-sky-500/10 border border-sky-500/20 text-sky-300',
          'hover:bg-sky-500/20 transition-all duration-200',
          'hover:border-sky-500/30 hover:scale-102'
        )}
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}