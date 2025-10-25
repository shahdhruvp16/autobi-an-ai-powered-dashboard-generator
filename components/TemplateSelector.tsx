
import React from 'react';
import type { Template } from '../types';

interface TemplateSelectorProps {
  templates: Template[];
  suggestedTemplateName: string;
  onSelect: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, suggestedTemplateName, onSelect }) => {
  return (
    <div className="max-w-5xl mx-auto text-center fade-in">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">Choose Your Dashboard Style</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
        Our AI suggests the <span className="font-semibold" style={{ color: templates.find(t => t.name === suggestedTemplateName)?.colors.primary }}>{suggestedTemplateName}</span> theme based on your data.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {templates.map((template, index) => (
          <div
            key={template.name}
            onClick={() => onSelect(template)}
            className={`stagger-fade-in relative p-6 rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-2 group glassmorphism ${
              template.name === suggestedTemplateName
                ? 'shadow-2xl'
                : 'shadow-lg'
            }`}
            style={{
                animationDelay: `${index * 100}ms`,
                borderColor: template.name === suggestedTemplateName ? template.colors.primary : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            {template.name === suggestedTemplateName && (
              <span 
                className="absolute top-0 right-0 -mt-3 -mr-3 px-4 py-1 text-white text-xs font-bold rounded-full shadow-lg animate-pulse"
                style={{ backgroundColor: template.colors.primary }}
              >
                Suggested
              </span>
            )}
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full mb-4 transition-colors duration-300" style={{ backgroundColor: `${template.colors.primary}20` }}>
                 <template.icon className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" style={{ color: template.colors.primary }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 h-10">{template.description}</p>
            </div>
             <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: template.colors.primary }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
