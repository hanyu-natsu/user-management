import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, TextField } from '@mui/material';
import * as yup from 'yup';

import { useLoginMutation } from '@app/api/slice';

import { Container, FormCard } from './styles';

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const [login, { error, fulfilledTimeStamp }] = useLoginMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit((data: { email: string; password: string }) => {
    void login(data);
  });

  if (!!fulfilledTimeStamp && !error) {
    void navigate('/user');
  }

  return (
    <Container>
      <FormCard>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          {...register('email')}
        ></TextField>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          {...register('password')}
        />
        <Button
          onClick={() => {
            void onSubmit();
          }}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!isValid}
        >
          Sign In
        </Button>
      </FormCard>
    </Container>
  );
}
