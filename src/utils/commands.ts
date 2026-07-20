import { site } from './site.js';

interface BaseCommandItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export type CommandItem =
  (BaseCommandItem & { external: true }) | (BaseCommandItem & { external?: false });

export const commands: CommandItem[] = [
  { id: 'home', label: 'Go to Home', href: '/' },
  { id: 'projects', label: 'Browse Projects', href: '/projects' },
  { id: 'about', label: 'Go to About', href: '/about' },
  { id: 'coffee', label: 'Buy Me a Coffee', href: '/coffee' },
  { id: 'linketry', label: 'Open Linketry', href: '/projects/linketry' },
  { id: 'linkvitals', label: 'Open LinkVitals', href: '/projects/linkvitals' },
  { id: 'citeoryx', label: 'Open Citeoryx', href: '/projects/citeoryx' },
  { id: 'favgrove', label: 'Open FavGrove', href: '/projects/favgrove' },
  { id: 'globokit', label: 'Open GloboKit', href: '/projects/globokit' },
  { id: 'vps-scripts', label: 'Open VPS Scripts', href: '/projects/vps-scripts' },
  { id: 'nezha-cleaner', label: 'Open Nezha Cleaner', href: '/projects/nezha-cleaner' },
  { id: 'distrolift', label: 'Open DistroLift', href: '/projects/distrolift' },
  { id: 'nodeloc-bench', label: 'Open NodeLoc Bench', href: '/projects/nodeloc-bench' },
  { id: 'seedloc', label: 'Read Seedloc', href: site.seedloc, external: true },
  { id: 'github', label: 'Open GitHub', href: site.github, external: true },
  { id: 'telegram', label: 'Open Telegram', href: site.telegram, external: true },
];
