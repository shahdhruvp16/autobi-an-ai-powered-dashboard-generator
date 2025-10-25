
import React, { useState, useCallback } from 'react';
import { analyzeData } from './services/geminiService';
import { TEMPLATES } from './constants';
import type { Template, AnalysisResult, CsvData } from './types';
import FileUpload from './components/FileUpload';
import TemplateSelector from './components/TemplateSelector';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import AuthPage from './components/AuthPage';
import { LogoIcon } from './components/icons';
import HomePage from './components/HomePage';

enum AppState {
  HOME,
  AUTH,
  UPLOAD,
  ANALYZING,
  TEMPLATE_SELECTION,
  DASHBOARD,
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleGetStarted = () => {
    setAppState(AppState.AUTH);
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setAppState(AppState.UPLOAD);
  };

  const handleLogout = () => {
    setUserEmail(null);
    handleReset();
    setAppState(AppState.HOME);
  };

  const handleFileProcessed = useCallback(async (data: CsvData, name: string) => {
    setCsvData(data);
    setFileName(name);
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const result = await analyzeData(data);
      setAnalysisResult(result);
      setAppState(AppState.TEMPLATE_SELECTION);
    } catch (e) {
      console.error("Error during analysis:", e);
      setError("Failed to analyze the data. Please check the CSV format or try a different file.");
      setAppState(AppState.UPLOAD);
    }
  }, []);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setAppState(AppState.DASHBOARD);
  };
  
  const handleReset = () => {
    setAppState(AppState.UPLOAD);
    setCsvData(null);
    setFileName(null);
    setAnalysisResult(null);
    setSelectedTemplate(null);
    setError(null);
  };
  
  const handleStartOver = () => {
      setAppState(AppState.UPLOAD);
      setCsvData(null);
      setFileName(null);
      setAnalysisResult(null);
      setSelectedTemplate(null);
      setError(null);
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.HOME:
        return <HomePage onGetStarted={handleGetStarted} />;
      case AppState.AUTH:
        return <AuthPage onLogin={handleLogin} />;
      case AppState.UPLOAD:
        return <FileUpload onFileProcessed={handleFileProcessed} error={error} />;
      case AppState.ANALYZING:
        return <LoadingSpinner text="AI is analyzing your data..." />;
      case AppState.TEMPLATE_SELECTION:
        if (!analysisResult) return <FileUpload onFileProcessed={handleFileProcessed} error="Something went wrong during analysis." />;
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <TemplateSelector
              templates={TEMPLATES}
              suggestedTemplateName={analysisResult.suggestedTemplate}
              onSelect={handleTemplateSelect}
            />
          </div>
        );
      case AppState.DASHBOARD:
        if (!csvData || !analysisResult || !selectedTemplate || !fileName) {
            handleStartOver();
            return null;
        }
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Dashboard
              data={csvData}
              fileName={fileName}
              analysis={analysisResult}
              template={selectedTemplate}
              onReset={handleStartOver}
            />
          </div>
        );
      default:
        return <HomePage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {appState !== AppState.AUTH && appState !== AppState.HOME && (
        <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-black/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState(AppState.HOME)}>
                <LogoIcon className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  AutoBI
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 hidden sm:block">{userEmail}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700/50 rounded-md hover:bg-gray-600/70 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className={`${(appState === AppState.AUTH || appState === AppState.HOME) ? '' : 'py-8'}`}>
          {renderContent()}
      </main>
    </div>
  );
};

export default App;
