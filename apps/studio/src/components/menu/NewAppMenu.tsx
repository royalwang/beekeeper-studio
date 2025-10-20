import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { isMac } from '@shared/lib/utils/platform';

interface NewAppMenuProps {
  onMenuItemClick: (item: MenuItem) => void;
  onMenuToggle: (menu: Menu) => void;
  onMenuClose: () => void;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  submenu?: MenuItem[];
  action?: () => void;
  type?: 'normal' | 'separator' | 'checkbox' | 'radio';
  icon?: string;
  color?: string;
}

interface Menu {
  label: string;
  submenu: MenuItem[];
  id: string;
}

const NewAppMenu: React.FC<NewAppMenuProps> = ({
  onMenuItemClick,
  onMenuToggle,
  onMenuClose,
  className = '',
}) => {
  const [menuActive, setMenuActive] = useState(false);
  const [selected, setSelected] = useState<Menu | null>(null);
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const navRef = useRef<HTMLElement>(null);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const menus: Menu[] = [
    {
      id: 'file',
      label: 'File',
      submenu: [
        {
          id: 'new-connection',
          label: 'New Connection',
          shortcut: 'Ctrl+N',
          icon: 'add',
          action: () => console.log('New Connection'),
        },
        {
          id: 'new-query',
          label: 'New Query',
          shortcut: 'Ctrl+Shift+N',
          icon: 'code',
          action: () => console.log('New Query'),
        },
        {
          id: 'separator-1',
          label: '',
          type: 'separator',
        },
        {
          id: 'open-connection',
          label: 'Open Connection',
          shortcut: 'Ctrl+O',
          icon: 'folder_open',
          action: () => console.log('Open Connection'),
        },
        {
          id: 'save-connection',
          label: 'Save Connection',
          shortcut: 'Ctrl+S',
          icon: 'save',
          action: () => console.log('Save Connection'),
        },
        {
          id: 'separator-2',
          label: '',
          type: 'separator',
        },
        {
          id: 'export-data',
          label: 'Export Data',
          icon: 'export',
          action: () => console.log('Export Data'),
        },
        {
          id: 'import-data',
          label: 'Import Data',
          icon: 'import',
          action: () => console.log('Import Data'),
        },
        {
          id: 'separator-3',
          label: '',
          type: 'separator',
        },
        {
          id: 'exit',
          label: 'Exit',
          shortcut: 'Ctrl+Q',
          icon: 'exit_to_app',
          action: () => console.log('Exit'),
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      submenu: [
        {
          id: 'undo',
          label: 'Undo',
          shortcut: 'Ctrl+Z',
          icon: 'undo',
          action: () => console.log('Undo'),
        },
        {
          id: 'redo',
          label: 'Redo',
          shortcut: 'Ctrl+Y',
          icon: 'redo',
          action: () => console.log('Redo'),
        },
        {
          id: 'separator-4',
          label: '',
          type: 'separator',
        },
        {
          id: 'cut',
          label: 'Cut',
          shortcut: 'Ctrl+X',
          icon: 'content_cut',
          action: () => console.log('Cut'),
        },
        {
          id: 'copy',
          label: 'Copy',
          shortcut: 'Ctrl+C',
          icon: 'content_copy',
          action: () => console.log('Copy'),
        },
        {
          id: 'paste',
          label: 'Paste',
          shortcut: 'Ctrl+V',
          icon: 'content_paste',
          action: () => console.log('Paste'),
        },
        {
          id: 'separator-5',
          label: '',
          type: 'separator',
        },
        {
          id: 'find',
          label: 'Find',
          shortcut: 'Ctrl+F',
          icon: 'search',
          action: () => console.log('Find'),
        },
        {
          id: 'replace',
          label: 'Replace',
          shortcut: 'Ctrl+H',
          icon: 'find_replace',
          action: () => console.log('Replace'),
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      submenu: [
        {
          id: 'toggle-sidebar',
          label: 'Toggle Sidebar',
          shortcut: 'Ctrl+B',
          icon: 'menu',
          action: () => console.log('Toggle Sidebar'),
        },
        {
          id: 'toggle-statusbar',
          label: 'Toggle Status Bar',
          icon: 'info',
          action: () => console.log('Toggle Status Bar'),
        },
        {
          id: 'separator-6',
          label: '',
          type: 'separator',
        },
        {
          id: 'zoom-in',
          label: 'Zoom In',
          shortcut: 'Ctrl+=',
          icon: 'zoom_in',
          action: () => console.log('Zoom In'),
        },
        {
          id: 'zoom-out',
          label: 'Zoom Out',
          shortcut: 'Ctrl+-',
          icon: 'zoom_out',
          action: () => console.log('Zoom Out'),
        },
        {
          id: 'reset-zoom',
          label: 'Reset Zoom',
          shortcut: 'Ctrl+0',
          icon: 'zoom_out_map',
          action: () => console.log('Reset Zoom'),
        },
        {
          id: 'separator-7',
          label: '',
          type: 'separator',
        },
        {
          id: 'fullscreen',
          label: 'Toggle Fullscreen',
          shortcut: 'F11',
          icon: 'fullscreen',
          action: () => console.log('Toggle Fullscreen'),
        },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      submenu: [
        {
          id: 'preferences',
          label: 'Preferences',
          shortcut: 'Ctrl+,',
          icon: 'settings',
          action: () => console.log('Preferences'),
        },
        {
          id: 'keyboard-shortcuts',
          label: 'Keyboard Shortcuts',
          icon: 'keyboard',
          action: () => console.log('Keyboard Shortcuts'),
        },
        {
          id: 'separator-8',
          label: '',
          type: 'separator',
        },
        {
          id: 'developer-tools',
          label: 'Developer Tools',
          shortcut: 'F12',
          icon: 'developer_mode',
          action: () => console.log('Developer Tools'),
        },
        {
          id: 'reload',
          label: 'Reload',
          shortcut: 'Ctrl+R',
          icon: 'refresh',
          action: () => console.log('Reload'),
        },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      submenu: [
        {
          id: 'documentation',
          label: 'Documentation',
          icon: 'help',
          action: () => console.log('Documentation'),
        },
        {
          id: 'keyboard-shortcuts-help',
          label: 'Keyboard Shortcuts',
          icon: 'keyboard',
          action: () => console.log('Keyboard Shortcuts Help'),
        },
        {
          id: 'separator-9',
          label: '',
          type: 'separator',
        },
        {
          id: 'about',
          label: 'About',
          icon: 'info',
          action: () => console.log('About'),
        },
      ],
    },
  ];

  const allHotkeys = {
    'escape': onMenuClose,
    'ctrl+n': () => handleMenuItemClick(menus[0].submenu[0]),
    'meta+n': () => handleMenuItemClick(menus[0].submenu[0]),
    'ctrl+shift+n': () => handleMenuItemClick(menus[0].submenu[1]),
    'meta+shift+n': () => handleMenuItemClick(menus[0].submenu[1]),
    'ctrl+o': () => handleMenuItemClick(menus[0].submenu[3]),
    'meta+o': () => handleMenuItemClick(menus[0].submenu[3]),
    'ctrl+s': () => handleMenuItemClick(menus[0].submenu[4]),
    'meta+s': () => handleMenuItemClick(menus[0].submenu[4]),
    'ctrl+q': () => handleMenuItemClick(menus[0].submenu[8]),
    'meta+q': () => handleMenuItemClick(menus[0].submenu[8]),
    'ctrl+z': () => handleMenuItemClick(menus[1].submenu[0]),
    'meta+z': () => handleMenuItemClick(menus[1].submenu[0]),
    'ctrl+y': () => handleMenuItemClick(menus[1].submenu[1]),
    'meta+y': () => handleMenuItemClick(menus[1].submenu[1]),
    'ctrl+x': () => handleMenuItemClick(menus[1].submenu[3]),
    'meta+x': () => handleMenuItemClick(menus[1].submenu[3]),
    'ctrl+c': () => handleMenuItemClick(menus[1].submenu[4]),
    'meta+c': () => handleMenuItemClick(menus[1].submenu[4]),
    'ctrl+v': () => handleMenuItemClick(menus[1].submenu[5]),
    'meta+v': () => handleMenuItemClick(menus[1].submenu[5]),
    'ctrl+f': () => handleMenuItemClick(menus[1].submenu[7]),
    'meta+f': () => handleMenuItemClick(menus[1].submenu[7]),
    'ctrl+h': () => handleMenuItemClick(menus[1].submenu[8]),
    'meta+h': () => handleMenuItemClick(menus[1].submenu[8]),
    'ctrl+b': () => handleMenuItemClick(menus[2].submenu[0]),
    'meta+b': () => handleMenuItemClick(menus[2].submenu[0]),
    'ctrl+=': () => handleMenuItemClick(menus[2].submenu[3]),
    'meta+=': () => handleMenuItemClick(menus[2].submenu[3]),
    'ctrl+-': () => handleMenuItemClick(menus[2].submenu[4]),
    'meta+-': () => handleMenuItemClick(menus[2].submenu[4]),
    'ctrl+0': () => handleMenuItemClick(menus[2].submenu[5]),
    'meta+0': () => handleMenuItemClick(menus[2].submenu[5]),
    'f11': () => handleMenuItemClick(menus[2].submenu[7]),
    'ctrl+,': () => handleMenuItemClick(menus[3].submenu[0]),
    'meta+,': () => handleMenuItemClick(menus[3].submenu[0]),
    'f12': () => handleMenuItemClick(menus[3].submenu[3]),
    'ctrl+r': () => handleMenuItemClick(menus[3].submenu[4]),
    'meta+r': () => handleMenuItemClick(menus[3].submenu[4]),
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;
      
      // Handle menu activation
      if (isAlt && key === 'f') {
        e.preventDefault();
        setMenuActive(true);
        setSelected(menus[0]);
      } else if (isAlt && key === 'e') {
        e.preventDefault();
        setMenuActive(true);
        setSelected(menus[1]);
      } else if (isAlt && key === 'v') {
        e.preventDefault();
        setMenuActive(true);
        setSelected(menus[2]);
      } else if (isAlt && key === 't') {
        e.preventDefault();
        setMenuActive(true);
        setSelected(menus[3]);
      } else if (isAlt && key === 'h') {
        e.preventDefault();
        setMenuActive(true);
        setSelected(menus[4]);
      } else if (key === 'escape') {
        e.preventDefault();
        onMenuClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.type === 'separator' || item.disabled) {
      return;
    }
    
    onMenuItemClick(item);
    if (item.action) {
      item.action();
    }
    onMenuClose();
  };

  const handleMenuClick = (menu: Menu) => {
    setSelected(menu);
    onMenuToggle(menu);
  };

  const handleMenuMouseOver = (menu: Menu) => {
    setSelected(menu);
  };

  const handleMenuMouseLeave = () => {
    // Keep selected menu for better UX
  };

  const handleItemMouseOver = (item: MenuItem) => {
    setHoveredItem(item);
  };

  const handleItemMouseLeave = () => {
    setHoveredItem(null);
  };

  const isMenuItemDisabled = (itemId: string): boolean => {
    // Placeholder for actual disabled state logic
    return false;
  };

  const hoverClass = (item: MenuItem) => {
    return {
      'hovered': hoveredItem === item,
      'selected': selectedItem === item,
    };
  };

  const shortcutText = (item: MenuItem): string => {
    if (!item.shortcut) return '';
    
    if (isMac) {
      return item.shortcut
        .replace('Ctrl+', '⌘')
        .replace('Alt+', '⌥')
        .replace('Shift+', '⇧');
    }
    
    return item.shortcut;
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.type === 'separator') {
      return <li key={index} className="menu-separator" />;
    }

    return (
      <li
        key={item.id || index}
        className={`menu-item ${hoverClass(item)} ${item.disabled ? 'disabled' : ''}`}
        onMouseOver={() => handleItemMouseOver(item)}
        onMouseLeave={handleItemMouseLeave}
      >
        <a
          onClick={() => handleMenuItemClick(item)}
          className={hoverClass(item)}
        >
          <span className="label">
            {item.checked && <span className="material-icons">done</span>}
            {item.icon && <span className="material-icons">{item.icon}</span>}
            <span>{item.label}</span>
          </span>
          {item.shortcut && (
            <span className="shortcut">{shortcutText(item)}</span>
          )}
        </a>
        {item.submenu && item.submenu.length > 0 && (
          <ul className="submenu">
            {item.submenu.map((subItem, subIndex) => renderMenuItem(subItem, subIndex))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav
      className={`flyout-nav ${menuActive ? 'active' : ''} ${className}`}
      ref={navRef}
      tabIndex={-1}
      role="menubar"
    >
      <ul className="menu-bar">
        {menus.map((menu) => (
          <li
            key={menu.id}
            className={`top-menu-item ${selected === menu ? 'selected' : ''}`}
            onMouseOver={() => handleMenuMouseOver(menu)}
            onMouseLeave={handleMenuMouseLeave}
            onClick={() => handleMenuClick(menu)}
          >
            <a className={selected === menu ? 'selected' : ''}>
              <span className="label">{menu.label}</span>
            </a>
            {selected === menu && (
              <ul className="submenu">
                {menu.submenu.map((item, index) => renderMenuItem(item, index))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NewAppMenu;
