
// FIX: Import React to provide the 'React' namespace for ComponentType.
import React from 'react';

export interface Template {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    chartFills: string[];
  };
  // FIX: Added `style` to the component props type to allow inline styling of icons.
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export type ChartType = 'line' | 'bar' | 'scatter' | 'pie' | 'area' | 'donut' | 'grouped-bar' | 'stacked-bar' | 'funnel' | 'kpi';

export interface ChartSuggestion {
  chartType: ChartType;
  compatibleChartTypes: ChartType[];
  title: string;
  x_axis: string | null;
  y_axis: string;
  grouping_column?: string | null;
}

export interface AnalysisResult {
  dataType: string;
  suggestedTemplate: string;
  summary: string;
  insights: string[];
  chartSuggestions: ChartSuggestion[];
  filterableColumns?: string[];
}

export type CsvRow = Record<string, string | number>;
export type CsvData = CsvRow[];

export interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}