import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import { Topbar, Sidebar, Footer } from './components';
import Container from '../../common/Container';
import { pages } from '../navigation';

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

HideOnScroll.propTypes = {
  children: PropTypes.node.isRequired,
};

const MainSecure = ({ children, themeToggler, themeMode, setThemePalette, paletteType, }) => {
  const theme = useTheme();
  const [openSidebar, setOpenSidebar] = useState(false);  
  const auth = { isAuthenticated: true, permissions: [] };
  
  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };    

  return (
    <div>
      <HideOnScroll>
        <AppBar
          position={'fixed'}
          sx={{
            backgroundColor: theme.palette.background.paper,
            width: '100%',
            left: 0,
            right: 0,
          }}
          elevation={1}
        >
          <Container paddingY={{ xs: 1 / 2, sm: 1 }}>
            <Topbar
              onSidebarOpen={handleSidebarOpen}
              themeMode={themeMode}
              themeToggler={themeToggler}
              setThemePalette={setThemePalette}
              paletteType={paletteType}
            />
          </Container>
        </AppBar>
      </HideOnScroll>
      <Sidebar
        onClose={handleSidebarClose}
        open={openSidebar}
        variant="temporary"
        pages={pages}
        auth={auth}
      />
      <main>
        <Box height={{ xs: 56, sm: 64 }} />
        {children}
        <Divider />
      </main>
      <Container paddingY={4}>
        <Footer />
      </Container>
    </div>
  );
};

MainSecure.propTypes = {
  children: PropTypes.node,
  themeToggler: PropTypes.func.isRequired,
  themeMode: PropTypes.string.isRequired,
  setThemePalette: PropTypes.func.isRequired,
  paletteType: PropTypes.string.isRequired,
};

export default MainSecure;
