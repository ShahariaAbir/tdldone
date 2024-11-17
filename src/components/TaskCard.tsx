import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { format } from 'date-fns';
import { Grip, Calendar, AlertCircle, MoreVertical, Trash2, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, task: Partial<Task>) => void;
}

export function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'bg-card glass-effect rounded-xl p-4 mb-3',
        'border border-slate-700/50 neon-border card-hover parallax-card',
        'animate-slide-in',
        isDragging && 'opacity-50 rotate-2 scale-105',
      )}
    >
      <div ref={cardRef} className="parallax-content">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab hover:text-sky-400 p-1 transition-colors"
            >
              <Grip className="w-4 h-4" />
            </button>
            <span
              className={clsx(
                'text-xs px-2 py-1 rounded-full border',
                priorityColors[task.priority],
              )}
            >
              {task.priority}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(task.id)}
              className="text-slate-400 hover:text-red-400 p-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {task.status !== 'done' && (
              <button
                onClick={() => onUpdate(task.id, { status: 'done' })}
                className="text-slate-400 hover:text-green-400 p-1 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            <button className="text-slate-400 hover:text-sky-400 p-1 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="font-medium text-slate-200 mb-2">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-slate-400 mb-3">{task.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-400">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
          {task.routine && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-sky-400" />
              <span>{task.routine.frequency}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}