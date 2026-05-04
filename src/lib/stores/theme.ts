import { writable } from 'svelte/store';

export interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  codeBackground: string;
  codeText: string;
  accentColor: string;
}

export const presetThemes: Theme[] = [
  {
    name: 'Light',
    backgroundColor: '#FFFFFF',
    textColor: '#253044',
    headingColor: '#0B1220',
    linkColor: '#165DFF',
    codeBackground: '#EEF2FF',
    codeText: '#172554',
    accentColor: '#FF6B00'
  },
  {
    name: 'Dark',
    backgroundColor: '#101827',
    textColor: '#E5E7EB',
    headingColor: '#FFFFFF',
    linkColor: '#60A5FA',
    codeBackground: '#1F2937',
    codeText: '#F8FAFC',
    accentColor: '#34D399'
  },
  {
    name: 'Solarized',
    backgroundColor: '#FDF6E3',
    textColor: '#586E75',
    headingColor: '#073642',
    linkColor: '#268BD2',
    codeBackground: '#EEE8D5',
    codeText: '#CB4B16',
    accentColor: '#859900'
  },
  {
    name: 'Dracula',
    backgroundColor: '#282A36',
    textColor: '#F8F8F2',
    headingColor: '#BD93F9',
    linkColor: '#8BE9FD',
    codeBackground: '#1E1F29',
    codeText: '#F1FA8C',
    accentColor: '#FF79C6'
  },
  {
    name: 'Nord',
    backgroundColor: '#ECEFF4',
    textColor: '#2E3440',
    headingColor: '#3B4252',
    linkColor: '#5E81AC',
    codeBackground: '#E5E9F0',
    codeText: '#2E3440',
    accentColor: '#D08770'
  }
];

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(presetThemes[0]);

  return {
    subscribe,
    setTheme(theme: Theme) {
      set(theme);
    },
    updateColor(property: keyof Theme, value: string) {
      if (property === 'name') {
        return;
      }
      update((theme) => ({ ...theme, [property]: value }));
    }
  };
}

export const themeStore = createThemeStore();
