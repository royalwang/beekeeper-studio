import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import TextEditor from './TextEditor';

interface SQLTextEditorProps {
  value: string;
  connectionType?: string;
  extraKeybindings?: any;
  contextMenuOptions?: any;
  onInput?: (value: string) => void;
  onFocus?: (focused: boolean) => void;
  onSelection?: (selection: any) => void;
  onCursorIndex?: (index: number) => void;
  onCursorIndexAnchor?: (index: number) => void;
  onInitialized?: (editor: any) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

const SQLTextEditor: React.FC<SQLTextEditorProps> = ({
  value,
  connectionType,
  extraKeybindings,
  contextMenuOptions,
  onInput,
  onFocus,
  onSelection,
  onCursorIndex,
  onCursorIndexAnchor,
  onInitialized,
  className = '',
  placeholder = 'Enter SQL query...',
  readOnly = false,
  autoFocus = true,
}) => {
  const [hintOptions, setHintOptions] = useState<any>({});
  const [plugins, setPlugins] = useState<any[]>([]);
  
  const defaultSchema = useSelector((state: RootState) => state.global.defaultSchema);
  const dialectData = useSelector((state: RootState) => state.global.dialectData);
  const tables = useSelector((state: RootState) => state.global.tables);
  const isUltimate = useSelector((state: RootState) => state.settings.isUltimate);

  useEffect(() => {
    // Initialize hint options based on tables
    const firstTables: any = {};
    const secondTables: any = {};
    const thirdTables: any = {};

    tables.forEach((table: any) => {
      // Don't add table names that can get in conflict with database schema
      if (/\./.test(table.name)) return;

      if (table.entityType === 'table') {
        firstTables[table.name] = table;
      } else if (table.entityType === 'view') {
        secondTables[table.name] = table;
      } else {
        thirdTables[table.name] = table;
      }
    });

    const orderedTables = {
      ...firstTables,
      ...secondTables,
      ...thirdTables,
    };

    setHintOptions({
      tables: orderedTables,
      defaultSchema,
      dialect: dialectData?.name || 'sql',
    });
  }, [tables, defaultSchema, dialectData]);

  useEffect(() => {
    // Initialize plugins
    const editorPlugins = [
      'sql-hint',
      'sql-autocomplete',
      'sql-format',
    ];

    if (isUltimate) {
      editorPlugins.push('sql-snippets', 'sql-templates');
    }

    setPlugins(editorPlugins);
  }, [isUltimate]);

  const handleContextMenuOptions = (options: any) => {
    if (!contextMenuOptions) return options;

    const sqlOptions = [
      {
        name: 'Format SQL',
        action: () => {
          // Format SQL logic
          console.log('Format SQL');
        },
        icon: 'format_align_left',
      },
      {
        name: 'Execute Query',
        action: () => {
          // Execute query logic
          console.log('Execute Query');
        },
        icon: 'play_arrow',
      },
      {
        name: 'Explain Query',
        action: () => {
          // Explain query logic
          console.log('Explain Query');
        },
        icon: 'info',
      },
    ];

    return [...sqlOptions, ...options];
  };

  const columnsGetter = (tableName: string) => {
    const table = tables.find((t: any) => t.name === tableName);
    return table?.columns || [];
  };

  const keybindings = {
    'Ctrl-Space': 'autocomplete',
    'Ctrl-/': 'toggleComment',
    'Ctrl-Shift-F': 'format',
    'F5': 'execute',
    'Ctrl-Enter': 'execute',
    ...extraKeybindings,
  };

  return (
    <TextEditor
      value={value}
      onInput={onInput}
      hint="sql"
      mode={dialectData?.textEditorMode || 'sql'}
      extraKeybindings={keybindings}
      hintOptions={hintOptions}
      columnsGetter={columnsGetter}
      contextMenuOptions={handleContextMenuOptions}
      plugins={plugins}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onSelection={onSelection}
      onCursorIndex={onCursorIndex}
      onCursorIndexAnchor={onCursorIndexAnchor}
      onInitialized={onInitialized}
      className={className}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  );
};

export default SQLTextEditor;
