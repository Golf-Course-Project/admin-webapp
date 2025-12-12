/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Drawer, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

class EditBlog extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    open: this.props.open,
    id: this.props.id,
    title: this.props.title,
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.open !== this.props.open && this.props.open) {      
      this.setState({ 
        open: this.props.open,
        id: this.props.id,
        title: this.props.title
      });
    }
  }

  handleOnClose() {
    this.setState({ open: false });
    this.props.onClose();
  }

  render() {
    return (
      <Drawer
        anchor='right'
        open={this.state.open}
        variant={'temporary'}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: { xs: '100%', sm: '75%' } } }}
      >  
        <Grid container spacing={1}>              
          <Grid item xs={11}>
          </Grid>
          <Grid item xs={1}>
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '10px', paddingTop: '10px' }}
              onClick={(e: any) => this.handleOnClose()}
            >
              <IconButton>
                <CloseIcon fontSize="small" />
              </IconButton>         
            </Box>  
          </Grid>
        </Grid>          

        <Box sx={{ height: '100%', padding: 1 }} >
          <Box marginBottom={1}>
            <Typography
              variant="h3"
              align={'center'}
              sx={{ fontWeight: 500, }}
            >
              {this.state.title}
            </Typography>
          </Box>

          <Box marginTop={4}>
            <Typography variant="body1" align={'center'}>
              Blog editing panel - Coming soon
            </Typography>
          </Box>
        </Box>
      </Drawer>
    );
  }
}

export default EditBlog;

interface IProps {
  theme: Theme;
  open: boolean;
  id?: string;
  title?: string;
  onClose: () => void;
}

interface IForm {
  open: boolean;
  id?: string;
  title?: string;
}
