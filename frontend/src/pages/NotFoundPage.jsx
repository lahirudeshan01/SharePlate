import { Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h2" fontWeight={700} color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Page Not Found
      </Typography>
      <Typography color="text.secondary" mb={4}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" size="large" component={Link} to="/">
        Back to Home
      </Button>
    </Box>
  )
}
