import * as React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
//import './ChatMessage.css';

interface ChatMessageProps {
  role: string;
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isCode = role === 'user' || (role === 'ai' && content.includes('```'));

  const formatContent = (content: string) => {
    if (!isCode) return content;

    const codeBlocks = content.split('```');
    return codeBlocks.map((block, index) => {
      if (index % 2 === 0) {
        return <span key={index}>{block}</span>;
      } else {
        const [language, ...code] = block.split('\n');
        return (
          <SyntaxHighlighter
            key={index}
            language={language || 'javascript'}
            style={vscDarkPlus}
            customStyle={{ margin: '10px 0' }}
          >
            {code.join('\n')}
          </SyntaxHighlighter>
        );
      }
    });
  };

  return (
    <div className={`chat-message ${role}`}>
      <div className="message-content">{formatContent(content)}</div>
    </div>
  );
};