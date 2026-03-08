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

const features = [
  {
    icon: <RestaurantIcon color="primary" sx={{ fontSize: 48 }} />,
    title: 'Restaurants',
    description:
      'Share surplus food instead of throwing it away. Help your community and reduce waste.',
  },
  {
    icon: <VolunteerActivismIcon color="secondary" sx={{ fontSize: 48 }} />,
    title: 'Shelters',
    description:
      'Discover available food donations near you and request what your shelter needs.',
  },
  {
    icon: <RecyclingIcon sx={{ fontSize: 48, color: '#795548' }} />,
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
        sx={{
          background: 'linear-gradient(135deg, #e65100 0%, #2e7d32 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={700} gutterBottom>
            🍽️ SharePlate
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
            Connecting restaurants with shelters to reduce food waste and feed communities.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#f5f5f5' } }}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight={600} mb={5}>
          How it works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((f) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box mb={2}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {f.title}
                  </Typography>
                  <Typography color="text.secondary">{f.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Ready to make a difference?
          </Typography>
          <Typography sx={{ opacity: 0.9, mb: 3 }}>
            Join SharePlate today and be part of the solution.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            Join Now – It's Free
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
