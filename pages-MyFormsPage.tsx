import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Box,
  Button,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

import { RootState } from '../redux/store';
import { loadForm, deleteForm } from '../redux/formSlice';

const MyFormsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedForms } = useSelector((state: RootState) => state.form);

  const handleOpenForm = (formId: string) => {
    const form = savedForms.find(f => f.id === formId);
    if (form) {
      dispatch(loadForm(form));
      navigate('/preview');
    }
  };

  const handleDeleteForm = (formId: string, formName: string) => {
    if (window.confirm(`Are you sure you want to delete "${formName}"?`)) {
      dispatch(deleteForm(formId));
    }
  };

  const handleCreateNew = () => {
    navigate('/create');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (savedForms.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            No Forms Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't created any forms yet. Get started by building your first dynamic form!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            Create Your First Form
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Forms ({savedForms.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          Create New Form
        </Button>
      </Box>

      <Paper>
        <List disablePadding>
          {savedForms.map((form, index) => (
            <React.Fragment key={form.id}>
              <ListItem
                sx={{
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {form.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Created {formatDate(form.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {form.fields.slice(0, 4).map((field) => (
                          <Chip
                            key={field.id}
                            label={`${field.label} (${field.type})`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {form.fields.length > 4 && (
                          <Chip
                            label={`+${form.fields.length - 4} more`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenForm(form.id)}
                    title="Preview Form"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteForm(form.id, form.name)}
                    title="Delete Form"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
              
              {index < savedForms.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          Click the eye icon to preview a form, or the trash icon to delete it permanently.
          All forms are stored locally in your browser.
        </Typography>
      </Alert>
    </Container>
  );
};

export default MyFormsPage;