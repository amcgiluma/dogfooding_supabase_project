import { useEffect, useState } from 'react';

export function useTypedPrompt(prompt: string, reducedMotion: boolean, hidden: boolean) {
  const [typing, setTyping] = useState(() => ({ prompt, length: reducedMotion ? prompt.length : 0 }));
  const visibleLength = typing.prompt === prompt ? typing.length : 0;

  useEffect(() => {
    setTyping({ prompt, length: reducedMotion ? prompt.length : 0 });
  }, [prompt, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || hidden || visibleLength >= prompt.length) return;

    const timeout = window.setTimeout(() => {
      setTyping((current) => ({ prompt, length: Math.min(current.length + 1, prompt.length) }));
    }, 28);
    return () => window.clearTimeout(timeout);
  }, [hidden, prompt, reducedMotion, visibleLength]);

  return reducedMotion ? prompt : prompt.slice(0, visibleLength);
}
