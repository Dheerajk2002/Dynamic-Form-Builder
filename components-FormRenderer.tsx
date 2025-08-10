import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';

import { FormField } from '../types';

interface FormRendererProps {
  fields: FormField[];
  control: Control<any>;
  errors: FieldErrors;
}

const FormRenderer: React.FC<FormRendererProps> = ({ fields, control, errors }) => {
  const renderField = (field: FormField) => {
    const error = errors[field.id];
    const isDisabled = !!field.derived;

    switch (field.type) {
      case 'text':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                fullWidth
                label={field.label}
                error={!!error}
                helperText={error?.message as string}
                required={field.required}
                disabled={isDisabled}
                type={field.validation.password ? 'password' : field.validation.email ? 'email' : 'text'}
                sx={{ mb: 2 }}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                fullWidth
                label={field.label}
                type="number"
                error={!!error}
                helperText={error?.message as string}
                required={field.required}
                disabled={isDisabled}
                sx={{ mb: 2 }}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                fullWidth
                multiline
                rows={4}
                label={field.label}
                error={!!error}
                helperText={error?.message as string}
                required={field.required}
                disabled={isDisabled}
                sx={{ mb: 2 }}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <FormControl fullWidth sx={{ mb: 2 }} error={!!error}>
                <InputLabel required={field.required}>{field.label}</InputLabel>
                <Select
                  {...controllerField}
                  label={field.label}
                  disabled={isDisabled}
                >
                  <MenuItem value="">
                    <em>Select an option</em>
                  </MenuItem>
                  {field.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {error && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {error.message as string}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <FormControl sx={{ mb: 2 }} error={!!error}>
                <FormLabel required={field.required}>{field.label}</FormLabel>
                <RadioGroup {...controllerField}>
                  {field.options?.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio disabled={isDisabled} />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
                {error && (
                  <Typography variant="caption" color="error">
                    {error.message as string}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...controllerField}
                      checked={controllerField.value || false}
                      disabled={isDisabled}
                    />
                  }
                  label={field.label + (field.required ? ' *' : '')}
                />
                {error && (
                  <Typography variant="caption" color="error" display="block">
                    {error.message as string}
                  </Typography>
                )}
              </Box>
            )}
          />
        );

      case 'date':
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                fullWidth
                label={field.label}
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!error}
                helperText={error?.message as string}
                required={field.required}
                disabled={isDisabled}
                sx={{ mb: 2 }}
              />
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {fields.map((field) => (
        <Box key={field.id}>
          {renderField(field)}
          {field.derived && (
            <Typography 
              variant="caption" 
              color="primary" 
              sx={{ display: 'block', mt: -1.5, mb: 1, ml: 1.5 }}
            >
              Computed field: {field.derived.formula}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default FormRenderer;