/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CircularProgress, Divider, Grid, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography, Snackbar, Alert, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

import AddIcon from '@material-ui/icons/AddCircle';

import { IFacility } from 'interfaces/facility.interfaces';
import { ICourse, ICoursePatch, IFetchCourseAndFacilityApiResponse, IPatchCourseApiResponse } from 'interfaces/course.interfaces';
import CourseService from 'services/course.service';
import { green } from '@material-ui/core/colors';

class Ratings extends React.Component<IProps, {}> {
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
              ⭐ Ratings
            </Typography>
            <IconButton sx={{ mb: 1 }}>
              <AddIcon sx={{ color: green[500] }} />
            </IconButton>
          </Box>

          <Divider />

          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'}>
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
        </Box>          
      </div>           
    );

  }
}

export default Ratings;

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