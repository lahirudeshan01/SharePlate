import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAuth } from '../components/AuthContext'
import { toast } from 'react-toastify'
import '../styles/global.css'

const ROLES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'shelter', label: 'Shelter / NGO' },
]

export default function RegisterPage() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'restaurant' } })

  const selectedRole = watch('role')

  const onSubmit = async (data) => {
    try {
      setApiError('')
      setLoading(true)
      await authRegister(data)
      toast.success('Account created successfully! Welcome to SharePlate.')
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="auth-page" sx={{ alignItems: 'flex-start', py: 4 }}>
      <Card className="auth-card" elevation={3} sx={{ maxWidth: 560 }}>
        <Box className="auth-logo">
          <Typography variant="h4" fontWeight={700} color="primary">
            🍽️ SharePlate
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Create your account
          </Typography>
        </Box>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="form-gap">
          {/* Basic info */}
          <TextField
            label="Full Name"
            fullWidth
            {...register('name', {
              required: 'Name is required',
              maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Role"
            fullWidth
            defaultValue="restaurant"
            {...register('role', { required: 'Role is required' })}
            error={!!errors.role}
            helperText={errors.role?.message}
          >
            {ROLES.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Organization info */}
          {(selectedRole === 'restaurant' || selectedRole === 'shelter') && (
            <TextField
              label="Organization Name"
              fullWidth
              {...register('organizationName', {
                required: 'Organization name is required',
              })}
              error={!!errors.organizationName}
              helperText={errors.organizationName?.message}
            />
          )}

          <TextField
            label="Phone (10 digits)"
            fullWidth
            {...register('phone', {
              pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit phone number' },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <Divider textAlign="left">
            <Typography variant="caption" color="text.secondary">
              Address (optional)
            </Typography>
          </Divider>

          <TextField
            label="Street"
            fullWidth
            {...register('address.street')}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="City" {...register('address.city')} />
            <TextField label="State" {...register('address.state')} />
            <TextField label="Zip Code" {...register('address.zipCode')} />
            <TextField label="Country" {...register('address.country')} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>

          <Typography textAlign="center" variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#e65100', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
