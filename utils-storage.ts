import { FormSchema } from '../types';

const STORAGE_KEY = 'formBuilder_savedForms';

export const saveFormsToStorage = (forms: FormSchema[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('Failed to save forms to localStorage:', error);
  }
};

export const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load forms from localStorage:', error);
    return [];
  }
};

export const clearFormsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear forms from localStorage:', error);
  }
};