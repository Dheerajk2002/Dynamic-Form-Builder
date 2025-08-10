import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormBuilderState, FormSchema, FormField } from '../types';
import { nanoid } from 'nanoid';
import { loadFormsFromStorage, saveFormsToStorage } from '../utils/storage';

const initialState: FormBuilderState = {
  currentForm: {
    id: nanoid(),
    name: '',
    fields: [],
    createdAt: new Date().toISOString(),
  },
  savedForms: loadFormsFromStorage(),
  isLoading: false,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Form management
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    
    createNewForm: (state) => {
      state.currentForm = {
        id: nanoid(),
        name: '',
        fields: [],
        createdAt: new Date().toISOString(),
      };
    },

    loadForm: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm = { ...action.payload };
    },

    saveCurrentForm: (state) => {
      if (!state.currentForm.name.trim()) return;
      
      const formToSave = {
        ...state.currentForm,
        id: nanoid(),
        createdAt: new Date().toISOString(),
      };
      
      state.savedForms.push(formToSave);
      saveFormsToStorage(state.savedForms);
      
      // Reset current form
      state.currentForm = {
        id: nanoid(),
        name: '',
        fields: [],
        createdAt: new Date().toISOString(),
      };
    },

    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(form => form.id !== action.payload);
      saveFormsToStorage(state.savedForms);
    },

    // Field management
    addField: (state, action: PayloadAction<FormField>) => {
      state.currentForm.fields.push(action.payload);
    },

    updateField: (state, action: PayloadAction<{ id: string; field: Partial<FormField> }>) => {
      const { id, field } = action.payload;
      const index = state.currentForm.fields.findIndex(f => f.id === id);
      if (index !== -1) {
        state.currentForm.fields[index] = { ...state.currentForm.fields[index], ...field };
      }
    },

    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload);
    },

    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.currentForm.fields.splice(fromIndex, 1);
      state.currentForm.fields.splice(toIndex, 0, removed);
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setFormName,
  createNewForm,
  loadForm,
  saveCurrentForm,
  deleteForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
  setLoading,
} = formSlice.actions;

export default formSlice.reducer;