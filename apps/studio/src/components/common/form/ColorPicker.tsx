import React from 'react';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  colors?: string[];
  className?: string;
  name?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value = 'default',
  onChange,
  colors = [
    'default',
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
  ],
  className = '',
  name = 'color-picker',
}) => {
  const getColorClass = (color: string) => {
    const suffix = color || 'default';
    return `connection-label-color-${suffix}`;
  };

  const handleColorChange = (color: string) => {
    onChange(color);
  };

  return (
    <div className={`color-picker ${className}`}>
      {colors.map((color) => (
        <label
          key={color}
          className={`connection-label ${getColorClass(color)} ${
            color === value ? 'selected' : ''
          }`}
        >
          <input
            type="radio"
            name={name}
            value={color}
            checked={color === value}
            onChange={() => handleColorChange(color)}
            className="color-radio"
          />
          <span className="color-indicator" />
        </label>
      ))}
    </div>
  );
};

export default ColorPicker;
