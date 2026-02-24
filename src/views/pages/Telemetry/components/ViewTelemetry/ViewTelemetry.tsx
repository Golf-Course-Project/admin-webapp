/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { CardContent, Divider, Drawer, Grid, IconButton, InputAdornment, TextField, Typography, Skeleton } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import CopyIcon from '@material-ui/icons/ContentCopy';
import CheckIcon from '@material-ui/icons/Check';

import { ErrorMessage } from 'common/components';
import { ITelemetry, IFetchTelemetryApiResponse } from 'interfaces/telemetry.interfaces';
import TelemetryService from 'services/telemetry.service';
import { LocationService, IIPLocationResponse } from 'services/location.service';
import CourseService from 'services/course.service';
import { IFetchCourseAndFacilityApiResponse } from 'interfaces/course.interfaces';

class ViewTelemetry extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    ready: false,
    data: null,
    id: this.props.id || '',
    courseName: '',
    clipCourseName: false,
    clipCourseId: false,
    ipAddress: '',
    referer: '',
    courseId: '',
    controller: '',
    request: '',
    response: '',
    dateCreated: '',
    locationData: null,
    locationLoading: false,
  }

  private resetForm = () => {
    this.setState({
      action: 'loading',
      messageCode: 200,
      messageText: '',
      open: false,
      ready: false,
      data: null,
      id: '',
      courseName: '',
      clipCourseName: false,
      clipCourseId: false,
      ipAddress: '',
      referer: '',
      courseId: '',
      controller: '',
      request: '',
      response: '',
      dateCreated: '',
      locationData: null,
      locationLoading: false,
    });
  }

  private fetchCourseName = async (courseId: string) => {
    if (!courseId) {
      this.setState({ courseName: '' });
      return;
    }

    const client: CourseService = new CourseService();

    try {
      const response: IFetchCourseAndFacilityApiResponse = await client.fetchIncFacility(courseId);
      const name = response?.value?.course?.name ?? '';

      // Avoid stale updates if selection changed while awaiting
      if (this.state.courseId === courseId) {
        this.setState({ courseName: name });
      }
    } catch (error) {
      // Non-fatal: telemetry should still render even if course fetch fails
      if (this.state.courseId === courseId) {
        this.setState({ courseName: '' });
      }
    }
  };

  private handleCopyCourseNameToClipboard = () => {
    if (!this.state.courseName) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.state.courseName).then(() => {
        this.setState({ clipCourseName: true });
        setTimeout(() => { this.setState({ clipCourseName: false }); }, 2000);
      }).catch(() => {
        // Clipboard write failed, silently ignore
      });
    }
  };

  private handleCopyCourseIdToClipboard = () => {
    if (!this.state.courseId) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.state.courseId).then(() => {
        this.setState({ clipCourseId: true });
        setTimeout(() => { this.setState({ clipCourseId: false }); }, 2000);
      }).catch(() => {
        // Clipboard write failed, silently ignore
      });
    }
  };

  private fetch = (id: string) => {
    const client: TelemetryService = new TelemetryService();

    client.fetch(id).then(async (response: IFetchTelemetryApiResponse) => {
      if (response.success && response.value) {
        const data = response.value;
        this.setState({
          data: data,
          id: data.id ?? '',
          ipAddress: data.ipAddress ?? '',
          referer: data.referer ?? '',
          courseId: data.courseId ?? '',
          controller: data.controller ?? '',
          request: data.request ?? '',
          response: data.response ?? '',
          dateCreated: data.dateCreated ? new Date(data.dateCreated).toLocaleString() : '',
          action: 'normal',
          ready: true
        });

        if (data.courseId) {
          this.fetchCourseName(data.courseId);
        } else {
          this.setState({ courseName: '' });
        }

        // Automatically lookup IP location if IP address exists
        if (data.ipAddress) {
          this.lookupIPLocation(data.ipAddress);
        }
      } else {
        this.setState({
          action: 'normal',
          ready: true,
          messageCode: response.messageCode,
          messageText: response.message || 'Failed to fetch telemetry data'
        });
      }
    }).catch((error: Error) => {
      console.error(error);
      this.setState({
        action: 'normal',
        ready: true,
        messageCode: 600,
        messageText: error.message
      });
    });
  }

  private lookupIPLocation = async (ip: string) => {
    if (!ip) return;

    this.setState({ locationLoading: true });
    
    try {
      const result: IIPLocationResponse = await LocationService.getIPLocation(ip);
      this.setState({ 
        locationData: result,
        locationLoading: false 
      });
    } catch (error) {
      console.error('Failed to lookup IP location:', error);
      this.setState({ 
        locationData: { success: false, error: 'Location lookup failed' },
        locationLoading: false 
      });
    }
  };

  componentDidUpdate(prevProps: any) {
    if (prevProps.open !== this.props.open && this.props.open) {      
      this.setState({ 
        open: this.props.open,
        id: this.props.id || '',
        action: 'loading',
        ready: false,
        courseName: '', // Clear previous course name
        courseId: '', // Clear previous course ID
      });

      if (this.props.id) {
        this.fetch(this.props.id);
      } else {
        this.setState({ 
          action: 'normal',
          ready: true
        });
      }
    }
  }

  handleOnClose() {
    this.resetForm();
    this.props.onClose();
  }

  private setErrorMessage = (messageCode: number, msg: string = '') => {
    switch (messageCode) {
      case 402:
        return 'Form values that were posted to the server are invalid.';
      case 600:
        return 'There was an error on the server: ' + msg;
      default:
        return '';
    }
  }

  render() {
    return (
      <Drawer
        anchor='right'
        open={this.state.open}
        variant={'temporary'}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: { xs: '100%', sm: '60%' } } }}
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
            {this.state.action === 'loading' ? (
              <Box display="flex" justifyContent="center">
                <Skeleton variant="text" width="40%" height={48} />
              </Box>
            ) : (
              <Typography
                variant="h3"
                align={'center'}
                sx={{ fontWeight: 500 }}
              >
                Telemetry Details
              </Typography>
            )}
          </Box>

          <Divider variant="middle" />         

          {this.state.action === 'loading' ? (
            <Box component={CardContent} padding={4}>
              <Grid container spacing={2}>
                {[...Array(8)].map((_, i) => (
                  <Grid item xs={12} key={i}>
                    <Skeleton variant="rectangular" height={56} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box component={CardContent} padding={4} sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <form noValidate autoComplete="off" style={{ width: '100%' }}>
                    <Box display="flex" flexDirection={'column'} sx={{ width: '100%' }}>
                      <Grid container spacing={1}>
                        
                        {(this.state.messageCode !== 200 || this.state.messageText) && (
                          <Grid item xs={12} md={12}>  
                            <Box sx={{ width: '100%', marginBottom: 2 }}>
                              <ErrorMessage message={this.state.messageText || this.setErrorMessage(this.state.messageCode, this.state.messageText)} />
                            </Box>
                          </Grid>
                        )}

                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="Telemetry Id"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            name={'id'}
                            value={this.state.id}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="Course Id"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            name={'courseId'}
                            value={this.state.courseId}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => this.handleCopyCourseIdToClipboard()}
                                    edge="end"
                                    size="small"
                                    disabled={!this.state.courseId}
                                  >
                                    {this.state.clipCourseId ? (
                                      <CheckIcon sx={{ color: green[700] }} />
                                    ) : (
                                      <CopyIcon />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="Course Name"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            name={'courseName'}
                            value={this.state.courseName}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => this.handleCopyCourseNameToClipboard()}
                                    edge="end"
                                    size="small"
                                    disabled={!this.state.courseName}
                                  >
                                    {this.state.clipCourseName ? (
                                      <CheckIcon sx={{ color: green[700] }} />
                                    ) : (
                                      <CopyIcon />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="IP Address"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            name={'ipAddress'}
                            value={this.state.ipAddress}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="Controller"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            name={'controller'}
                            value={this.state.controller}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="Referer"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            multiline
                            rows={2}
                            name={'referer'}
                            value={this.state.referer}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="Request"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            multiline
                            rows={6}
                            name={'request'}
                            value={this.state.request}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="Response"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            multiline
                            rows={8}
                            name={'response'}
                            value={this.state.response}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            type="text"
                            label="Date Created"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            name={'dateCreated'}
                            value={this.state.dateCreated}
                            disabled
                            helperText={' '}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        
                        {/* IP Location Information */}
                        {this.state.ipAddress && (
                          <>
                            <Grid item xs={12} md={12}>
                              <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1, fontWeight: 600 }}>
                                📍 IP Location Information
                              </Typography>
                            </Grid>
                            
                            {this.state.locationLoading ? (
                              <Grid item xs={12} md={12}>
                                <Skeleton variant="rectangular" width="100%" height={56} />
                              </Grid>
                            ) : this.state.locationData ? (
                              this.state.locationData.success ? (
                                <>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      type="text"
                                      label="Location"
                                      variant="outlined"
                                      color="primary"
                                      fullWidth
                                      value={`${this.state.locationData.data?.city}, ${this.state.locationData.data?.region}, ${this.state.locationData.data?.country}`}
                                      disabled
                                      helperText={' '}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      type="text"
                                      label="ISP/Organization"
                                      variant="outlined"
                                      color="primary"
                                      fullWidth
                                      value={this.state.locationData.data?.isp || 'Unknown'}
                                      disabled
                                      helperText={' '}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      type="text"
                                      label="Timezone"
                                      variant="outlined"
                                      color="primary"
                                      fullWidth
                                      value={this.state.locationData.data?.timezone || 'Unknown'}
                                      disabled
                                      helperText={' '}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      type="text"
                                      label="Coordinates"
                                      variant="outlined"
                                      color="primary"
                                      fullWidth
                                      value={`${this.state.locationData.data?.latitude}, ${this.state.locationData.data?.longitude}`}
                                      disabled
                                      helperText={' '}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                    />
                                  </Grid>
                                </>
                              ) : (
                                <Grid item xs={12} md={12}>
                                  <TextField
                                    type="text"
                                    label="Location Lookup"
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    value={this.state.locationData.error || 'Failed to lookup location'}
                                    disabled
                                    helperText={' '}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                </Grid>
                              )
                            ) : null}
                          </>
                        )}
                      </Grid>
                    </Box>
                  </form>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Drawer>
    );
  }
}

export default ViewTelemetry;

interface IProps {
  theme: Theme;
  open: boolean;
  id?: string | null;
  onClose: () => void;
}

interface IForm {
  action: 'loading' | 'normal';
  messageText: string;
  messageCode: number;
  open: boolean;
  ready: boolean;
  data: ITelemetry | null;
  id: string;
  courseName: string;
  clipCourseName: boolean;
  clipCourseId: boolean;
  ipAddress: string;
  referer: string;
  courseId: string;
  controller: string;
  request: string;
  response: string;
  dateCreated: string;
  locationData: IIPLocationResponse | null;
  locationLoading: boolean;
}
