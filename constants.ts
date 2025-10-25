
import type { Template } from './types';
import { BriefcaseIcon, ChartBarIcon, UsersIcon, CogIcon, AcademicCapIcon } from './components/icons';

export const TEMPLATES: Template[] = [
  {
    name: "Business / Finance",
    description: "Modern and professional theme for financial reports and business KPIs.",
    colors: {
      primary: '#3b82f6', // blue-500
      secondary: '#64748b', // slate-500
      accent: '#14b8a6', // teal-500
      background: 'bg-slate-100',
      text: 'text-slate-800',
      chartFills: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    },
    icon: BriefcaseIcon,
  },
  {
    name: "Sales / Marketing",
    description: "Dynamic and vibrant theme to showcase sales performance and marketing reach.",
    colors: {
      primary: '#10b981', // emerald-500
      secondary: '#f97316', // orange-500
      accent: '#ec4899', // pink-500
      background: 'bg-green-50',
      text: 'text-green-900',
      chartFills: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
    },
    icon: ChartBarIcon,
  },
  {
    name: "HR / People Analytics",
    description: "Clean and approachable theme for human resources data and employee insights.",
    colors: {
      primary: '#8b5cf6', // violet-500
      secondary: '#3b82f6', // blue-500
      accent: '#f59e0b', // amber-500
      background: 'bg-violet-50',
      text: 'text-violet-900',
      chartFills: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    },
    icon: UsersIcon,
  },
  {
    name: "Operations / Manufacturing",
    description: "Robust and clear theme for operational metrics and manufacturing data.",
    colors: {
      primary: '#ef4444', // red-500
      secondary: '#4b5563', // gray-600
      accent: '#f97316', // orange-500
      background: 'bg-red-50',
      text: 'text-red-900',
      chartFills: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
    },
    icon: CogIcon,
  },
  {
    name: "Academic / Research Analytics",
    description: "Scholarly and precise theme for research data and academic findings.",
    colors: {
      primary: '#0e7490', // cyan-700
      secondary: '#475569', // slate-600
      accent: '#65a30d', // lime-600
      background: 'bg-cyan-50',
      text: 'text-cyan-900',
      chartFills: ['#0e7490', '#06b6d4', '#67e8f9', '#cffafe'],
    },
    icon: AcademicCapIcon,
  },
];
