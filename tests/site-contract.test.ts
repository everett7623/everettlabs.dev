import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { commands } from '../src/utils/commands.ts';
import { COMMAND_PALETTE_EVENT } from '../src/utils/events.ts';
import { approvedRepositories } from '../src/utils/approved-repositories.ts';

const projectsDirectory = join(process.cwd(), 'src/content/projects');

function projectRepositories(): string[] {
  return readdirSync(projectsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => readFileSync(join(projectsDirectory, file), 'utf-8'))
    .map((content) => content.match(/^repository:\s*(.+)$/m)?.[1]?.trim())
    .filter((repository): repository is string => Boolean(repository));
}

describe('project content contract', () => {
  it('contains eight project entries from the approved whitelist', () => {
    const repositories = projectRepositories();

    expect(repositories).toHaveLength(8);
    expect(new Set(repositories).size).toBe(repositories.length);
    expect(
      repositories.every((repository) =>
        approvedRepositories.includes(repository as (typeof approvedRepositories)[number]),
      ),
    ).toBe(true);
  });
});

describe('command palette contract', () => {
  it('uses unique command ids and valid destinations', () => {
    expect(new Set(commands.map((command) => command.id)).size).toBe(commands.length);

    for (const command of commands) {
      if (command.external) {
        expect(() => new URL(command.href)).not.toThrow();
      } else {
        expect(command.href.startsWith('/')).toBe(true);
      }
    }
  });

  it('includes every required project and external destination', () => {
    const ids = new Set(commands.map((command) => command.id));
    const required = [
      'linketry',
      'linkvitals',
      'favgrove',
      'globokit',
      'vps-scripts',
      'nezha-cleaner',
      'distrolift',
      'nodeloc-bench',
      'seedloc',
      'github',
      'telegram',
      'coffee',
    ];

    expect(required.every((id) => ids.has(id))).toBe(true);
    expect(COMMAND_PALETTE_EVENT).toBe('open-command-palette');
  });

  it('exposes one internal cryptocurrency support command', () => {
    const coffeeCommands = commands.filter((command) => command.href === '/coffee');

    expect(coffeeCommands).toEqual([
      { id: 'coffee', label: 'Open Crypto Support', href: '/coffee' },
    ]);
  });
});
