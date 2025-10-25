
import React, { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { CsvData } from '../types';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileProcessed: (data: CsvData, name: string) => void;
  error?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, error }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
      if (!file) return;
      setIsParsing(true);
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          setIsParsing(false);
          onFileProcessed(results.data as CsvData, file.name);
        },
        error: (err) => {
          setIsParsing(false);
          console.error("CSV Parsing Error:", err);
        }
      });
  }

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [onFileProcessed]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-slate-900 dark:to-black animated-gradient"></div>
      
      <div className="max-w-3xl mx-auto z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
          Upload Your Data
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 fade-in" style={{ animationDelay: '0.2s' }}>
          Upload a CSV, and our AI will instantly generate a beautiful, insightful, and interactive dashboard.
        </p>
        
        <div className="w-full max-w-xl mx-auto float-animation fade-in" style={{ animationDelay: '0.4s' }}>
            <label 
                htmlFor="file-upload" 
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 scale-105 bg-white/30 dark:bg-slate-800/50' : 'border-gray-300 dark:border-gray-600'} glassmorphism hover:border-blue-500 dark:hover:border-blue-400 group`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <p className="mb-2 text-md text-gray-600 dark:text-gray-300">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">CSV files only</p>
                    {fileName && <p className="mt-4 text-md font-medium text-purple-600 dark:text-purple-400">{fileName}</p>}
                </div>
                <input ref={fileInputRef} id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} disabled={isParsing} />
            </label>
            {isParsing && <p className="mt-4 text-md text-gray-500">Parsing your file...</p>}
            {error && <p className="mt-4 text-md text-red-500 font-semibold">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
