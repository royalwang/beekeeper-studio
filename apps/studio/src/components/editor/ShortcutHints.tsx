import React from 'react';
import { useAppSelector } from '../../hooks';

interface ShortcutHintsProps {
  className?: string;
  showTitle?: boolean;
  title?: string;
}

const ShortcutHints: React.FC<ShortcutHintsProps> = ({
  className = '',
  showTitle = true,
  title = 'Keyboard Shortcuts',
}) => {
  const isMac = useAppSelector((state) => state.settings.isMac || false);

  const shortcuts = [
    {
      name: 'Quick Search',
      mac: ['⌘', 'P'],
      windows: ['Ctrl', 'P'],
    },
    {
      name: 'Autocomplete',
      mac: ['Ctrl', 'Space'],
      windows: ['Ctrl', 'Space'],
    },
    {
      name: 'Run',
      mac: ['⌘', 'Enter'],
      windows: ['Ctrl', 'Enter'],
    },
    {
      name: 'Run Current',
      mac: ['⌘', '⇧', 'Enter'],
      windows: ['Ctrl', '⇧', 'Enter'],
    },
    {
      name: 'Format',
      mac: ['⌘', '⇧', 'F'],
      windows: ['Ctrl', '⇧', 'F'],
    },
    {
      name: 'Comment',
      mac: ['⌘', '/'],
      windows: ['Ctrl', '/'],
    },
    {
      name: 'Find',
      mac: ['⌘', 'F'],
      windows: ['Ctrl', 'F'],
    },
    {
      name: 'Replace',
      mac: ['⌘', '⇧', 'H'],
      windows: ['Ctrl', '⇧', 'H'],
    },
    {
      name: 'Go to Line',
      mac: ['⌘', 'G'],
      windows: ['Ctrl', 'G'],
    },
    {
      name: 'Select All',
      mac: ['⌘', 'A'],
      windows: ['Ctrl', 'A'],
    },
    {
      name: 'Copy',
      mac: ['⌘', 'C'],
      windows: ['Ctrl', 'C'],
    },
    {
      name: 'Paste',
      mac: ['⌘', 'V'],
      windows: ['Ctrl', 'V'],
    },
    {
      name: 'Undo',
      mac: ['⌘', 'Z'],
      windows: ['Ctrl', 'Z'],
    },
    {
      name: 'Redo',
      mac: ['⌘', '⇧', 'Z'],
      windows: ['Ctrl', 'Y'],
    },
    {
      name: 'Save',
      mac: ['⌘', 'S'],
      windows: ['Ctrl', 'S'],
    },
    {
      name: 'New Tab',
      mac: ['⌘', 'T'],
      windows: ['Ctrl', 'T'],
    },
    {
      name: 'Close Tab',
      mac: ['⌘', 'W'],
      windows: ['Ctrl', 'W'],
    },
    {
      name: 'Next Tab',
      mac: ['⌘', '⇧', ']'],
      windows: ['Ctrl', 'Tab'],
    },
    {
      name: 'Previous Tab',
      mac: ['⌘', '⇧', '['],
      windows: ['Ctrl', '⇧', 'Tab'],
    },
    {
      name: 'Toggle Sidebar',
      mac: ['⌘', 'B'],
      windows: ['Ctrl', 'B'],
    },
    {
      name: 'Toggle Fullscreen',
      mac: ['⌘', '⇧', 'F'],
      windows: ['F11'],
    },
    {
      name: 'Zoom In',
      mac: ['⌘', '+'],
      windows: ['Ctrl', '+'],
    },
    {
      name: 'Zoom Out',
      mac: ['⌘', '-'],
      windows: ['Ctrl', '-'],
    },
    {
      name: 'Reset Zoom',
      mac: ['⌘', '0'],
      windows: ['Ctrl', '0'],
    },
  ];

  const renderShortcut = (shortcut: string[]) => (
    <div className="shortcut">
      {shortcut.map((key, index) => (
        <span key={index}>{key}</span>
      ))}
    </div>
  );

  return (
    <div className={`shortcuts ${className}`}>
      {showTitle && (
        <div className="shortcuts-title">
          <h4>{title}</h4>
        </div>
      )}
      
      <div className="shortcuts-list">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="shortcut-item">
            <div className="shortcut-name">{shortcut.name}</div>
            {isMac ? renderShortcut(shortcut.mac) : renderShortcut(shortcut.windows)}
          </div>
        ))}
      </div>
      
      <div className="shortcuts-footer">
        <small className="text-muted">
          {isMac ? 'macOS shortcuts' : 'Windows/Linux shortcuts'}
        </small>
      </div>
    </div>
  );
};

export default ShortcutHints;
