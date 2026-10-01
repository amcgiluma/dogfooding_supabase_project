import { useState, type FormEvent } from 'react';
import { useApp } from '../../app/AppProvider';
import { getMessages } from '../../domain/selectors';
import type { ConversationScope } from '../../domain/types';
import './chat.css';

interface ChatProps { scope: ConversationScope }

/** A conversation is always tied to an explicit companion or mission scope. */
export function Chat({ scope }: ChatProps) {
  const { snapshot, actions } = useApp();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const messages = getMessages(snapshot, scope);
  const label = scope.kind === 'general' ? 'General conversation' : 'Mission conversation';
  const inputId = `chat-input-${scope.kind}-${scope.companionId}${scope.kind === 'mission' ? `-${scope.missionId}` : ''}`;
  const errorId = `${inputId}-error`;

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    const result = await actions.sendMessage(scope, draft);
    setPending(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setDraft('');
  }

  return (
    <section className="chat-panel" aria-label={label}>
      <div className="chat-history" aria-live="polite" aria-relevant="additions text">
        {messages.length === 0 ? (
          <p className="chat-empty">{scope.kind === 'general' ? 'Start a conversation with your companion.' : 'Start a conversation about this mission.'}</p>
        ) : messages.map((message) => (
          <article className={`chat-message chat-message-${message.role}`} key={message.id}>
            <span className="chat-who">{message.role === 'user' ? 'You' : 'Companion'}</span>
            <p>{message.text}</p>
          </article>
        ))}
      </div>
      <form className="chat-composer" onSubmit={(event) => void send(event)}>
        <label className="chat-label" htmlFor={inputId}>{scope.kind === 'general' ? 'Message your companion' : 'Reply about this mission'}</label>
        <textarea
          id={inputId}
          value={draft}
          onChange={(event) => { setDraft(event.target.value); setError(''); }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          rows={3}
          placeholder={scope.kind === 'general' ? 'Keep this conversation with your companion' : 'Your message stays with this mission'}
        />
        {error && <p className="chat-error" id={errorId} role="alert">{error}</p>}
        <div className="chat-submit-row">
          <span className="chat-demo">Demo</span>
          <button className="chat-send" type="submit" disabled={pending || !draft.trim()}>{pending ? 'Sending…' : 'Send'}</button>
        </div>
      </form>
    </section>
  );
}
