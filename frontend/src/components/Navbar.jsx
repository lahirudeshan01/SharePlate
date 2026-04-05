import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  ListItemIcon,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    handleMenuClose()
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const navBtnStyles = (path) => ({
    color: location.pathname === path ? 'primary.main' : 'text.secondary',
    fontWeight: location.pathname === path ? 700 : 500,
    fontSize: '0.875rem',
    borderRadius: 2,
    px: 1.5,
    py: 0.75,
    position: 'relative',
    transition: 'color 0.2s ease, background-color 0.2s ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: location.pathname === path ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
      width: '60%',
      height: '2px',
      bgcolor: 'primary.main',
      borderRadius: 1,
      transition: 'transform 0.2s ease',
    },
    '&:hover': {
      color: 'primary.main',
      bgcolor: 'rgba(230,81,0,0.06)',
      '&::after': {
        transform: 'translateX(-50%) scaleX(1)',
      },
    },
  })

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 0.5, minHeight: { xs: 56, sm: 64 } }}>

        {/* Brand */}
        <Box
          component={Link}
          to="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexGrow: 1,
            textDecoration: 'none',
            color: 'text.primary',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            🍽️
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, letterSpacing: '-0.01em', fontSize: '1.1rem' }}
          >
            SharePlate
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
          <Button
            component={Link}
            to="/dashboard"
            startIcon={<DashboardIcon sx={{ fontSize: '1rem !important' }} />}
            sx={navBtnStyles('/dashboard')}
            disableRipple={false}
          >
            Dashboard
          </Button>
          {user?.role === 'admin' && (
            <Button
              component={Link}
              to="/users"
              startIcon={<PeopleIcon sx={{ fontSize: '1rem !important' }} />}
              sx={navBtnStyles('/users')}
              disableRipple={false}
            >
              Users
            </Button>
          )}
        </Box>

        {/* User avatar menu */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            p: 0.5,
            border: '2px solid',
            borderColor: Boolean(anchorEl) ? 'primary.main' : 'transparent',
            borderRadius: '50%',
            transition: 'border-color 0.2s ease',
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 32,
              height: 32,
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {getInitials(user?.name)}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { sx: { mt: 1 } } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            component={Link}
            to="/profile"
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" color="action" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
