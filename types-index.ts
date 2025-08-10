export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  password?: boolean;
}

export interface DerivedConfig {
  parentFields: string[];
  formula: string; // e.g., "age", "concat", "math"
}

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation: ValidationRules;
  derived?: DerivedConfig;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormBuilderState {
  currentForm: FormSchema;
  savedForms: FormSchema[];
  isLoading: boolean;
}