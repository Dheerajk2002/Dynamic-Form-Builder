import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';

import { RootState } from '../redux/store';
import {
  setFormName,
  addField,
  saveCurrentForm,
  createNewForm,
} from '../redux/formSlice';
import { FormField, FieldType } from '../types';
import FieldList from '../components/FieldList';
import FieldConfigModal from '../components/FieldConfigModal';

const CreatePage: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.form);
  
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formNameInput, setFormNameInput] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const fieldTypes: { value: FieldType; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
  ];

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: nanoid(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      validation: {},
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
    };

    dispatch(addField(newField));
    setEditingFieldId(newField.id);
  };

  const handleSaveForm = () => {
    if (currentForm.fields.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one field before saving',
        severity: 'error',
      });
      return;
    }
    setFormNameInput(currentForm.name);
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (!formNameInput.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a form name',
        severity: 'error',
      });
      return;
    }

    dispatch(setFormName(formNameInput.trim()));
    dispatch(saveCurrentForm());
    setSaveDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Form saved successfully!',
      severity: 'success',
    });
  };

  const handleNewForm = () => {
    dispatch(createNewForm());
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Form Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleNewForm}
              disabled={!currentForm.name && currentForm.fields.length === 0}
            >
              New Form
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveForm}
              disabled={currentForm.fields.length === 0}
            >
              Save Form
            </Button>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Form Name"
          value={currentForm.name}
          onChange={(e) => dispatch(setFormName(e.target.value))}
          placeholder="Enter form name..."
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Fields: {currentForm.fields.length}
          </Typography>
          <Chip
            size="small"
            label={currentForm.name ? currentForm.name : 'Untitled Form'}
            variant="outlined"
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Sidebar - Field Types */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Add Fields
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {fieldTypes.map(({ value, label }) => (
                <Button
                  key={value}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddField(value)}
                  fullWidth
                  size="small"
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Main Content - Field List */}
        <Grid item xs={12} md={9}>
          <FieldList onEditField={setEditingFieldId} />
        </Grid>
      </Grid>

      {/* Field Configuration Modal */}
      <FieldConfigModal
        open={!!editingFieldId}
        fieldId={editingFieldId}
        onClose={() => setEditingFieldId(null)}
      />

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Form Name"
            value={formNameInput}
            onChange={(e) => setFormNameInput(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreatePage;