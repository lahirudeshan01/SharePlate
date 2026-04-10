import { Link } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import RecyclingIcon from '@mui/icons-material/Recycling'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const features = [
  {
    icon: <RestaurantIcon sx={{ fontSize: 28, color: '#e65100' }} />,
    iconBg: 'rgba(230, 81, 0, 0.1)',
    title: 'Restaurants',
    description:
      'Share surplus food instead of throwing it away. Help your community and reduce waste.',
  },
  {
    icon: <VolunteerActivismIcon sx={{ fontSize: 28, color: '#2e7d32' }} />,
    iconBg: 'rgba(46, 125, 50, 0.1)',
    title: 'Shelters',
    description:
      'Discover available food donations near you and request what your shelter needs.',
  },
  {
    icon: <RecyclingIcon sx={{ fontSize: 28, color: '#795548' }} />,
    iconBg: 'rgba(121, 85, 72, 0.1)',
    title: 'Less Waste',
    description:
      'Every meal shared is food saved from landfill and a step toward a sustainable future.',
  },
]

export default function HomePage() {
  return (
    <Box>
      {/* Hero */}
      <Box
        className="animate-fade-in"
        sx={{
          bgcolor: '#111827',
          color: 'white',
          py: { xs: 10, md: 16 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{
              color: '#e65100',
              fontWeight: 700,
              letterSpacing: '0.14em',
              fontSize: '0.75rem',
              display: 'block',
              mb: 2,
            }}
          >
            🍽️ SHAREPLATE PLATFORM
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem' },
              lineHeight: 1.15,
              mb: 3,
              color: '#f9fafb',
            }}
          >
            Food for those{' '}
            <Box component="span" sx={{ color: '#e65100' }}>
              who need it
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              mb: 5,
              maxWidth: 540,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.7,
              fontSize: '1.05rem',
            }}
          >
            Connecting restaurants with shelters to reduce food waste and feed
            communities — one plate at a time.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#e65100',
                '&:hover': { bgcolor: '#bf4500' },
                px: 4,
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                borderColor: 'rgba(255,255,255,0.25)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.7)',
                  bgcolor: 'rgba(255,255,255,0.06)',
                },
                px: 4,
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Stats strip */}
      <Box sx={{ bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            divider={<Box sx={{ width: '1px', bgcolor: '#e5e7eb', alignSelf: 'stretch' }} />}
            sx={{ py: 3 }}
          >
            {[
              { value: '500+', label: 'Meals Shared' },
              { value: '50+', label: 'Partner Restaurants' },
              { value: '30+', label: 'Shelters Supported' },
            ].map((s) => (
              <Box key={s.label} sx={{ flex: 1, textAlign: 'center', py: { xs: 1.5, sm: 0 } }}>
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.1em' }}
          >
            How it works
          </Typography>
          <Typography variant="h3" mt={1}>
            A simple way to share
          </Typography>
        </Box>
        <Grid container spacing={3} justifyContent="center">
          {features.map((f, i) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={f.title}
              className={`animate-fade-up delay-${i + 1}`}
            >
              <Card className="card-hover" sx={{ height: '100%', p: 1 }}>
                <CardContent sx={{ pt: 3, pb: '24px !important' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: f.iconBg,
                      mb: 2.5,
                    }}
                  >
                    {f.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {f.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" lineHeight={1.8}>
                    {f.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: '#111827', py: { xs: 7, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h3" color="#f9fafb" gutterBottom>
            Ready to make a difference?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', mb: 4, lineHeight: 1.7 }}>
            Join SharePlate today and be part of the solution to food waste and hunger.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#e65100',
              '&:hover': { bgcolor: '#bf4500' },
              px: 4,
            }}
          >
            Join Now — It's Free
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
