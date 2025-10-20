import React, { useRef, useEffect } from 'react';

interface DiffViewerProps {
  diff: string;
  className?: string;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
  onLineClick?: (lineNumber: number, side: 'left' | 'right') => void;
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  diff,
  className = '',
  showLineNumbers = true,
  theme = 'light',
  onLineClick,
}) => {
  const diffRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diffRef.current && diff) {
      // Parse and format the diff content
      const formattedDiff = formatDiff(diff);
      diffRef.current.innerHTML = formattedDiff;
      
      // Add click handlers for interactive features
      if (onLineClick) {
        addLineClickHandlers();
      }
    }
  }, [diff, onLineClick]);

  const formatDiff = (diffContent: string): string => {
    const lines = diffContent.split('\n');
    const formattedLines = lines.map((line, index) => {
      const lineNumber = index + 1;
      let className = 'diff-line';
      let prefix = '';
      
      if (line.startsWith('+')) {
        className += ' diff-added';
        prefix = '+';
      } else if (line.startsWith('-')) {
        className += ' diff-removed';
        prefix = '-';
      } else if (line.startsWith('@@')) {
        className += ' diff-header';
        prefix = '';
      } else if (line.startsWith('diff --git') || line.startsWith('index ') || line.startsWith('+++') || line.startsWith('---')) {
        className += ' diff-meta';
        prefix = '';
      } else {
        className += ' diff-context';
        prefix = ' ';
      }
      
      const lineContent = line.substring(prefix.length);
      const lineNumberHtml = showLineNumbers ? `<span class="line-number">${lineNumber}</span>` : '';
      
      return `<div class="${className}" data-line="${lineNumber}">
        ${lineNumberHtml}
        <span class="line-content">${escapeHtml(lineContent)}</span>
      </div>`;
    });
    
    return formattedLines.join('');
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const addLineClickHandlers = () => {
    if (!diffRef.current) return;
    
    const lines = diffRef.current.querySelectorAll('.diff-line');
    lines.forEach((line) => {
      line.addEventListener('click', (e) => {
        const lineNumber = parseInt((e.currentTarget as HTMLElement).dataset.line || '0');
        const isAdded = (e.currentTarget as HTMLElement).classList.contains('diff-added');
        const isRemoved = (e.currentTarget as HTMLElement).classList.contains('diff-removed');
        
        if (isAdded) {
          onLineClick?.(lineNumber, 'right');
        } else if (isRemoved) {
          onLineClick?.(lineNumber, 'left');
        }
      });
    });
  };

  return (
    <div className={`diff-viewer ${theme} ${className}`}>
      <div
        ref={diffRef}
        className="diff-preview"
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          overflow: 'auto',
          maxHeight: '400px',
          border: '1px solid #e1e4e8',
          borderRadius: '4px',
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        }}
      />
    </div>
  );
};

export default DiffViewer;
