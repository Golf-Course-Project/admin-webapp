/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CircularProgress, Divider, Grid, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography, Snackbar, Alert, List, ListItem, ListItemText, ListItemAvatar, Avatar, Skeleton } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

import AddIcon from '@material-ui/icons/AddCircle';

import { IFacility } from 'interfaces/facility.interfaces';
import { ICourse, ICoursePatch, IFetchCourseAndFacilityApiResponse, IPatchCourseApiResponse } from 'interfaces/course.interfaces';
import CourseService from 'services/course.service';
import { green, grey } from '@material-ui/core/colors';

class Rankings extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',   
    messageCode: 200,
    messageText: '',   
    blurErrors: [],    
    data: null,   
    courseId: this.props.courseId,    
    facilityId: this.props.facilityId,
  }

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps: any) {
      
    //if (prevProps.open !== this.props.open) {           
    //  this.setState({
    //    open: this.props.open,
    //    name: this.props.name,
    //    id: this.props.id,
    //    facilityId: this.props.facilityId,                      
    //    action: 'loading'
    //  });
      
    //  if (this.props.open === true) this.fetch(this.props.id);
    //} 

  }

  private fetch = (id: string) => {

  }  

  private handleAddOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    console.log('handleAddOnClick');
  }

  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    //this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<IForm, keyof IForm>);
  };   

  render() {

    return (   
      <div>                 
        <Box display="flex" flexDirection={'column'} width={'100%'} sx={{ p: 0, width: '100%' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'}>
            <Typography sx={{ mb: 1 }} variant="h6" component="div">
              ⛳ Media Course Rankings
            </Typography>
            <IconButton sx={{ mb: 1 }} disabled={this.state.action !== 'normal'} onClick={(e: any) => this.handleAddOnClick(e)}>
              <AddIcon sx={this.state.action === 'normal' ? { color: green[500] } : { color: grey[500] }} />
            </IconButton>
          </Box>

          <Divider />

          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'} sx={ this.state.action === 'normal' ? {display: 'flex'} : {display: 'none'}}>
            <List dense={true} sx={{ width: '100%' }}>
              <ListItem divider secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemAvatar>
                  <Avatar>
                    GD
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Single-line item"
                  secondary={'Secondary text'}
                />
              </ListItem>
              <ListItem divider secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemAvatar>
                  <Avatar>
                    GM
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Single-line item"
                  secondary={'Secondary text'}
                />
              </ListItem>
              <ListItem divider secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemAvatar>
                  <Avatar>
                    🏌️‍♀️
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Single-line item"
                  secondary={'Secondary text'}
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={ this.state.action === 'loading' ? {display: 'block', width: '100%' } : {display: 'none', width: '100%' }}>            
            <Skeleton animation="wave" width={'100%'} />  
            <Skeleton animation="wave" width={'100%'} /> 
            <Skeleton animation="wave" width={'100%'} />           
          </Box>

        </Box>          
      </div>           
    );

  }
}

export default Rankings;

interface IProps {     
  theme: Theme;  
  facilityId: string;
  courseId: string;  
}

interface IForm {
  action: string, 
  messageText: string;
  messageCode: number;
  blurErrors: string[],
  data: { facility: IFacility | null, course: ICourse | null } | null,
  facilityId: string;
  courseId: string;   
}