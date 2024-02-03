import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ReviFiLogo from "../../assets/images/logo.ico"
import { Link, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import BSCLogo from '../../assets/images/binance-coin-bnb-seeklogo.svg';
import metamaskLogo from '../../assets/images/Metamask-icon.png';

const pages = ['Products', 'Staking', 'Governance'];
const settings = ['Automatic Balancing', 'ReviFi Trading', 'ReviFi Wallets', 'Analysis'];

function ResponsiveAppBar() {
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [wallet, setWallet] = React.useState('');

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  // const handleOpenUserMenu = (event) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const handleChange = (event) => {
    setWallet(event.target.value);
  };

  const networks = {
    "BSC": <img height={18} width={18} src={BSCLogo} ></img>,
    // "Metamask": <img height={18} width={18} src={metamaskLogo}></img>,
  }

  return (
    <AppBar elevation={0} position="static" style={{ backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to='/' style={{ textDecoration: 'none', color: 'black' }}>
            <div style={{ display: 'flex', paddingLeft: '6rem' }} >
              <img height={35} width={35} src= {ReviFiLogo} alt="ReviFi Logo" ></img>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                REVI
                <span className={styles["gradient"]} >
                  FI
                </span>
              </Typography>
            </div>
          </Link>

          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          {/* <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            REVIFI
          </Typography> */}

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: '4rem', justifyContent: 'flex-end', paddingRight: '8rem' }}>
            {/* <Button
              // onClick={handleOpenUserMenu}
              sx={{ my: 2, display: 'block' }}
              style={{ textTransform: 'none', color: '#000000', border: location.pathname.includes("/products") ? '2px solid #0047AA' : 'none' }}
            >
              Products
            </Button> */}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, idx) => (
                <Link key={idx} to={`products/${setting}`} style={{ textDecoration: 'none', color: 'black' }} >
                  <MenuItem onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
            {pages.map((page, idx) => (
              <Link key={idx} to={page.toLowerCase()} style={{ textDecoration: 'none' }}>
                <Button
                  // onMouseEnter={page === "Products" ? handleOpenUserMenu : null}
                  style={{ textTransform: 'none', color: '#000000', border: location.pathname === `/${page.toLowerCase()}` ? '2px solid #0047AA' : 'none' }}
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, display: 'block' }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }} >
            <FormControl sx={{ m: 1, width: 120 }} size='small' >
              <InputLabel id="demo-simple-select-label">Network</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={wallet}
                label="Wallet"
                onChange={handleChange}
              >
                {Object.keys(networks).map((network, idx) => (
                  <MenuItem key={idx} value={network} sx={{display: 'flex', gap: '1rem'}}>
                    {networks[network]}
                    <div>
                      {network}
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button sx={{ background: 'linear-gradient(#0047aa, #0085b6)', color: '#FFFFFF' }}>Connect Wallet</Button>
          </div>

          {/* This below component you can use it for Mobile Dropdown*/}
          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
