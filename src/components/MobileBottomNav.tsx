import React from 'react';
import {
  BarChart3,
  BookOpen,
  Bot,
  ClipboardCheck,
  FilePlus2,
  Home,
  LayoutDashboard,
  MonitorPlay,
} from 'lucide-react';
import { UserRole } from '../types';

interface MobileBottomNavProps {
  currentRole: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const studentItems = [
  { path: '/student', label: 'Lessons', icon: BookOpen },
  { path: '/student/tutor', label: 'Sathi', icon: Bot },
  { path: '/student/quiz', label: 'Quiz', icon: ClipboardCheck },
  { path: '/student/progress', label: 'Progress', icon: BarChart3 },
];

const teacherItems = [
  { path: '/teacher', label: 'Desk', icon: LayoutDashboard },
  { path: '/teacher/create-lesson', label: 'Create', icon: FilePlus2 },
  { path: '/teacher/classroom', label: 'Classroom', icon: MonitorPlay },
  { path: '/teacher/analytics', label: 'Analytics', icon: BarChart3 },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  currentPath,
  onNavigate,
}) => {
  const items = currentRole === 'teacher' ? teacherItems : studentItems;

  return (
    <nav
      aria-label={`${currentRole === 'teacher' ? 'Teacher' : 'Student'} quick navigation`}
      className="safe-area-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {items.map(({ path, label, icon: Icon }) => {
          const active =
            currentPath === path ||
            (path === '/student' && currentPath === '/student/progress') ||
            (path === '/teacher' && currentPath === '/teacher');

          return (
            <button
              key={path}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(path)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-bold transition-colors ${
                active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};