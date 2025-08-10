import * as yup from 'yup';
import { FormField, ValidationRules } from '../types';

export const validateFieldValue = (value: any, rules: ValidationRules): string | null => {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'This field is required';
  }

  if (value && typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`;
    }

    if (rules.email && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }

    if (rules.password && !isValidPassword(value)) {
      return 'Password must be at least 8 characters long and contain at least one number';
    }
  }

  return null;
};

export const createYupSchema = (fields: FormField[]) => {
  const shape: Record<string, any> = {};

  fields.forEach(field => {
    let schema: any;

    switch (field.type) {
      case 'number':
        schema = yup.number().typeError('Must be a number');
        break;
      case 'date':
        schema = yup.date().typeError('Must be a valid date');
        break;
      case 'checkbox':
        schema = yup.boolean();
        break;
      default:
        schema = yup.string();
    }

    if (field.validation.required) {
      if (field.type === 'checkbox') {
        schema = schema.oneOf([true], 'This field is required');
      } else {
        schema = schema.required('This field is required');
      }
    }

    if (field.validation.minLength && (field.type === 'text' || field.type === 'textarea')) {
      schema = schema.min(field.validation.minLength, `Minimum length is ${field.validation.minLength} characters`);
    }

    if (field.validation.maxLength && (field.type === 'text' || field.type === 'textarea')) {
      schema = schema.max(field.validation.maxLength, `Maximum length is ${field.validation.maxLength} characters`);
    }

    if (field.validation.email) {
      schema = schema.email('Please enter a valid email address');
    }

    if (field.validation.password) {
      schema = schema.matches(
        /^(?=.*\d).{8,}$/,
        'Password must be at least 8 characters long and contain at least one number'
      );
    }

    shape[field.id] = schema;
  });

  return yup.object().shape(shape);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /\d/.test(password);
};

// Derived field computation
export const computeDerivedValue = (
  formula: string,
  parentValues: Record<string, any>,
  fields: FormField[]
): any => {
  try {
    switch (formula.toLowerCase()) {
      case 'age':
        // Find first date field in parent values and compute age
        for (const [fieldId, value] of Object.entries(parentValues)) {
          const field = fields.find(f => f.id === fieldId);
          if (field?.type === 'date' && value) {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            
            return age >= 0 ? age : 0;
          }
        }
        return 0;

      case 'concat':
        // Concatenate all parent values
        return Object.values(parentValues)
          .filter(val => val !== null && val !== undefined && val !== '')
          .join(' ');

      case 'sum':
        // Sum all numeric parent values
        return Object.values(parentValues)
          .filter(val => !isNaN(Number(val)))
          .reduce((sum, val) => sum + Number(val), 0);

      case 'average':
        // Average of all numeric parent values
        const numericValues = Object.values(parentValues)
          .filter(val => !isNaN(Number(val)))
          .map(val => Number(val));
        
        return numericValues.length > 0 
          ? numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length 
          : 0;

      default:
        // Try to evaluate as simple math expression
        const expression = formula.replace(/[a-zA-Z_]\w*/g, (match) => {
          const value = parentValues[match];
          return value !== undefined ? String(value) : '0';
        });

        // Simple expression evaluation (only basic math)
        if (/^[\d+\-*/()\s.]+$/.test(expression)) {
          return Function('"use strict"; return (' + expression + ')')();
        }

        return '';
    }
  } catch (error) {
    console.warn('Error computing derived value:', error);
    return '';
  }
};