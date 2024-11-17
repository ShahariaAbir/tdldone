import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from './types';

interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  filterPriority: Task['priority'] | 'all';
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: Task['priority'] | 'all') => void;
  clearCompletedTasks: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      searchQuery: '',
      filterPriority: 'all',
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })),
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      reorderTasks: (tasks) => set({ tasks }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilterPriority: (filterPriority) => set({ filterPriority }),
      clearCompletedTasks: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== 'done'),
        })),
    }),
    {
      name: 'task-storage',
    }
  )
);