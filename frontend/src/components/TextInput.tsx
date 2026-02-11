import { ChangeEvent } from 'react';

interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const wordCount = value.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="form-group">
      <div className="slider-header">
        <label htmlFor="text-input">Text to Speak</label>
        <span className="slider-value">{wordCount} words</span>
      </div>
      <textarea
        id="text-input"
        value={value}
        onChange={handleChange}
        placeholder="Enter text here..."
        maxLength={1000}
      />
    </div>
  );
}
