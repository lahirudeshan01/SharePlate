import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BusinessIcon from '@mui/icons-material/Business'
import { useAuth } from '../components/AuthContext'

const roleConfig = {
  restaurant: {
    icon: <RestaurantIcon sx={{ fontSize: 56, color: '#e65100' }} />,
    label: 'Restaurant',
    color: 'warning',
    welcome: 'Share surplus food and reduce waste.',
  },
  shelter: {
    icon: <VolunteerActivismIcon sx={{ fontSize: 56, color: '#2e7d32' }} />,
    label: 'Shelter / NGO',
    color: 'success',
    welcome: 'Find available food donations near you.',
  },
  admin: {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 56, color: '#1565c0' }} />,
    label: 'Administrator',
    color: 'info',
    welcome: 'Manage platform users and activity.',
  },
}

function InfoRow({ icon, label, value }) {
  if (!value) return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 0.75 }}>
      <Box sx={{ color: 'text.secondary', mt: 0.25 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const role = roleConfig[user?.role] || roleConfig.restaurant

  const fullAddress = [
    user?.address?.street,
    user?.address?.city,
    user?.address?.state,
    user?.address?.zipCode,
    user?.address?.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Box>
      {/* Header */}
      <Box className="page-header">
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Welcome back, {user?.name}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile summary card */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pb: 1, pt: 3 }}>
              {role.icon}
              <Typography variant="h6" fontWeight={600} mt={1}>
                {user?.name}
              </Typography>
              <Chip
                label={role.label}
                color={role.color}
                size="small"
                sx={{ mt: 0.5, mb: 2 }}
              />
              <Divider />
              <Box sx={{ textAlign: 'left', mt: 2 }}>
                <InfoRow icon={<PersonIcon fontSize="small" />} label="Full Name" value={user?.name} />
                <InfoRow icon={<EmailIcon fontSize="small" />} label="Email" value={user?.email} />
                <InfoRow icon={<PhoneIcon fontSize="small" />} label="Phone" value={user?.phone} />
                <InfoRow icon={<BusinessIcon fontSize="small" />} label="Organization" value={user?.organizationName} />
                <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Address" value={fullAddress} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Role info / quick actions */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Your Role
              </Typography>
              <Typography color="text.secondary">{role.welcome}</Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Account Status
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={user?.isActive ? 'Active' : 'Inactive'}
                  color={user?.isActive ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={user?.isVerified ? 'Email Verified' : 'Email Not Verified'}
                  color={user?.isVerified ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Member since:{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
