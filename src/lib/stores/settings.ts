import { writable } from 'svelte/store';

export interface SettingsState {
  lineNumbers: boolean;
  focusMode: boolean;
  sidebarOpen: boolean;
}

const initialState: SettingsState = {
  lineNumbers: true,
  focusMode: false,
  sidebarOpen: true
};

function createSettingsStore() {
  const { subscribe, update } = writable<SettingsState>(initialState);

  return {
    subscribe,
    toggleLineNumbers() {
      update((s) => ({ ...s, lineNumbers: !s.lineNumbers }));
    },
    toggleFocusMode() {
      update((s) => ({ ...s, focusMode: !s.focusMode }));
    },
    toggleSidebar() {
      update((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }));
    }
  };
}

export const settingsStore = createSettingsStore();
