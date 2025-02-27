import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Snackbar, TextField, Typography } from '@mui/material';
import * as yup from 'yup';

import {
  useCreateUserMutation,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
} from '@app/api/slice';

import { Container, ContentPaper } from './styles';

const schema = yup.object().shape({
  newUser: yup.boolean(),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    )
    .when('newUser', {
      is: true,
      then: (schema) => schema.required('Password is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  birthdate: yup.date().required('Date of birth is required'),
});

export default function UserForm() {
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id;
  const [getUserById, { data }] = useLazyGetUserByIdQuery();
  const [createUser, { data: createData, error: createError }] =
    useCreateUserMutation();
  const [updateUser, { data: updateData }] = useUpdateUserMutation();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue('newUser', !userId);
    if (userId) {
      void getUserById({ id: userId });
    }
  }, [userId]);
  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);
  useEffect(() => {
    if (updateData) {
      setShowSnackbar(true);
    }
  }, [updateData]);
  useEffect(() => {
    if (createData) {
      setShowSnackbar(true);
    }
  }, [createData]);
  useEffect(() => {
    if (createError && 'data' in createError) {
      const { code, message } = createError.data as {
        code: string;
        message: string;
      };
      if (code === 'USER_ALREADY_EXISTS') {
        setError('email', {
          type: 'server',
          message,
        });
      }
    }
  }, [createError]);

  const onSubmit = handleSubmit((data) => {
    if (userId) {
      void updateUser({ id: userId, user: data });
    } else {
      void createUser(data);
    }
  });

  return (
    <Container>
      <ContentPaper>
        <Typography variant="h6" gutterBottom>
          {userId ? 'Edit User' : 'Add User'}
        </Typography>
        <TextField
          margin="dense"
          label="First Name"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('firstName')}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <TextField
          margin="dense"
          label="Last Name"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('lastName')}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        {!userId && (
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
        <TextField
          margin="dense"
          type="date"
          label="Date of birth"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('birthdate')}
          error={!!errors.birthdate}
          helperText={errors.birthdate?.message}
        />
        <Button
          onClick={() => {
            void onSubmit();
          }}
          color="primary"
          variant="contained"
          sx={{ marginTop: 2 }}
          disabled={!isValid}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            void navigate('/');
          }}
          color="primary"
          variant="contained"
          sx={{ marginTop: 2 }}
        >
          Back
        </Button>
      </ContentPaper>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        message={userId ? 'User updated' : 'User created'}
        onClose={() => {
          setShowSnackbar(false);
        }}
      />
    </Container>
  );
}
