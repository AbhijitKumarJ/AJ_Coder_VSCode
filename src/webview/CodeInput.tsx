import * as React from 'react';
import { useState } from 'react';
import './CodeInput.css';

interface CodeInputProps {
  onSend: (code: string) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onSend }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSend(code);
      setCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="code-input-form">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here..."
        className="code-textarea"
      />
      <button type="submit" className="send-button">Send</button>
    </form>
  );
};