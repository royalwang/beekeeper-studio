import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import FilePicker from './form/FilePicker';

interface SettingsInputProps {
  settingKey: string;
  title: string;
  inputType?: 'text' | 'file' | 'directory';
  help?: string;
  onChanged?: (value: any) => void;
  className?: string;
}

const SettingsInput: React.FC<SettingsInputProps> = ({
  settingKey,
  title,
  inputType = 'text',
  help,
  onChanged,
  className = '',
}) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings.settings);
  const [value, setValue] = useState('');

  const setting = settings[settingKey];

  useEffect(() => {
    if (setting) {
      setValue(setting.value || '');
    }
  }, [setting]);

  const saveSetting = (newValue: any) => {
    // Dispatch action to save setting
    dispatch({
      type: 'settings/updateSetting',
      payload: {
        key: settingKey,
        value: newValue,
      },
    });
    
    // Call onChanged callback if provided
    if (onChanged) {
      onChanged(newValue);
    }
  };

  const handleValueChange = (newValue: any) => {
    setValue(newValue);
    saveSetting(newValue);
  };

  if (!setting) {
    return null;
  }

  return (
    <div className={`form-group settings-input ${className}`}>
      <label htmlFor={settingKey}>{title}</label>
      
      {inputType === 'file' && (
        <FilePicker
          value={value}
          onChange={handleValueChange}
          inputId={settingKey}
          buttonText="Choose File"
          options={{
            properties: ['openFile'],
            filters: [
              { name: 'All Files', extensions: ['*'] }
            ]
          }}
        />
      )}
      
      {inputType === 'directory' && (
        <FilePicker
          value={value}
          onChange={handleValueChange}
          inputId={settingKey}
          buttonText="Choose Directory"
          options={{
            properties: ['openDirectory']
          }}
        />
      )}
      
      {inputType === 'text' && (
        <input
          type="text"
          id={settingKey}
          className="form-control"
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder={title}
        />
      )}
      
      {help && (
        <small className="help text-muted">
          {help}
        </small>
      )}
    </div>
  );
};

export default SettingsInput;
