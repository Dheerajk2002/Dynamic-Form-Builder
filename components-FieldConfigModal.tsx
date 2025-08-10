import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Chip,
  Divider,
  Autocomplete,
} from '@mui/material';

import { RootState } from '../redux/store';
import { updateField } from '../redux/formSlice';
import { FormField, FieldType } from '../types';

interface FieldConfigModalProps {
  open: boolean;
  fieldId: string | null;
  onClose: () => void;
}

const FieldConfigModal: React.FC<FieldConfigModalProps> = ({ open, fieldId, onClose }) => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.form);
  
  const field = fieldId ? currentForm.fields.find(f => f.id === fieldId) : null;
  
  const [localField, setLocalField] = useState<FormField | null>(null);
  const [optionsText, setOptionsText] = useState('');

  useEffect(() => {
    if (field) {
      setLocalField({ ...field });
      setOptionsText(field.options?.join('\n') || '');
    }
  }, [field]);

  const handleSave = () => {
    if (localField) {
      const updates: Partial<FormField> = { ...localField };
      
      // Process options for select/radio fields
      if ((localField.type === 'select' || localField.type === 'radio') && optionsText) {
        updates.options = optionsText
          .split('\n')
          .map(opt => opt.trim())
          .filter(opt => opt.length > 0);
      }

      dispatch(updateField({ id: localField.id, field: updates }));
      onClose();
    }
  };

  const updateLocalField = (updates: Partial<FormField>) => {
    if (localField) {
      setLocalField({ ...localField, ...updates });
    }
  };

  const updateValidation = (key: keyof FormField['validation'], value: any) => {
    if (localField) {
      setLocalField({
        ...localField,
        validation: {
          ...localField.validation,
          [key]: value,
        },
      });
    }
  };

  const updateDerived = (key: string, value: any) => {
    if (localField) {
      setLocalField({
        ...localField,
        derived: {
          ...localField.derived,
          [key]: value,
        } as any,
      });
    }
  };

  const availableParentFields = currentForm.fields.filter(f => f.id !== fieldId && !f.derived);
  const fieldTypes: FieldType[] = ['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'];

  if (!localField) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configure Field: {localField.label}</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Basic Configuration */}
          <Typography variant="h6">Basic Settings</Typography>
          
          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={localField.type}
              label="Field Type"
              onChange={(e) => updateLocalField({ type: e.target.value as FieldType })}
            >
              {fieldTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Label"
            value={localField.label}
            onChange={(e) => updateLocalField({ label: e.target.value })}
          />

          <TextField
            fullWidth
            label="Default Value"
            value={localField.defaultValue || ''}
            onChange={(e) => updateLocalField({ defaultValue: e.target.value })}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localField.required}
                onChange={(e) => updateLocalField({ required: e.target.checked })}
              />
            }
            label="Required Field"
          />

          {/* Options for Select/Radio */}
          {(localField.type === 'select' || localField.type === 'radio') && (
            <>
              <Divider />
              <Typography variant="h6">Options</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Options (one per line)"
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                placeholder="Option 1\nOption 2\nOption 3"
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {optionsText.split('\n').filter(opt => opt.trim()).map((option, idx) => (
                  <Chip key={idx} label={option.trim()} size="small" />
                ))}
              </Box>
            </>
          )}

          {/* Validation Rules */}
          <Divider />
          <Typography variant="h6">Validation Rules</Typography>

          {(localField.type === 'text' || localField.type === 'textarea') && (
            <>
              <TextField
                type="number"
                label="Minimum Length"
                value={localField.validation.minLength || ''}
                onChange={(e) => updateValidation('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                inputProps={{ min: 0 }}
              />
              <TextField
                type="number"
                label="Maximum Length"
                value={localField.validation.maxLength || ''}
                onChange={(e) => updateValidation('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                inputProps={{ min: 0 }}
              />
            </>
          )}

          {localField.type === 'text' && (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={localField.validation.email || false}
                    onChange={(e) => updateValidation('email', e.target.checked)}
                  />
                }
                label="Email Validation"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localField.validation.password || false}
                    onChange={(e) => updateValidation('password', e.target.checked)}
                  />
                }
                label="Password Rules (8+ chars, 1+ number)"
              />
            </>
          )}

          {/* Derived Fields */}
          <Divider />
          <Typography variant="h6">Derived Field</Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={!!localField.derived}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateLocalField({
                      derived: {
                        parentFields: [],
                        formula: 'concat',
                      },
                    });
                  } else {
                    updateLocalField({ derived: undefined });
                  }
                }}
              />
            }
            label="Make this a derived field"
          />

          {localField.derived && (
            <>
              <Autocomplete
                multiple
                options={availableParentFields}
                getOptionLabel={(option) => option.label}
                value={availableParentFields.filter(f => localField.derived?.parentFields.includes(f.id))}
                onChange={(_, newValue) => {
                  updateDerived('parentFields', newValue.map(f => f.id));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Parent Fields" placeholder="Select fields" />
                )}
              />

              <FormControl fullWidth>
                <InputLabel>Formula</InputLabel>
                <Select
                  value={localField.derived.formula}
                  label="Formula"
                  onChange={(e) => updateDerived('formula', e.target.value)}
                >
                  <MenuItem value="concat">Concatenate values</MenuItem>
                  <MenuItem value="age">Calculate age from date</MenuItem>
                  <MenuItem value="sum">Sum numeric values</MenuItem>
                  <MenuItem value="average">Average of numeric values</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="caption" color="text.secondary">
                Derived fields are automatically calculated and cannot be edited by users.
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldConfigModal;