import { create } from 'zustand';

// define the store's initial state and actions
const useEditorStore = create((set) => ({
  currentStyle: 'No Selection',
  italicsActive: false,
  boldActive: false,
  underlineActive: false,

  setCurrentStyle: (newStyle) => {
    set((state) => ({
      ...state,
      currentStyle: newStyle,
    }));
  },
  setItalicsActive: (active) => {
    set((state) => ({
      ...state,
      italicsActive: active,
    }));
  },
  setBoldActive: (active) => {
    set((state) => ({
      ...state,
      boldActive: active,
    }));
  },
  setUnderlineActive: (active) => {
    set((state) => ({
      ...state,
      underlineActive: active,
    }));
  },
}));

export default useEditorStore;
