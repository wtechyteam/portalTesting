import React from 'react';

interface InputTextProps {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  value: string; // Change defaultValue to value
  placeholder?: string;
  updateFormValue: (updateType: string, value: string) => void;
  updateType: string;
}

function InputText({
  labelTitle,
  labelStyle,
  type = 'text', // Set default value for type
  containerStyle = '', // Set default value for containerStyle
  value, // Change to accept value directly
  placeholder = '', // Set default value for placeholder
  updateFormValue,
  updateType,
}: InputTextProps): JSX.Element {
  const updateInputValue = (val: string): void => {
    updateFormValue(updateType, val); // Pass both updateType and value
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={`label-text text-xs text-base-content ${labelStyle || ''}`}>{labelTitle}</span>
      </label>
      <input
        type={type}
        value={value} // Use the value prop
        placeholder={placeholder}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input input-bordered w-full"
      />
    </div>
  );
}

export default InputText;
