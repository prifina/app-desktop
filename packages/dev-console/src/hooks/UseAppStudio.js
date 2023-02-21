
import create from "zustand";

//import { subscribeWithSelector } from 'zustand/middleware'


export const useAppStudioStore = create((set, get) => ({
  settings: {},
  updatedSettings: {},
  updateSettings: (values) => {
    set({ updatedSettings: values });
  },
  initSettings: (values) => {
    set({ settings: values });
  },
  debugInfo: [],
  setDebugInfo: (values) => {
    set({ debugInfo: values });
  },
  addDebugInfo: (values) => {
    set({ debugInfo: get().debugInfo.concat(values) });
  },

  getDebugInfo: () => {
    return get().debugInfo;
  }
}))

