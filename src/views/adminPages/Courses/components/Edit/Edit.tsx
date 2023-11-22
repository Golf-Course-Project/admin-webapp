/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { CardContent, Divider, Drawer, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { ICourses } from 'interfaces/course.interfaces';

class EditCourse extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IEditCourse = {
    action: 'normal',
    errorMsg: '',
    open: this.props.open,
    selectedCourse: this.props.selectedCourse,
  }

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps: any) {     
    if (prevProps.open !== this.props.open) {       
      this.setState({ open: this.props.open, selectedCourse: this.props.selectedCourse, action: 'normal' });
    }
  }  

  handleOnClose() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  }

  handleOnCloseAfterDelete() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  }

  cancelDeleteCallback() {
    this.setState({ action: 'normal' });   
  }  

  render() {

    if (!this.state.selectedCourse) {
      return (<div style={{ display: 'none' }}>&nbsp;</div>);
    }
    else {
      return (
        <Drawer
          anchor='right'
          open={this.state.open}
          variant={'temporary'}
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: { xs: '100%', sm: 900 } } }}
        >
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

          <Box display={this.state.action === 'confirm-delete' ? 'none' : 'block'} sx={{ height: '100%', padding: 1 }} >
           
            <Box marginBottom={4}>
              <Typography
                variant="h3"
                align={'center'}
                sx={{ fontWeight: 500, }}
              >
                {this.state.selectedCourse.courseName}
              </Typography>
            </Box>            
            <Divider variant="middle" />
            <Box component={CardContent} padding={4}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  hello
                </Grid>
              </Grid>
            </Box>
          </Box>          
        </Drawer>
      );
    }
  }
}

export default EditCourse;

interface IProps {
  onClose: () => void;
  theme: Theme;
  open: boolean;
  selectedCourse: ICourses | any;
}

interface IEditCourse {
  action: string,
  errorMsg: string;
  open: boolean;
  selectedCourse: ICourses;
}