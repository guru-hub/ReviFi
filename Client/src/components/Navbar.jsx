import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ReviFiLogo from "../assets/images/ReviFiLogo.png"
import { Link, useLocation } from 'react-router-dom';
import styles from './components.module.css';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import BSCLogo from '../assets/images/binance-coin-bnb-seeklogo.svg';
import EthLogo from '../assets/images/ethereum-eth-logo.png';
import { useMetaMask } from "../Hooks/useMetamask";

const pages = ['Products', 'Staking', 'Governance'];
const settings = ['Automatic Balancing', 'ReviFi Trading', 'ReviFi networks', 'Analysis'];

function ResponsiveAppBar() {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();
  const location = useLocation();
  const [, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [network, setNetwork] = React.useState('BSC');

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
    setNetwork(event.target.value);
  };

  const networks = {
    "BSC": <img height={18} width={18} src={BSCLogo} ></img>,
    "Sepolia": <img height={18} width={18} src={EthLogo} ></img>,
    // "Metamask": <img height={18} width={18} src={metamaskLogo}></img>,
  }

  return (
    <AppBar elevation={0} position="static" style={{ backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', paddingLeft: '10rem', paddingRight: '8rem' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to='/' style={{ textDecoration: 'none', color: 'black' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} >
              <img height={100} width={100} src={ReviFiLogo} alt="ReviFi Logo" ></img>
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

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: '3rem', justifyContent: 'flex-end', paddingRight: '8rem', alignItems: 'center' }}>
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
                  style={{ textTransform: 'none', color: '#000000', border: location.pathname === `/${page.toLowerCase()}` ? '2px solid #0047AA' : 'none', backgroundColor: '#F6F6F6' }}
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, display: 'block', borderRadius: '7px' }}
                >
                  {page}
                </Button>
              </Link>
            ))}
            <FormControl sx={{ m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} size='small' >
              <Select
                id="demo-simple-select"
                sx={{ display: 'flex', gap: '1rem', backgroundColor: '#F6F6F6', height: '2.3rem', width: 'fit-content', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                value={network}
                onChange={handleChange}
              >
                {Object.keys(networks).map((network, idx) => (
                  <MenuItem key={idx} value={network} sx={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: "flex", gap: '0.5rem' }}>
                      {networks[network]}
                      <Typography sx={{ width: "fit-content" }} >{network}</Typography>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
              <Button sx={{ background: 'linear-gradient(#0047aa, #0085b6)', color: '#FFFFFF' }}>
                {!hasProvider ? "Install Metamask" : (isConnecting ? "Connecting..." : (wallet.accounts.length ? wallet.accounts.slice(0, 6) + "..." + wallet.accounts.slice(-4) : "Connect Metamask"))}
              </Button>
            </div>
          </Box>

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
