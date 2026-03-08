import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {/* Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
        >
          🍽️ SharePlate
        </Typography>

        {/* Nav links */}
        <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
          <Button color="inherit" component={Link} to="/dashboard" startIcon={<DashboardIcon />}>
            Dashboard
          </Button>
          {user?.role === 'admin' && (
            <Button color="inherit" component={Link} to="/users" startIcon={<PeopleIcon />}>
              Users
            </Button>
          )}
        </Box>

        {/* User avatar menu */}
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar sx={{ bgcolor: 'secondary.main', width: 34, height: 34, fontSize: '0.85rem' }}>
            {getInitials(user?.name)}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem
            component={Link}
            to="/profile"
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
