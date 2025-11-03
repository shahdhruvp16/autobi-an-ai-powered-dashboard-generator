import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ResponsiveContainer,
    LineChart, Line, AreaChart, Area,
    BarChart, Bar,
    PieChart, Pie, Cell,
    ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
} from 'recharts';
import type { Template, AnalysisResult, CsvData, ChartSuggestion, ChartType, CsvRow } from '../types';
import { exportForPowerBI, exportForTableau } from '../services/exportService';

// --- Icon Components ---
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const LightBulbIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.62A6.01 6.01 0 0012 1.25a6.01 6.01 0 00-1.5 11.62v5.25m-3.75 0h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5z" /></svg>;
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const Modal = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
            <div className="text-slate-300">{children}</div>
            <button onClick={onClose} className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full">Close</button>
        </div>
    </motion.div>
);

// =================================================================================
//  1. SUB-COMPONENT: KPI Card
// =================================================================================
const formatNumber = (v: number) => {
    if (Math.abs(v) > 1000000) return (v / 1000000).toFixed(1) + 'M';
    if (Math.abs(v) > 1000) return (v / 1000).toFixed(1) + 'K';
    return v.toLocaleString();
};
const KPI: React.FC<{ title: string; value: number; series?: number[]; color: string }> = ({ title, value, series = [], color }) => {
    const trend = series.length >= 2 ? series[series.length - 1] - series[0] : 0;
    const trendPercentage = series[0] ? (trend / series[0]) * 100 : 0;
    const trendColor = trend >= 0 ? 'text-emerald-400' : 'text-rose-400';
    const trendSign = trend >= 0 ? '▲' : '▼';
    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full">
            <h4 className="text-sm text-slate-400 truncate">{title}</h4>
            <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                    <div className="text-3xl font-bold text-slate-100">{formatNumber(value)}</div>
                    {series.length > 1 && (
                        <div className={`mt-1 text-xs font-medium flex items-center gap-1 ${trendColor}`}>
                            {trendSign} {Math.abs(trendPercentage).toFixed(1)}%
                        </div>
                    )}
                </div>
                <div className="w-20 h-10">
                    <ResponsiveContainer width="100%" height="100%"><LineChart data={series.map(s => ({ value: s }))}><Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// =================================================================================
//  2. SUB-COMPONENT: Recharts Chart Renderer
// =================================================================================
const transformForGrouped = (data: CsvData, categoryKey: string, groupKey: string, valueKey: string) => {
    if (!categoryKey || !groupKey || !valueKey) return { transformedData: [], groupKeys: [] };
    const groupKeys = Array.from(new Set(data.map(row => String(row[groupKey])))).sort();
    const groupedData = data.reduce<Record<string, CsvRow>>((acc, row) => {
        const category = String(row[categoryKey]);
        const group = String(row[groupKey]);
        const value = Number(row[valueKey]) || 0;
        if (!acc[category]) acc[category] = { [categoryKey]: category };
        acc[category][group] = (Number(acc[category][group]) || 0) + value;
        return acc;
    }, {});
    return { transformedData: Object.values(groupedData), groupKeys };
};
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-600 p-3 rounded-md shadow-lg"><p className="label text-sm font-medium text-slate-300">{`${label}`}</p>
                {payload.map((p: any, index: number) => (<p key={index} style={{ color: p.color }} className="intro text-sm">{`${p.name}: ${p.value.toLocaleString()}`}</p>))}
            </div>
        );
    }
    return null;
};
const RenderChart: React.FC<{ chart: ChartSuggestion; data: CsvData; color: string; type: ChartType }> = ({ chart, data, color, type }) => {
    const chartComponent = useMemo(() => {
        const commonProps = { margin: { top: 5, right: 20, left: 0, bottom: 20 } };
        const commonGrid = <CartesianGrid strokeDasharray="3 3" stroke="#475569" />;
        const commonXAxis = <XAxis dataKey={chart.x_axis} name={chart.x_axis ?? undefined} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} interval="preserveStartEnd" />;
        const commonYAxis = <YAxis dataKey={chart.y_axis} name={chart.y_axis ?? undefined} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />;
        const commonTooltip = <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />;
        const COLORS = ['#38bdf8', '#fb923c', '#a78bfa', '#4ade80', '#f472b6', '#2dd4bf', '#facc15', '#a3a3a3'];

        switch (type) {
            case 'line':
                return <LineChart data={data} {...commonProps}>{commonGrid}{commonXAxis}{commonYAxis}{commonTooltip}<Line type="monotone" dataKey={chart.y_axis} name={chart.y_axis} stroke={color} strokeWidth={2} dot={false} /></LineChart>;
            case 'bar':
                return <BarChart data={data} {...commonProps}>{commonGrid}{commonXAxis}{commonYAxis}{commonTooltip}<Bar dataKey={chart.y_axis} name={chart.y_axis} fill={color} radius={[4, 4, 0, 0]} /></BarChart>;
            case 'area':
                return <AreaChart data={data} {...commonProps}>{commonGrid}{commonXAxis}{commonYAxis}{commonTooltip}<defs><linearGradient id={`color-${chart.y_axis}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.8} /><stop offset="95%" stopColor={color} stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey={chart.y_axis} name={chart.y_axis} stroke={color} fill={`url(#color-${chart.y_axis})`} strokeWidth={2} /></AreaChart>;
            
            case 'grouped-bar': {
                if (!chart.x_axis || !chart.grouping_column) return <div className="text-center text-slate-400">Grouped-bar chart requires an X-axis and a Grouping Column.</div>;
                const { transformedData, groupKeys } = transformForGrouped(data, chart.x_axis, chart.grouping_column, chart.y_axis);
                return <BarChart data={transformedData} {...commonProps}>{commonGrid}{commonXAxis}{commonYAxis}{commonTooltip}<Legend iconSize={10} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />{groupKeys.map((key, index) => <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} />)}</BarChart>;
            }
            
            case 'stacked-bar': {
                if (!chart.x_axis || !chart.grouping_column) return <div className="text-center text-slate-400">Stacked-bar chart requires an X-axis and a Grouping Column.</div>;
                const { transformedData, groupKeys } = transformForGrouped(data, chart.x_axis, chart.grouping_column, chart.y_axis);
                return <BarChart data={transformedData} {...commonProps}>{commonGrid}{commonXAxis}{commonYAxis}{commonTooltip}<Legend iconSize={10} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />{groupKeys.map((key, index) => <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} stackId="a" />)}</BarChart>;
            }

            case 'scatter': {
                if (!chart.x_axis) return <div className="text-center text-slate-400">Scatter plot requires an X-axis.</div>;
                const scatterXAxis = <XAxis type="number" dataKey={chart.x_axis} name={chart.x_axis} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />;
                return <ScatterChart {...commonProps}>{commonGrid}{scatterXAxis}{commonYAxis}{commonTooltip}<Scatter name={chart.title} data={data} fill={color} /></ScatterChart>;
            }

            case 'pie': {
                const pieData = data.slice(0, 8).map(r => ({ name: r[chart.x_axis!], value: Number(r[chart.y_axis!]) || 0 }));
                return <PieChart><RechartsTooltip content={<CustomTooltip />} /><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill={color}>{pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Legend iconSize={10} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} /></PieChart>;
            }

            case 'donut': {
                const pieData = data.slice(0, 8).map(r => ({ name: r[chart.x_axis!], value: Number(r[chart.y_axis!]) || 0 }));
                return <PieChart><RechartsTooltip content={<CustomTooltip />} /><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill={color} paddingAngle={5}>{pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Legend iconSize={10} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} /></PieChart>;
            }
            
            default:
                return <div className="text-center text-slate-400">Chart type '{type}' not supported.</div>;
        }
    }, [chart, data, color, type]);

    return <ResponsiveContainer width="100%" height="100%">{chartComponent}</ResponsiveContainer>;
};

// =================================================================================
//  3. SUB-COMPONENT: Chart Card Wrapper (with Type Switcher)
// =================================================================================
const getCompatibleChartTypes = (originalType: ChartType): ChartType[] => {
    switch (originalType) {
        case 'line': return ['line', 'bar', 'area', 'scatter'];
        case 'bar': return ['bar', 'line', 'area'];
        case 'area': return ['area', 'line', 'bar'];
        case 'grouped-bar': return ['grouped-bar', 'stacked-bar'];
        case 'stacked-bar': return ['stacked-bar', 'grouped-bar'];
        case 'pie': return ['pie', 'donut'];
        case 'donut': return ['donut', 'pie'];
        case 'scatter': return ['scatter', 'line'];
        default: return [originalType];
    }
};
const ChartCard: React.FC<{ chart: ChartSuggestion; data: CsvData; color: string }> = ({ chart, data, color }) => {
    const compatibleTypes = chart.compatibleChartTypes?.length ? chart.compatibleChartTypes : getCompatibleChartTypes(chart.chartType);
    const [activeChartType, setActiveChartType] = useState<ChartType>(chart.chartType);
    
    useEffect(() => {
        if (!compatibleTypes.includes(activeChartType)) {
            setActiveChartType(chart.chartType);
        }
    }, [chart.chartType, compatibleTypes, activeChartType]);

    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-4 gap-2">
                <h3 className="text-base font-semibold text-slate-200 truncate pr-2">{chart.title}</h3>
                {compatibleTypes.length > 1 && (
                    <select value={activeChartType} onChange={(e) => setActiveChartType(e.target.value as ChartType)} className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {compatibleTypes.map(type => <option key={type} value={type} className="capitalize bg-slate-800">{type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                    </select>
                )}
            </div>
            <div className="flex-grow"><RenderChart chart={chart} data={data} color={color} type={activeChartType} /></div>
        </div>
    );
};

// =================================================================================
//  4. SUB-COMPONENT: Sidebar
// =================================================================================
const Sidebar: React.FC<{ analysis: AnalysisResult; data: CsvData; onFilterChange: React.Dispatch<React.SetStateAction<Record<string, string>>> }> = ({ analysis, data, onFilterChange }) => {
    const filterOptions = useMemo(() => {
        const opts: Record<string, string[]> = {};
        analysis.filterableColumns?.forEach(col => {
            const unique = Array.from(new Set(data.map(r => String(r[col] ?? '')))).sort();
            opts[col] = ['All', ...unique];
        });
        return opts;
    }, [data, analysis.filterableColumns]);
    return (
        <aside className="col-span-12 lg:col-span-3 bg-slate-800/50 p-5 rounded-lg border border-slate-700 h-fit">
            <div className="flex items-center gap-3 mb-4"><LightBulbIcon className="w-6 h-6 text-yellow-400" /><h2 className="text-lg font-semibold text-slate-100">Key Insights</h2></div>
            <ul className="text-sm space-y-2.5 text-slate-400 mb-6">{analysis.insights.slice(0, 5).map((insight, idx) => (<li key={idx} className="flex items-start gap-2"><span className="text-yellow-400 mt-1">&#8226;</span><span>{insight}</span></li>))}</ul>
            {analysis.filterableColumns && analysis.filterableColumns.length > 0 && (<div className="border-t border-slate-700 pt-6"><h3 className="text-base font-semibold text-slate-200 mb-3">Filters</h3><div className="space-y-4">{analysis.filterableColumns.map(col => (<label key={col} className="block text-sm"><span className="text-xs font-medium text-slate-400">{col}</span><select aria-label={`Filter by ${col}`} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => onFilterChange(prev => ({ ...prev, [col]: e.target.value }))}>{filterOptions[col].map(opt => <option key={opt} value={opt} className="bg-slate-800">{opt}</option>)}</select></label>))}</div></div>)}
        </aside>
    );
};

// =================================================================================
//  5. SUB-COMPONENT: Dashboard Header (with Presentation Button)
// =================================================================================
const DashboardHeader: React.FC<{ analysis: AnalysisResult; template: Template; isProcessing: boolean; onExport: (format: 'png' | 'jpeg' | 'pdf') => void; onAdvancedExport: (type: 'powerbi' | 'tableau') => void; onReset: () => void; onTogglePresentation: () => void; }> = ({ analysis, template, isProcessing, onExport, onAdvancedExport, onReset, onTogglePresentation }) => {
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    return (
        <header className="flex flex-wrap items-center justify-between gap-4">
            <div><h1 className="text-2xl font-bold" style={{ color: template.colors.primary }}>{analysis.dataType} Dashboard</h1><p className="text-sm text-gray-400 mt-1 max-w-2xl">{analysis.summary}</p></div>
            <div className="flex items-center gap-2">
                <button onClick={onTogglePresentation} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-sm font-medium transition-colors"><EyeIcon className="w-4 h-4" /><span>Presentation</span></button>
                <div className="relative">
                    <button onClick={() => setIsExportMenuOpen(v => !v)} disabled={isProcessing} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium transition-colors disabled:opacity-50"><DownloadIcon className="w-4 h-4" /><span>{isProcessing ? 'Exporting...' : 'Export'}</span><ChevronDownIcon className="w-4 h-4" /></button>
                    <AnimatePresence>{isExportMenuOpen && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-56 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10 p-2"><button onClick={() => { onExport('png'); setIsExportMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm hover:bg-slate-600 rounded">Export as PNG</button><button onClick={() => { onExport('jpeg'); setIsExportMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm hover:bg-slate-600 rounded">Export as JPEG</button><button onClick={() => { onExport('pdf'); setIsExportMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm hover:bg-slate-600 rounded">Export as PDF</button><div className="border-t border-slate-600 my-2"></div><button onClick={() => { onAdvancedExport('powerbi'); setIsExportMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm hover:bg-slate-600 rounded">For Power BI</button><button onClick={() => { onAdvancedExport('tableau'); setIsExportMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm hover:bg-slate-600 rounded">For Tableau</button></motion.div>)}</AnimatePresence>
                </div>
                <button onClick={onReset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-sm font-medium transition-colors">Start Over</button>
            </div>
        </header>
    );
};

// =================================================================================
//  6. SUB-COMPONENT: Presentation Mode View
// =================================================================================
const PresentationView: React.FC<{ charts: ChartSuggestion[]; data: CsvData; template: Template; currentIndex: number; onExit: () => void; }> = ({ charts, data, template, currentIndex, onExit }) => {
    const chart = charts[currentIndex];
    const color = template.colors.chartFills[currentIndex % template.colors.chartFills.length];
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900 z-40 flex flex-col p-8">
            <header className="flex justify-between items-center w-full">
                <div className="text-slate-300">
                    <h2 className="text-xl font-bold" style={{ color: template.colors.primary }}>{chart.title}</h2>
                    <p className="text-sm">Showing chart {currentIndex + 1} of {charts.length}</p>
                </div>
                <button onClick={onExit} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium">Exit Presentation</button>
            </header>
            <main className="flex-grow flex items-center justify-center h-full w-full py-8">
                <div className="w-full h-full max-w-6xl bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <RenderChart chart={chart} data={data} color={color} type={chart.chartType} />
                </div>
            </main>
        </motion.div>
    );
};

// =================================================================================
//  MAIN DASHBOARD COMPONENT
// =================================================================================
interface DashboardProps { data: CsvData; fileName: string; analysis: AnalysisResult; template: Template; onReset: () => void; }

const UpgradedDashboard: React.FC<DashboardProps> = ({ data, fileName, analysis, template, onReset }) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [modalContent, setModalContent] = useState<{ title: string; body: React.ReactNode } | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [isProcessingExport, setIsProcessingExport] = useState(false);
    const [presentationMode, setPresentationMode] = useState(false);
    const [presentationIndex, setPresentationIndex] = useState(0);

    const filteredData = useMemo(() => {
        const filterKeys = Object.keys(activeFilters);
        if (filterKeys.length === 0) return data;
        return data.filter(row => filterKeys.every(key => activeFilters[key] === 'All' || String(row[key]) === activeFilters[key]));
    }, [data, activeFilters]);

    const kpis = useMemo(() => analysis.chartSuggestions.filter(c => c.chartType === 'kpi'), [analysis]);
    const charts = useMemo(() => analysis.chartSuggestions.filter(c => c.chartType !== 'kpi'), [analysis]);
    
    useEffect(() => {
        if (presentationMode && charts.length > 1) {
            const interval = setInterval(() => {
                setPresentationIndex(prev => (prev + 1) % charts.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [presentationMode, charts.length]);

    const exportDashboard = useCallback(async (format: 'png' | 'jpeg' | 'pdf') => {
        if (!rootRef.current) return;
        setIsProcessingExport(true);
        try {
            const canvas = await html2canvas(rootRef.current, { scale: 2, useCORS: true, backgroundColor: '#111827' });
            if (format === 'pdf') {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`AutoBI_Dashboard.pdf`);
            } else {
                const link = document.createElement('a'); link.href = canvas.toDataURL(`image/${format}`); link.download = `AutoBI_Dashboard.${format}`; link.click();
            }
        } finally { setIsProcessingExport(false); }
    }, []);

    const handleAdvancedExport = async (type: 'powerbi' | 'tableau') => {
        setIsProcessingExport(true);
        await new Promise(res => setTimeout(res, 600));
        if (type === 'powerbi') { exportForPowerBI(analysis, data, fileName); setModalContent({ title: 'Power BI Guide Downloaded', body: <div className="text-sm">A Power BI JSON guide has been exported.</div> }); }
        else { exportForTableau(analysis, fileName); setModalContent({ title: 'Tableau Workbook Downloaded', body: <div className="text-sm">A .twb file has been exported.</div> }); }
        setIsProcessingExport(false);
    };

    return (
        <div className="bg-gray-900 text-slate-200 min-h-screen font-sans">
            <AnimatePresence>{modalContent && <Modal title={modalContent.title} onClose={() => setModalContent(null)}>{modalContent.body}</Modal>}</AnimatePresence>
            <AnimatePresence>{presentationMode && <PresentationView charts={charts} data={filteredData} template={template} currentIndex={presentationIndex} onExit={() => setPresentationMode(false)} />}</AnimatePresence>
            <div className="p-4 md:p-6 lg:p-8" ref={rootRef}>
                <DashboardHeader analysis={analysis} template={template} isProcessing={isProcessingExport} onExport={exportDashboard} onAdvancedExport={handleAdvancedExport} onReset={onReset} onTogglePresentation={() => setPresentationMode(true)} />
                <main className="grid grid-cols-12 gap-6 mt-6">
                    <Sidebar analysis={analysis} data={data} onFilterChange={setActiveFilters} />
                    <section className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {kpis.map((k, i) => {
                                const value = filteredData.reduce((s, r) => s + (Number(r[k.y_axis]) || 0), 0);
                                const series = filteredData.slice(-30).map(r => Number(r[k.y_axis]) || 0);
                                return <KPI key={i} title={k.title} value={value} series={series} color={template.colors.chartFills[i % template.colors.chartFills.length]} />;
                            })}
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {charts.map((chart, idx) => (
                                <ChartCard key={idx} chart={chart} data={filteredData} color={template.colors.chartFills[idx % template.colors.chartFills.length]} />
                            ))}
                        </div>
                    </section>
                </main>
                <footer className="mt-8 text-center text-xs text-gray-500">Generated by AutoBI • {new Date().toLocaleString()}</footer>
            </div>
        </div>
    );
};

export default UpgradedDashboard;