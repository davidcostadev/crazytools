import React, { useState, useEffect } from 'react';
import { classNames } from '../../utils/classNames';

interface DynamicTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const DynamicTextarea: React.FC<DynamicTextareaProps> = ({ value, onChange, className }) => {
  const [height, setHeight] = useState(50); // Initial height in pixels

  useEffect(() => {
    const textarea = document.getElementById('dynamic-textarea');
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height first
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on scrollHeight
      setHeight(textarea.scrollHeight); // Update state with new height
    }
  }, [value]);

  return (
    <textarea
      id="dynamic-textarea"
      className={classNames(
        'w-full resize-none p-2 border outline-none overflow-hidden transition-height duration-300',
        className
      )}
      value={value}
      onChange={(e) => {
        onChange(e);
        setHeight(e.target.scrollHeight); // Update height in state on input change
      }}
      style={{ height: `${height}px` }} // Apply dynamic height from state
    />
  );
};

export default DynamicTextarea;
