import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Box,
} from '@mui/material';

import { RootState } from '../redux/store';
import { createYupSchema, computeDerivedValue } from '../utils/validation';
import FormRenderer from '../components/FormRenderer';

const PreviewPage: React.FC = () => {
  const { currentForm } = useSelector((state: RootState) => state.form);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const schema = createYupSchema(currentForm.fields);
  const defaultValues = currentForm.fields.reduce((acc, field) => {
    acc[field.id] = field.defaultValue || (field.type === 'checkbox' ? false : '');
    return acc;
  }, {} as Record<string, any>);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Handle derived fields
  useEffect(() => {
    currentForm.fields.forEach(field => {
      if (field.derived) {
        const parentValues = field.derived.parentFields.reduce((acc, parentId) => {
          acc[parentId] = watchedValues[parentId];
          return acc;
        }, {} as Record<string, any>);

        const computedValue = computeDerivedValue(
          field.derived.formula,
          parentValues,
          currentForm.fields
        );

        setValue(field.id, computedValue);
      }
    });
  }, [watchedValues, currentForm.fields, setValue]);

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setFormData(data);
    alert('Form submitted successfully! Check the console for details.');
  };

  if (currentForm.fields.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            No form to preview
          </Typography>
          <Typography>
            Go to the Create page to build a form first, then come back here to test it.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {currentForm.name || 'Untitled Form'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preview Mode - This is how your form appears to end users
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormRenderer
            fields={currentForm.fields}
            control={control}
            errors={errors}
          />
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3 }}
          >
            Submit Form
          </Button>
        </form>

        {Object.keys(formData).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Last Submission:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PreviewPage;