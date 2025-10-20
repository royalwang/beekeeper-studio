import React, { useRef, useEffect, useState, useCallback } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/diff/diff';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/merge/merge';

interface TextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  mode?: string;
  theme?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onSelectionChange?: (selection: any) => void;
  onCursorChange?: (cursor: any) => void;
  options?: any;
  height?: string | number;
  width?: string | number;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value = '',
  onChange,
  mode = 'sql',
  theme = 'material',
  readOnly = false,
  placeholder,
  className = '',
  onFocus,
  onBlur,
  onKeyDown,
  onSelectionChange,
  onCursorChange,
  options = {},
  height = 'auto',
  width = '100%',
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const codeMirrorRef = useRef<CodeMirror.Editor | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultOptions = {
    mode,
    theme,
    readOnly,
    placeholder,
    lineNumbers: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    autoRefresh: true,
    lineWrapping: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    electricChars: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true,
    showCursorWhenSelecting: true,
    ...options,
  };

  const initializeEditor = useCallback(() => {
    if (!editorRef.current || isInitialized) return;

    const editor = CodeMirror.fromTextArea(editorRef.current, defaultOptions);
    codeMirrorRef.current = editor;

    // Set initial value
    editor.setValue(value);

    // Event handlers
    editor.on('change', (cm) => {
      const newValue = cm.getValue();
      onChange?.(newValue);
    });

    editor.on('focus', () => {
      onFocus?.();
    });

    editor.on('blur', () => {
      onBlur?.();
    });

    editor.on('keydown', (cm, event) => {
      onKeyDown?.(event);
    });

    editor.on('cursorActivity', (cm) => {
      const cursor = cm.getCursor();
      onCursorChange?.(cursor);
    });

    editor.on('selectionChange', (cm) => {
      const selection = cm.getSelection();
      onSelectionChange?.(selection);
    });

    setIsInitialized(true);
  }, [value, onChange, onFocus, onBlur, onKeyDown, onCursorChange, onSelectionChange, defaultOptions, isInitialized]);

  useEffect(() => {
    initializeEditor();

    return () => {
      if (codeMirrorRef.current) {
        codeMirrorRef.current.toTextArea();
        codeMirrorRef.current = null;
        setIsInitialized(false);
      }
    };
  }, [initializeEditor]);

  useEffect(() => {
    if (codeMirrorRef.current && isInitialized) {
      const currentValue = codeMirrorRef.current.getValue();
      if (currentValue !== value) {
        codeMirrorRef.current.setValue(value);
      }
    }
  }, [value, isInitialized]);

  useEffect(() => {
    if (codeMirrorRef.current && isInitialized) {
      codeMirrorRef.current.setOption('mode', mode);
    }
  }, [mode, isInitialized]);

  useEffect(() => {
    if (codeMirrorRef.current && isInitialized) {
      codeMirrorRef.current.setOption('theme', theme);
    }
  }, [theme, isInitialized]);

  useEffect(() => {
    if (codeMirrorRef.current && isInitialized) {
      codeMirrorRef.current.setOption('readOnly', readOnly);
    }
  }, [readOnly, isInitialized]);

  const getEditor = () => codeMirrorRef.current;

  const focus = () => {
    codeMirrorRef.current?.focus();
  };

  const blur = () => {
    codeMirrorRef.current?.getInputField().blur();
  };

  const getValue = () => {
    return codeMirrorRef.current?.getValue() || '';
  };

  const setValue = (newValue: string) => {
    codeMirrorRef.current?.setValue(newValue);
  };

  const getSelection = () => {
    return codeMirrorRef.current?.getSelection() || '';
  };

  const setSelection = (from: any, to: any) => {
    codeMirrorRef.current?.setSelection(from, to);
  };

  const getCursor = () => {
    return codeMirrorRef.current?.getCursor() || { line: 0, ch: 0 };
  };

  const setCursor = (pos: any) => {
    codeMirrorRef.current?.setCursor(pos);
  };

  const refresh = () => {
    codeMirrorRef.current?.refresh();
  };

  const execCommand = (command: string) => {
    codeMirrorRef.current?.execCommand(command);
  };

  // Expose methods via ref
  React.useImperativeHandle(editorRef, () => ({
    getEditor,
    focus,
    blur,
    getValue,
    setValue,
    getSelection,
    setSelection,
    getCursor,
    setCursor,
    refresh,
    execCommand,
  }));

  return (
    <div className={`text-editor ${className}`} style={{ height, width }}>
      <textarea
        ref={editorRef}
        name="editor"
        className="editor"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default TextEditor;
