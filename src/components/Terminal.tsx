import { useEffect, useRef, useState } from 'react';
import { site } from '../utils/site';

const INITIAL_LINES = [
  '$ whoami',
  'frank@everettlabs',
  '',
  '$ current_focus',
  'shipping useful software',
  '',
  '$ stack',
  'typescript / react / cloudflare / wordpress / linux',
  '',
  '$ status',
  'online · building in public',
  '',
];

const COMMANDS: Record<string, string[]> = {
  help: ['Available commands:', 'help, projects, writing, github, telegram, coffee, clear'],
  projects: [
    'Products: Linketry, FavGrove, LinkVitals, GloboKit',
    'Infrastructure: VPS Scripts, Nezha Cleaner, DistroLift, NodeLoc Bench',
  ],
  writing: [`Opening ${site.seedloc} in a new tab...`],
  github: [`Opening ${site.github} in a new tab...`],
  telegram: [`Opening ${site.telegram} in a new tab...`],
  coffee: ['Loading coffee page...'],
  clear: [],
};

export default function Terminal() {
  const [lines, setLines] = useState<string[]>(INITIAL_LINES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (cmd === 'clear') {
      setLines([]);
      return;
    }
    if (cmd === 'writing') window.open(site.seedloc, '_blank', 'noopener,noreferrer');
    if (cmd === 'github') window.open(site.github, '_blank', 'noopener,noreferrer');
    if (cmd === 'telegram') window.open(site.telegram, '_blank', 'noopener,noreferrer');
    if (cmd === 'coffee') window.location.href = '/coffee';

    const response = COMMANDS[cmd] || [
      `Command not found: ${raw}`,
      'Type "help" for available commands.',
    ];
    setLines((prev) => [...prev, `$ ${raw}`, ...response, '']);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    run(input);
    setInput('');
  };

  return (
    <div
      role="region"
      className="rounded-xl border border-border bg-surface p-4 font-mono text-sm shadow-xl"
      aria-label="Controlled terminal preview"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-danger" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-warning" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-status-green" aria-hidden="true" />
        <span className="ml-auto text-xs text-text-muted">terminal</span>
      </div>

      <div className="h-64 overflow-y-auto pr-2 text-text-secondary">
        <div role="log" aria-live="polite" aria-atomic="false" aria-relevant="additions">
          {lines.map((line, i) => (
            <div key={i} className={line.startsWith('$') ? 'text-accent-cyan' : ''}>
              {line || '\u00A0'}
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <span className="text-accent-cyan" aria-hidden="true">
            $
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-text-primary"
            aria-label="Terminal command input"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
