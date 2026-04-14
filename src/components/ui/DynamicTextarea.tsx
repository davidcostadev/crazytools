import React, { useState, useEffect } from 'react';
import { classNames } from '../../utils/classNames';

interface DynamicTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
  minHeight?: number;
}

const DynamicTextarea: React.FC<DynamicTextareaProps> = ({
  value,
  onChange,
  className,
  autoFocus,
  placeholder,
  minHeight = 64,
}) => {
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    const textarea = document.getElementById('dynamic-textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.ceil(textarea.scrollHeight)}px`;
      setHeight(Math.max(textarea.scrollHeight, minHeight));
    }
  }, [value, minHeight]);

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
        setHeight(Math.max(e.target.scrollHeight, minHeight));
      }}
      style={{ height: `${height}px` }}
      autoFocus={autoFocus}
      placeholder={placeholder}
    />
  );
};

export default DynamicTextarea;
