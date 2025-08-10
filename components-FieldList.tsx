import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
} from '@mui/icons-material';

import { RootState } from '../redux/store';
import { deleteField, reorderFields } from '../redux/formSlice';

interface FieldListProps {
  onEditField: (fieldId: string) => void;
}

const FieldList: React.FC<FieldListProps> = ({ onEditField }) => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.form);

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteField(fieldId));
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (toIndex >= 0 && toIndex < currentForm.fields.length) {
      dispatch(reorderFields({ fromIndex, toIndex }));
    }
  };

  if (currentForm.fields.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No fields added yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the buttons on the left to add fields to your form
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          Form Fields ({currentForm.fields.length})
        </Typography>
      </Box>
      
      <List disablePadding>
        {currentForm.fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <ListItem
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {/* Drag Handle */}
              <IconButton
                size="small"
                sx={{ mr: 1, cursor: 'grab' }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <DragHandleIcon />
              </IconButton>

              {/* Field Info */}
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {field.label || 'Untitled Field'}
                    </Typography>
                    <Chip
                      label={field.type}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                    {field.required && (
                      <Chip
                        label="Required"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                    {field.derived && (
                      <Chip
                        label="Derived"
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {field.defaultValue && `Default: ${field.defaultValue} • `}
                      {field.validation.required && 'Required • '}
                      {field.validation.email && 'Email validation • '}
                      {field.validation.password && 'Password validation • '}
                      {field.validation.minLength && `Min length: ${field.validation.minLength} • `}
                      {field.validation.maxLength && `Max length: ${field.validation.maxLength} • `}
                      {field.options && `${field.options.length} options`}
                    </Typography>
                    {field.derived && (
                      <Typography variant="caption" color="secondary.main">
                        Formula: {field.derived.formula} | Parents: {field.derived.parentFields.join(', ')}
                      </Typography>
                    )}
                  </Box>
                }
              />

              {/* Move Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', mr: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => moveField(index, index - 1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveField(index, index + 1)}
                  disabled={index === currentForm.fields.length - 1}
                  title="Move down"
                >
                  ↓
                </IconButton>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  color="primary"
                  onClick={() => onEditField(field.id)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteField(field.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
            
            {index < currentForm.fields.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default FieldList;