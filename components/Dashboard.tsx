
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
  BarChart, Bar,
  ScatterChart, Scatter,
  PieChart, Pie, Cell,
  FunnelChart, Funnel, Tooltip as RechartsTooltip,
  XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import type { Template, AnalysisResult, CsvData, ChartSuggestion, ChartType, CsvRow } from '../types';
import { ArrowLeftIcon, DownloadIcon, ChevronDownIcon } from './icons';
import { exportForPowerBI, exportForTableau } from '../services/exportService';
import Modal from './Modal';


interface DashboardProps {
  data: CsvData;
  fileName: string;
  analysis: AnalysisResult;
  template: Template;
  onReset: () => void;
}

// Data transformation for complex charts
const transformForGroupedOrStacked = (data: CsvData, categoryKey: string, groupKey: string, valueKey: string) => {
    if (!categoryKey || !groupKey || !valueKey) return [];

    const groupedData = data.reduce<Record<string, CsvRow>>((acc, row) => {
        const category = row[categoryKey];
        const group = row[groupKey];
        const value = Number(row[valueKey]) || 0;

        if (!acc[category]) {
            acc[category] = { [categoryKey]: category };
        }
        // FIX: Explicitly cast the accumulator value to a number before adding to prevent type errors.
        acc[category][group] = (Number(acc[category][group]) || 0) + value;
        return acc;
    }, {});
    
    return Object.values(groupedData);
};

