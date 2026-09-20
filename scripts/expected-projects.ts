export interface ExpectedProject {
  repository: string;
  category: 'product' | 'infrastructure' | 'community';
  ownership: 'original' | 'community';
  featured: 'true' | 'false';
  homeOrder: string;
  riskNotice?: boolean;
  credits?: boolean;
  screenshot?: boolean;
}

export const expectedProjects: Record<string, ExpectedProject> = {
  linketry: {
    repository: 'everett7623/Linketry',
    category: 'product',
    ownership: 'original',
    featured: 'true',
    homeOrder: '1',
  },
  favgrove: {
    repository: 'everett7623/FavGrove',
    category: 'product',
    ownership: 'original',
    featured: 'true',
    homeOrder: '2',
    screenshot: true,
  },
  linkvitals: {
    repository: 'everett7623/LinkVitals',
    category: 'product',
    ownership: 'original',
    featured: 'true',
    homeOrder: '3',
  },
  globokit: {
    repository: 'everett7623/Globokit',
    category: 'product',
    ownership: 'original',
    featured: 'true',
    homeOrder: '4',
  },
  citeoryx: {
    repository: 'everett7623/Citeoryx',
    category: 'product',
    ownership: 'original',
    featured: 'false',
    homeOrder: '5',
  },
  picsift: {
    repository: 'everett7623/PicSift',
    category: 'product',
    ownership: 'original',
    featured: 'false',
    homeOrder: '6',
  },
  logolens: {
    repository: 'everett7623/LogoLens',
    category: 'product',
    ownership: 'original',
    featured: 'false',
    homeOrder: '7',
  },
  rackora: {
    repository: 'everett7623/halo-theme-rackora',
    category: 'product',
    ownership: 'original',
    featured: 'false',
    homeOrder: '8',
    screenshot: true,
  },
  wamofa: {
    repository: 'everett7623/wamofa',
    category: 'product',
    ownership: 'original',
    featured: 'false',
    homeOrder: '9',
  },
  lingora: {
    repository: 'everett7623/Lingora',
    category: 'product',
    ownership: 'original',
    featured: 'false',
    homeOrder: '10',
  },
  'vps-scripts': {
    repository: 'everett7623/vps_scripts',
    category: 'infrastructure',
    ownership: 'original',
    featured: 'false',
    homeOrder: '1',
  },
  'nezha-cleaner': {
    repository: 'everett7623/Nezha-cleaner',
    category: 'infrastructure',
    ownership: 'original',
    featured: 'false',
    homeOrder: '2',
    riskNotice: true,
  },
  distrolift: {
    repository: 'everett7623/DistroLift',
    category: 'infrastructure',
    ownership: 'original',
    featured: 'false',
    homeOrder: '3',
    riskNotice: true,
  },
  'nodeloc-bench': {
    repository: 'everett7623/nodeloc_vps_test',
    category: 'community',
    ownership: 'community',
    featured: 'false',
    homeOrder: '4',
    credits: true,
  },
};
