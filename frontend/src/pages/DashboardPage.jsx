import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Container,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BusinessIcon from '@mui/icons-material/Business'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useAuth } from '../context/AuthContext'

const roleConfig = {
  restaurant: {
    icon: <RestaurantIcon sx={{ fontSize: 32, color: '#e65100' }} />,
    iconBg: 'rgba(230,81,0,0.1)',
    label: 'Restaurant',
    color: 'warning',
    welcome: 'Share surplus food and reduce waste.',
  },
  donor: {
    icon: <RestaurantIcon sx={{ fontSize: 32, color: '#e65100' }} />,
    iconBg: 'rgba(230,81,0,0.1)',
    label: 'Restaurant / Donor',
    color: 'warning',
    welcome: 'Share surplus food and reduce waste.',
  },
  shelter: {
    icon: <VolunteerActivismIcon sx={{ fontSize: 32, color: '#2e7d32' }} />,
    iconBg: 'rgba(46,125,50,0.1)',
    label: 'Shelter / NGO',
    color: 'success',
    welcome: 'Find available food donations near you.',
  },
  admin: {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 32, color: '#1565c0' }} />,
    iconBg: 'rgba(21,101,192,0.1)',
    label: 'Administrator',
    color: 'info',
    welcome: 'Manage platform users and activity.',
  },
}

function InfoRow({ icon, label, value }) {
  if (!value) return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1 }}>
      <Box
        sx={{
          color: 'text.secondary',
          mt: 0.15,
          flexShrink: 0,
          display: 'flex',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500} color="text.primary">
          {value}
        </Typography>
      </Box>
    </Box>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const role = roleConfig[user?.role] || roleConfig.restaurant

  // Support both address formats: { street, city, ... } and location.adress
  const fullAddress = [
    user?.address?.street,
    user?.address?.city,
    user?.address?.state,
    user?.address?.zipCode,
    user?.address?.country,
  ]
    .filter(Boolean)
    .join(', ') || user?.location?.adress || user?.location?.address || user?.address || ''

  // Support both preciseLocation { latitude, longitude } and location { lat, lng }
  const hasDetailedCoords =
    user?.preciseLocation?.latitude !== undefined &&
    user?.preciseLocation?.longitude !== undefined
  const hasSimpleCoords =
    user?.location?.lat !== undefined &&
    user?.location?.lng !== undefined
  const hasPreciseLocation = hasDetailedCoords || hasSimpleCoords

  const lat = hasDetailedCoords ? user.preciseLocation.latitude : user?.location?.lat
  const lng = hasDetailedCoords ? user.preciseLocation.longitude : user?.location?.lng

  const preciseCoordinateText = hasPreciseLocation ? `${lat}, ${lng}` : ''
  const preciseLocationMapUrl = hasPreciseLocation ? `https://www.google.com/maps?q=${lat},${lng}` : ''

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box className="animate-fade-up">
      {/* Header */}
      <Box className="page-header">
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Typography color="text.secondary" mt={0.5}>
          Welcome back, <strong>{user?.name}</strong>
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile summary card */}
        <Grid item xs={12} md={5} className="animate-fade-up delay-1">
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pt: 3, px: 3 }}>
              {/* Role icon with background */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: role.iconBg,
                    flexShrink: 0,
                  }}
                >
                  {role.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                    {user?.name}
                  </Typography>
                  <Chip
                    label={role.label}
                    color={role.color}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <InfoRow icon={<PersonIcon fontSize="small" />} label="Full Name" value={user?.name} />
              <InfoRow icon={<EmailIcon fontSize="small" />} label="Email" value={user?.email} />
              <InfoRow icon={<PhoneIcon fontSize="small" />} label="Phone" value={user?.phone} />
              <InfoRow icon={<BusinessIcon fontSize="small" />} label="Organization" value={user?.organizationName} />
              <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Address" value={fullAddress} />
              <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Map Coordinates" value={preciseCoordinateText} />
              {hasPreciseLocation && (
                <Typography variant="caption" sx={{ pl: 4.5 }}>
                  <a href={preciseLocationMapUrl} target="_blank" rel="noreferrer">
                    Open in Google Maps
                  </a>
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Role info / quick actions */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={3}>
            <Grid item xs={12} className="animate-fade-up delay-2">
              <Card>
                <CardContent sx={{ px: 3, py: 2.5 }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing="0.08em">
                    Your Role
                  </Typography>
                  <Typography variant="h6" fontWeight={600} mt={0.5}>
                    {role.label}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" mt={0.5}>
                    {role.welcome}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} className="animate-fade-up delay-3">
              <Card>
                <CardContent sx={{ px: 3, py: 2.5 }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing="0.08em">
                    Account Status
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Member since{' '}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : '—'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    </Container>
  )
}