const KPIComponent: React.FC<{
    data: CsvData;
    chartInfo: ChartSuggestion;
    colors: string[];
}> = ({ data, chartInfo, colors }) => {
    const { y_axis } = chartInfo;

    const kpiValue = useMemo(() => {
        return data.reduce((sum, row) => sum + (Number(row[y_axis]) || 0), 0);
    }, [data, y_axis]);

    // Sanitize color for use in SVG id
    const gradientId = `kpiGradient-${colors[0].replace(/#/g, '')}`;

    return (
        <div className="relative w-full h-full flex flex-col justify-start p-6">
            <div 
                className="absolute text-5xl md:text-6xl font-bold z-10" 
                style={{ color: colors[0], top: '45%', transform: 'translateY(-50%)' }}
            >
                {kpiValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-2/3 opacity-60 z-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                        data={data}
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey={y_axis} 
                            stroke={colors[0]} 
                            strokeWidth={3} 
                            fill={`url(#${gradientId})`} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const ChartComponent: React.FC<{
  chartInfo: ChartSuggestion;
  currentChartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  data: CsvData;
  colors: string[];
}> = ({ chartInfo, currentChartType, onChartTypeChange, data, colors }) => {
  const { title, x_axis, y_axis, grouping_column, compatibleChartTypes } = chartInfo;
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const renderChart = () => {
    const chartProps = {
        margin: { top: 20, right: 20, left: -10, bottom: 5 },
    };

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data for this selection.</div>
    }

    switch (currentChartType) {
      case 'line':
      case 'area':
        const ChartComponent = currentChartType === 'line' ? LineChart : AreaChart;
        const DataComponent = currentChartType === 'line' ? Line : Area;
        return (
          <ChartComponent data={data} {...chartProps}>
            <defs>
              <linearGradient id={`colorGradient-${colors[0].replace(/#/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey={x_axis || undefined} stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
            <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <DataComponent type="monotone" dataKey={y_axis} stroke={colors[0]} strokeWidth={2} fillOpacity={1} fill={currentChartType === 'area' ? `url(#colorGradient-${colors[0].replace(/#/g, '')})` : undefined} activeDot={{ r: 8 }} dot={{ r: 4 }} />
          </ChartComponent>
        );
      case 'bar':
      case 'grouped-bar':
      case 'stacked-bar':
        const transformedData = (currentChartType === 'grouped-bar' || currentChartType === 'stacked-bar') && grouping_column && x_axis
          ? transformForGroupedOrStacked(data, x_axis, grouping_column, y_axis) 
          : data;
        
        const keys = (transformedData.length > 0 && x_axis) ? Object.keys(transformedData[0]).filter(k => k !== x_axis) : [];

        return (
          <BarChart data={transformedData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey={x_axis || undefined} stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false}/>
            <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            {keys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} stackId={currentChartType === 'stacked-bar' ? 'a' : undefined} />
            ))}
          </BarChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
            <XAxis type="number" dataKey={grouping_column || x_axis || undefined} name={grouping_column || x_axis || ''} stroke="currentColor" fontSize={12} />
            <YAxis type="number" dataKey={y_axis} name={y_axis} stroke="currentColor" fontSize={12}/>
            <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
            <Scatter name={title} data={data} fill={colors[0]} />
          </ScatterChart>
        );
      case 'pie':
      case 'donut':
        if (!x_axis) return null;
        const pieData = data.reduce((acc, item) => {
            const name = item[x_axis] as string;
            const value = (item[y_axis] as number) || 0;
            const existing = acc.find(d => d.name === name);
            if (existing) {
                existing.value += value;
            } else {
                acc.push({ name, value });
            }
            return acc;
        }, [] as {name: string, value: number}[]).sort((a,b) => b.value - a.value).slice(0, 10);

        return (
            <PieChart {...chartProps}>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={currentChartType === 'donut' ? 60 : 0} outerRadius={90} paddingAngle={2}>
                    {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }}/>
                <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}} />
            </PieChart>
        );
      case 'funnel':
        if (!x_axis) return null;
        const funnelData = data.map(row => ({
            name: row[x_axis] as string,
            value: Number(row[y_axis]) || 0,
            fill: colors[Math.floor(Math.random() * colors.length)]
        })).sort((a, b) => b.value - a.value);

        return (
            <FunnelChart {...chartProps}>
                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }}/>
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    {funnelData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
                    ))}
                </Funnel>
            </FunnelChart>
        )
      // KPI case is handled outside this function
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  const capitalize = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="glassmorphism rounded-xl shadow-lg border border-white/10 h-full flex flex-col overflow-hidden">
        <div className="flex justify-between items-start p-4 z-20">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
            <div className="relative">
                <button
                    onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-white/20 dark:bg-gray-700/50 rounded-md hover:bg-white/40 dark:hover:bg-gray-600/50"
                >
                    {capitalize(currentChartType)}
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSelectorOpen && (
                    <div 
                        className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-30 fade-in"
                        onMouseLeave={() => setIsSelectorOpen(false)}
                    >
                        {compatibleChartTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => {
                                    onChartTypeChange(type);
                                    setIsSelectorOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 text-sm ${currentChartType === type ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                            >
                                {capitalize(type)}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex-grow -mt-12">
            {currentChartType === 'kpi' ? (
                <KPIComponent data={data} chartInfo={chartInfo} colors={colors} />
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            )}
        </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ data, fileName, analysis, template, onReset }) => {
  const [isExporting, setIsExporting] = useState<false | 'powerbi' | 'tableau'>(false);
  const [modalContent, setModalContent] = useState<{ title: string; body: React.ReactNode } | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  
  const initialChartTypes = useMemo(() => 
    analysis.chartSuggestions.map(suggestion => suggestion.chartType), 
    [analysis.chartSuggestions]
  );
  const [chartTypes, setChartTypes] = useState<ChartType[]>(initialChartTypes);

  const handleChartTypeChange = (index: number, type: ChartType) => {
    const newChartTypes = [...chartTypes];
    newChartTypes[index] = type;
    setChartTypes(newChartTypes);
  };

  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    if (analysis.filterableColumns) {
      for (const column of analysis.filterableColumns) {
        const uniqueValues = Array.from(new Set(data.map(row => String(row[column])))).sort();
        options[column] = ['All', ...uniqueValues];
      }
    }
    return options;
  }, [data, analysis.filterableColumns]);

  const filteredData = useMemo(() => {
      return data.filter(row => {
          return Object.entries(activeFilters).every(([key, value]) => {
              if (value === 'All') return true;
              return String(row[key]) === value;
          });
      });
  }, [data, activeFilters]);

  const handleFilterChange = (column: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [column]: value }));
  };

  const handlePowerBIExport = async () => {
    setIsExporting('powerbi');
    await new Promise(res => setTimeout(res, 500)); // Simulate processing
    exportForPowerBI(analysis, data, fileName);
    setIsExporting(false);
    setModalContent({
        title: "Power BI Export Guide Downloaded!",
        body: (
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                <p>A JSON file (<code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">AutoBI_PowerBI_Guide.json</code>) has been downloaded.</p>
                <p>Follow these steps in Power BI Desktop:</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>Go to <span className="font-semibold">Get data</span> and connect to your original CSV file (<code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">{fileName}</code>).</li>
                    <li>Open the downloaded JSON file in a text editor.</li>
                    <li>Use the <code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">chartSuggestions</code> and <code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">insights</code> in the file as a guide to build your visuals and text boxes.</li>
                </ol>
            </div>
        )
    });
  };

  const handleTableauExport = async () => {
    setIsExporting('tableau');
    await new Promise(res => setTimeout(res, 1000)); // Simulate processing
    exportForTableau(analysis, fileName);
    setIsExporting(false);
    setModalContent({
        title: "Tableau Workbook Downloaded!",
        body: (
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                <p>A Tableau Workbook file (<code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">AutoBI_Tableau_Dashboard.twb</code>) has been downloaded.</p>
                <p>Follow these steps in Tableau Desktop:</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>Make sure your original CSV file (<code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">{fileName}</code>) is in the <span className="font-semibold">same folder</span> as the downloaded <code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">.twb</code> file.</li>
                    <li>Double-click the <code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">.twb</code> file to open it.</li>
                    <li>Tableau will automatically connect to the CSV and load the pre-built worksheets for each suggested chart.</li>
                    <li>If prompted, locate the CSV file to fix the data connection.</li>
                </ol>
            </div>
        )
    });
  };

  const renderExportButton = (type: 'powerbi' | 'tableau', label: string, colorClasses: string, handler: () => void) => {
    const isLoading = isExporting === type;
    return (
      <button 
        onClick={handler}
        disabled={!!isExporting}
        className={`w-full sm:w-auto px-5 py-2.5 font-semibold text-white rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2 ${colorClasses}`}
      >
        {isLoading ? (
            <>
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                Exporting...
            </>
        ) : label}
      </button>
    );
  };
  
  return (
    <>
    {modalContent && (
        <Modal title={modalContent.title} onClose={() => setModalContent(null)}>
            {modalContent.body}
        </Modal>
    )}
    <div className={`p-2 sm:p-6 rounded-lg min-h-screen text-gray-800 dark:text-gray-200 fade-in`}>
       <style>{`:root { --primary-color: ${template.colors.primary}; --secondary-color: ${template.colors.secondary}; }`}</style>
       <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(circle at top left, ${template.colors.primary}10, transparent 40%), radial-gradient(circle at bottom right, ${template.colors.secondary}10, transparent 40%)`}}></div>

       <header className="flex flex-wrap gap-4 justify-between items-center mb-6 fade-in">
         <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: template.colors.primary }}>
            {analysis.dataType} Dashboard
         </h1>
         <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 rounded-lg shadow hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Start Over
          </button>
       </header>

      <div className="mb-6 p-6 glassmorphism rounded-xl shadow-md fade-in" style={{animationDelay: '100ms'}}>
        <h2 className="text-xl font-semibold mb-2" style={{ color: template.colors.primary }}>Executive Summary</h2>
        <p className="text-md text-gray-600 dark:text-gray-300">{analysis.summary}</p>
      </div>

      {analysis.filterableColumns && analysis.filterableColumns.length > 0 && (
        <div className="mb-6 p-4 glassmorphism rounded-xl shadow-md fade-in" style={{animationDelay: '200ms'}}>
            <div className="flex flex-wrap items-center gap-4">
                <h3 className="text-lg font-semibold" style={{ color: template.colors.primary }}>Filters:</h3>
                {analysis.filterableColumns.map(column => (
                    <div key={column}>
                        <label htmlFor={`filter-${column}`} className="sr-only">{column}</label>
                        <select
                            id={`filter-${column}`}
                            onChange={(e) => handleFilterChange(column, e.target.value)}
                            className="bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ '--tw-ring-color': template.colors.primary } as React.CSSProperties}
                        >
                            {filterOptions[column].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {analysis.chartSuggestions.map((chartInfo, index) => (
          <div key={index} className="stagger-fade-in h-80" style={{ animationDelay: `${300 + index * 100}ms`}}>
            <ChartComponent 
                chartInfo={chartInfo}
                currentChartType={chartTypes[index]}
                onChartTypeChange={(type) => handleChartTypeChange(index, type)}
                data={filteredData}
                colors={template.colors.chartFills} 
            />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 glassmorphism p-6 rounded-xl shadow-lg border border-white/10 stagger-fade-in" style={{ animationDelay: '700ms' }}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2" style={{ borderColor: `${template.colors.primary}50` }}>
                Pitch Deck Insights
            </h2>
            <ul className="list-none space-y-3">
                {analysis.insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-xl mr-3 mt-1" style={{ color: template.colors.primary }}>›</span>
                  {insight}
                </li>
                ))}
            </ul>
        </div>
        <div className="md:col-span-2 glassmorphism p-6 rounded-xl shadow-lg border border-white/10 flex flex-col justify-center items-center stagger-fade-in" style={{ animationDelay: '800ms' }}>
            <DownloadIcon className="w-16 h-16 mb-4" style={{color: template.colors.primary}}/>
            <h2 className="text-2xl font-semibold mb-2 text-center">Export Dashboard</h2>
            <p className="text-center mb-6 text-gray-500 dark:text-gray-400">Integrate with your favorite BI tools.</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {renderExportButton('powerbi', 'Power BI', 'bg-blue-600 hover:bg-blue-700', handlePowerBIExport)}
                {renderExportButton('tableau', 'Tableau', 'bg-orange-500 hover:bg-orange-600', handleTableauExport)}
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
