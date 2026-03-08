import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAuth } from '../components/AuthContext'
import userService from '../services/userService'
import authService from '../services/authService'
import { toast } from 'react-toastify'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      organizationName: user?.organizationName || '',
      'address.street': user?.address?.street || '',
      'address.city': user?.address?.city || '',
      'address.state': user?.address?.state || '',
      'address.zipCode': user?.address?.zipCode || '',
      'address.country': user?.address?.country || '',
    },
  })

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm()

  const onProfileSubmit = async (data) => {
    try {
      setProfileError('')
      setProfileLoading(true)
      const address = {
        street: data['address.street'],
        city: data['address.city'],
        state: data['address.state'],
        zipCode: data['address.zipCode'],
        country: data['address.country'],
      }
      const payload = {
        name: data.name,
        phone: data.phone,
        organizationName: data.organizationName,
        address,
      }
      const res = await userService.updateProfile(payload)
      updateUser(res.data)
      toast.success('Profile updated successfully')
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      setPasswordError('')
      setPasswordLoading(true)
      await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password updated successfully')
      resetPassword()
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <Box>
      <Box className="page-header">
        <Typography variant="h4" fontWeight={700}>
          My Profile
        </Typography>
        <Typography color="text.secondary">Manage your account information</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile info form */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {profileError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {profileError}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="form-gap"
              >
                <TextField
                  label="Full Name"
                  fullWidth
                  {...regProfile('name', { required: 'Name is required' })}
                  error={!!profileErrors.name}
                  helperText={profileErrors.name?.message}
                />

                <TextField
                  label="Phone (10 digits)"
                  fullWidth
                  {...regProfile('phone', {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit phone number',
                    },
                  })}
                  error={!!profileErrors.phone}
                  helperText={profileErrors.phone?.message}
                />

                {(user?.role === 'restaurant' || user?.role === 'shelter') && (
                  <TextField
                    label="Organization Name"
                    fullWidth
                    {...regProfile('organizationName')}
                  />
                )}

                <Divider textAlign="left">
                  <Typography variant="caption" color="text.secondary">
                    Address
                  </Typography>
                </Divider>

                <TextField label="Street" fullWidth {...regProfile('address.street')} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField label="City" {...regProfile('address.city')} />
                  <TextField label="State" {...regProfile('address.state')} />
                  <TextField label="Zip Code" {...regProfile('address.zipCode')} />
                  <TextField label="Country" {...regProfile('address.country')} />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={profileLoading}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {profileLoading ? 'Saving…' : 'Save Changes'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={5}>
          {/* Account info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Account
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography gutterBottom>{user?.email}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={user?.isActive ? 'Active' : 'Inactive'}
                  color={user?.isActive ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={user?.isVerified ? 'Verified' : 'Unverified'}
                  color={user?.isVerified ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Change password */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Change Password
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {passwordError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {passwordError}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="form-gap"
              >
                <TextField
                  label="Current Password"
                  type={showCurrent ? 'text' : 'password'}
                  fullWidth
                  {...regPassword('currentPassword', { required: 'Current password is required' })}
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCurrent((p) => !p)} edge="end">
                          {showCurrent ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="New Password"
                  type={showNew ? 'text' : 'password'}
                  fullWidth
                  {...regPassword('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNew((p) => !p)} edge="end">
                          {showNew ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating…' : 'Update Password'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
