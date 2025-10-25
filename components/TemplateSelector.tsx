import React, { useMemo } from 'react';
import type { Template } from '../types'; // Assuming your types are in '../types'

// Define a more specific type for the icon if possible
// For example, if you are using Lucide Icons:
// import { LucideIcon } from 'lucide-react';
// interface Template { icon: LucideIcon; ... }

interface TemplateSelectorProps {
  templates: Template[];
  suggestedTemplateName: string;
  onSelect: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, suggestedTemplateName, onSelect }) => {
  // Memoize the suggested template to avoid re-calculating on every render
  const suggestedTemplate = useMemo(
    () => templates.find(t => t.name === suggestedTemplateName),
    [templates, suggestedTemplateName]
  );

  // Keyboard accessibility handler
  const handleKeyDown = (event: React.KeyboardEvent, template: Template) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent scrolling when space is pressed
      onSelect(template);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Choose Your Dashboard Style
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Our AI suggests the{' '}
          <span
            className="font-semibold"
            style={{ color: suggestedTemplate?.colors.primary ?? '#000000' }}
          >
            {suggestedTemplateName}
          </span>{' '}
          theme based on your data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {templates.map((template, index) => {
          const isSuggested = template.name === suggestedTemplateName;

          return (
            <div
              key={template.name}
              role="button"
              tabIndex={0}
              aria-label={`Select ${template.name} theme`}
              onClick={() => onSelect(template)}
              onKeyDown={(e) => handleKeyDown(e, template)}
              className={`stagger-fade-in group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-2 focus:outline-none focus:ring-4 ${
                isSuggested
                  ? 'shadow-2xl'
                  : 'shadow-lg hover:shadow-xl'
              } glassmorphism`}
              style={{
                animationDelay: `${index * 100}ms`,
                borderColor: isSuggested ? template.colors.primary : 'rgba(255, 255, 255, 0.2)',
                '--focus-ring-color': template.colors.primary, // For custom focus ring
              } as React.CSSProperties}
            >
              {isSuggested && (
                <span
                  className="absolute top-0 right-0 -mt-3 -mr-3 flex items-center justify-center px-4 py-1 text-white text-xs font-bold rounded-full shadow-lg"
                  style={{
                    backgroundColor: template.colors.primary,
                    animation: `pulse-shadow 2s infinite`,
                  }}
                >
                  Suggested
                </span>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className="p-4 rounded-full mb-4 transition-colors duration-300"
                  style={{ backgroundColor: `${template.colors.primary}20` }} // Using hex with alpha
                >
                  <template.icon
                    className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: template.colors.primary }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[2.5rem]">
                  {template.description}
                </p>
              </div>

              {/* Decorative element on hover/focus */}
              <div
                className="absolute bottom-0 left-0 w-full h-1.5 rounded-b-2xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: template.colors.primary }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;