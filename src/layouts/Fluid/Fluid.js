import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import { Topbar, Sidebar, Footer } from './components';
import Container from '../../common/Container';
import { pages } from '../navigation';

const Fluid = ({
  children,
  themeToggler,
  themeMode,
  setThemePalette,
  paletteType,
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  return (
    <div>
      <AppBar
        position={'fixed'}
        sx={{
          backgroundColor: 'transparent',
          width: '100%',
          left: 0,
          right: 0,
        }}
        elevation={0}
      >
        <Container paddingY={{ xs: 1 / 2, sm: 1 }} maxWidth={'100%'}>
          <Topbar
            onSidebarOpen={handleSidebarOpen}
            themeMode={themeMode}
            themeToggler={themeToggler}
            setThemePalette={setThemePalette}
            paletteType={paletteType}
          />
        </Container>
      </AppBar>
      <Sidebar
        onClose={handleSidebarClose}
        open={openSidebar}
        variant="temporary"
        pages={pages}
      />
      <main>{children}</main>
      <Divider />
      <Container paddingY={4}>
        <Footer />
      </Container>
    </div>
  );
};

Fluid.propTypes = {
  children: PropTypes.node,
  themeToggler: PropTypes.func.isRequired,
  themeMode: PropTypes.string.isRequired,
  setThemePalette: PropTypes.func.isRequired,
  paletteType: PropTypes.string.isRequired,
};

export default Fluid;
