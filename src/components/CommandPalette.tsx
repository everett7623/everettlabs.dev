import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { commands, type CommandItem } from '../utils/commands';
import { COMMAND_PALETTE_EVENT } from '../utils/events';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [query]);
  const activeOptionId = filtered[selected] ? `command-option-${filtered[selected].id}` : undefined;

  useEffect(() => setSelected(0), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onPalette = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(COMMAND_PALETTE_EVENT, onPalette);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(COMMAND_PALETTE_EVENT, onPalette);
    };
  }, []);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const run = (cmd: CommandItem) => {
    setOpen(false);
    setQuery('');
    if (cmd.external) window.open(cmd.href, '_blank', 'noopener,noreferrer');
    else window.location.href = cmd.href;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length === 0) return;
      setSelected((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length === 0) return;
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selected]) run(filtered[selected]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 px-4 pt-24 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface-raised shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={18} className="text-text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            role="combobox"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search..."
            aria-label="Search commands"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            aria-activedescendant={activeOptionId}
            className="min-w-0 flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted"
          />
          <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-text-muted sm:inline">
            ESC
          </kbd>
        </div>

        <ul
          id="command-palette-listbox"
          ref={listRef}
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto py-2"
        >
          {filtered.map((cmd, i) => (
            <li
              id={`command-option-${cmd.id}`}
              key={cmd.id}
              role="option"
              aria-selected={i === selected}
              className={`flex min-h-11 cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                i === selected
                  ? 'bg-accent-violet/10 text-text-primary'
                  : 'text-text-secondary hover:bg-surface'
              }`}
              onClick={() => run(cmd)}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-text-muted opacity-60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {cmd.label}
              </span>
              {cmd.external && (
                <ExternalLink size={14} className="text-text-muted" aria-hidden="true" />
              )}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="flex min-h-11 items-center px-4 py-3 text-sm text-text-muted">
              No matching commands.
            </li>
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-text-muted">
          <span className="hidden sm:inline">Use ↑ ↓ to navigate, ↵ to run</span>
          <span className="sm:hidden">Tap to run</span>
        </div>
      </div>
    </div>
  );
}
