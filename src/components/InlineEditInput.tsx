import { useEffect, useRef } from 'react';

interface InlineEditInputProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const InlineEditInput = ({ value, onSave, onCancel }: InlineEditInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSave(e.currentTarget.value);
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    onCancel();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="border px-1 rounded"
    />
  );
};

export default InlineEditInput;
