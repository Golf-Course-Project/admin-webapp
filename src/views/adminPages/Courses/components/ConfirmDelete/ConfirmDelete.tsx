/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Button, Stack } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { alpha } from '@material-ui/core';

import { IApiResponse } from 'interfaces/api-response.interface';
import CourseService from 'services/course.service';
import FacilityService from 'services/facility.service';

class ConfirmDelete extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};  

  handleOnDeleteClick(id: string) {    
        
    if (this.props.editMode === 'course') {
      let courseClient: CourseService | null = new CourseService();   

      courseClient.delete(id).then(async (response: IApiResponse) => {
        if (response.success) {        
          this.props.onSuccess(); 
        }
      }).catch((error: Error) => {
        console.log(error);
      });

      courseClient = null;
    }

    if (this.props.editMode === 'facility') {
      let facilityClient: FacilityService | null = new FacilityService();   

      facilityClient.delete(id).then(async (response: IApiResponse) => {
        if (response.success) {        
          this.props.onSuccess(); 
        }
      }).catch((error: Error) => {
        console.log(error);
      });

      facilityClient = null;
    }    
  }

  render() {
    return (

      <Box marginBottom={4} marginLeft={10} marginRight={10}>
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          marginBottom={2}
        >
          <Box
            component={Avatar}
            width={'100%'}
            height={'100%'}
            marginBottom={2}
            bgcolor={alpha(this.props.theme.palette.primary.main, 0.0)}
            color={this.props.theme.palette.primary.main}
          >
            <svg
              height={200}
              width={200}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>            
          </Box>
        </Box>      

        <Box
          component={Typography}
          fontWeight={700}
          variant={'h3'}
          gutterBottom
          align={'center'}      
        >
          Are you sure you want to delete this {this.props.editMode === 'course' ? 'course' : 'facility'}?          
        </Box> 

        <Box
          component={Typography}
          fontWeight={300}
          marginTop={8}
          variant={'h4'}
          gutterBottom
          align={'center'}      
        >
          {this.props.text}       
        </Box> 
               
        <Box marginTop={8} display={'flex'} justifyContent={'center'}>
          <Stack spacing={2} direction="row">          
            <Button
              size={'large'}     
              variant="contained"
              color={'primary'}        
              onClick={(e: any) => this.handleOnDeleteClick(this.props.id)}
            >
              Yes, Delete {this.props.editMode === 'course' ? 'Course' : 'Facility'}
            </Button>

            <Button
              size={'large'}   
              variant="contained"  
              color={'secondary'}        
              onClick={(e: any) => this.props.onCancel()}
            >
              Oops, Nevermind
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }
}

export default ConfirmDelete;

interface IProps {
  id: string;
  theme: Theme;
  editMode: string;
  text: string;
  onSuccess: () => void;
  onCancel: () => void;
}
