import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { useApp } from '../../app/AppProvider';
import { getMessages } from '../../domain/selectors';
import type { ConversationScope } from '../../domain/types';
import './chat.css';

interface ChatProps { scope: ConversationScope; companionName?: string; actionStrip?: ReactNode }

/** A conversation always belongs to one companion or mission scope. */
export function Chat({ scope, companionName = 'your companion', actionStrip }: ChatProps) {
  const { snapshot, actions } = useApp();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const messages = getMessages(snapshot, scope);
  const label = scope.kind === 'general' ? 'General conversation' : 'Mission conversation';
  const inputId = `chat-input-${scope.kind}-${scope.companionId}${scope.kind === 'mission' ? `-${scope.missionId}` : ''}`;
  const errorId = `${inputId}-error`;
  useEffect(() => { const element = historyRef.current; if (element) element.scrollTop = element.scrollHeight; }, [messages.length]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !draft.trim()) return;
    setPending(true); setError('');
    const result = await actions.sendMessage(scope, draft);
    setPending(false);
    if (!result.ok) { setError(result.error.message); return; }
    setDraft('');
  }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return <section className="chat-panel" aria-label={label}>
    <div className="chat-history" ref={historyRef} aria-live="polite" aria-relevant="additions" aria-atomic="false">
      {messages.length === 0 ? <div className="chat-empty"><h2>{scope.kind === 'general' ? `Hey ${snapshot.profile?.name ?? 'there'}. What’s next?` : `Hi, I’m ${companionName}.`}</h2><p>{scope.kind === 'general' ? 'A small start counts.' : 'Let’s make progress on this mission.'}</p></div> : messages.map((message) => <article className={`chat-message chat-message-${message.role}`} key={message.id}><span className="chat-who">{message.role === 'user' ? 'You' : companionName}</span><p>{message.text}</p></article>)}
    </div>
    <div className="chat-bottom">{actionStrip && <div className="chat-action-strip">{actionStrip}</div>}
      <form className="chat-composer" onSubmit={(event) => void send(event)}>
        <label className="visually-hidden" htmlFor={inputId}>{scope.kind === 'general' ? `Message ${companionName}` : `Reply to ${companionName} about this mission`}</label>
        <textarea id={inputId} value={draft} onChange={(event) => { setDraft(event.target.value); setError(''); }} onKeyDown={handleKeyDown} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} rows={1} placeholder="What’s on your mind?" />
        <button className="chat-send" type="submit" disabled={pending || !draft.trim()}>{pending ? 'Sending…' : 'Send'}</button>
      </form>
      {error && <p className="chat-error" id={errorId} role="alert">{error}</p>}
      <p className="chat-hint">Shift + Enter for a new line</p>
    </div>
  </section>;
}
