import React from 'react';

/**
 * Parses strings and replaces [bracketed content] with a highlighted <span className="todo">
 * exactly like the original index (1).html portfolio design.
 */
export const TodoText = ({ text }) => {
  if (text === null || text === undefined) return null;
  const str = String(text);

  // If no brackets, return the string directly
  if (!str.includes('[') || !str.includes(']')) {
    return <>{str}</>;
  }

  const parts = [];
  const regex = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    parts.push(
      <span key={`todo-${match.index}`} className="todo">
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return <>{parts}</>;
};

export default TodoText;
