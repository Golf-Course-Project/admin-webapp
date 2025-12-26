/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Tooltip, Skeleton, Checkbox, Select, MenuItem, FormControl, Chip, Box as MuiBox, Link } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';
import ArticleIcon from '@material-ui/icons/Article';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
import FlagIcon from '@material-ui/icons/Flag';

import NotFoundIllustration from 'svg/illustrations/NotFound';
import ViewTelemetry from '../ViewTelemetry';

import { SkeletonTable } from 'common/components';

import { ITelemetryListItem, ITelemetryListApiResponse } from 'interfaces/telemetry.interfaces';
import TelemetryService from 'services/telemetry.service';
import { LocationService, IIPLocationResponse } from 'services/location.service';
import ErrorMessage from 'common/components/ErrorMessage';

class ListTelemetry extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',
    errorMsg: '',   
    data: [],
    count: 0,   
    selectedRowId: '', 
    openTelemetrySideBar: false,   
    selectedTelemetryId: null,
    courseRelatedExpanded: true,
    generalExpanded: true,
    ipLocations: {},
    loadingLocations: {},
    selectedCourseRelatedItems: [],
    selectedGeneralItems: [],
    selectedCourseRelatedIPs: [],
    selectedGeneralIPs: [],
    selectedCourses: [],
    selectedControllers: [],
    selectedStates: [],
    selectedReferrers: [],
    selectedGeneralControllers: [],
    selectedGeneralReferrers: [],
  }

  componentDidMount() {
    this.loadTelemetry();
  }

  private handleOpenTelemetrySideBar = (row: ITelemetryListItem) => {           
    this.setState({ openTelemetrySideBar: true, selectedTelemetryId: row.id, selectedRowId: row.id });      
  };  

  private handleSidebarClose = () => {
    this.setState({ openTelemetrySideBar: false });       
  };

  private toggleCourseRelatedExpanded = () => {
    this.setState({ courseRelatedExpanded: !this.state.courseRelatedExpanded });
  };

  private toggleGeneralExpanded = () => {
    this.setState({ generalExpanded: !this.state.generalExpanded });
  };

  private handleIPLocationLookup = async (ip: string) => {
    if (!ip || this.state.ipLocations[ip] || this.state.loadingLocations[ip]) {
      return;
    }

    this.setState({ 
      loadingLocations: { ...this.state.loadingLocations, [ip]: true }
    });

    try {
      const result: IIPLocationResponse = await LocationService.getIPLocation(ip);
      
      this.setState({ 
        ipLocations: { 
          ...this.state.ipLocations, 
          [ip]: result 
        },
        loadingLocations: { ...this.state.loadingLocations, [ip]: false }
      });
    } catch (error) {
      console.error('Failed to lookup IP location:', error);
      this.setState({ 
        loadingLocations: { ...this.state.loadingLocations, [ip]: false }
      });
    }
  };

  private handleCourseRelatedHeaderRadio = () => {
    const withCourseId = this.state.data.filter(row => row.courseId);
    const allSelected = withCourseId.length > 0 && withCourseId.every(item => this.state.selectedCourseRelatedItems.includes(item.id));
    
    if (allSelected) {
      // If all are selected, unselect all
      this.setState({ selectedCourseRelatedItems: [] });
    } else {
      // If not all are selected, select all
      this.setState({ selectedCourseRelatedItems: withCourseId.map(item => item.id) });
    }
  };

  private handleGeneralHeaderRadio = () => {
    const withoutCourseId = this.state.data.filter(row => !row.courseId);
    const allSelected = withoutCourseId.length > 0 && withoutCourseId.every(item => this.state.selectedGeneralItems.includes(item.id));
    
    if (allSelected) {
      // If all are selected, unselect all
      this.setState({ selectedGeneralItems: [] });
    } else {
      // If not all are selected, select all
      this.setState({ selectedGeneralItems: withoutCourseId.map(item => item.id) });
    }
  };

  private handleCourseRelatedItemRadio = (itemId: string) => {
    const isSelected = this.state.selectedCourseRelatedItems.includes(itemId);
    
    if (isSelected) {
      this.setState({ 
        selectedCourseRelatedItems: this.state.selectedCourseRelatedItems.filter(id => id !== itemId)
      });
    } else {
      this.setState({ 
        selectedCourseRelatedItems: [...this.state.selectedCourseRelatedItems, itemId]
      });
    }
  };

  private handleGeneralItemRadio = (itemId: string) => {
    const isSelected = this.state.selectedGeneralItems.includes(itemId);
    
    if (isSelected) {
      this.setState({ 
        selectedGeneralItems: this.state.selectedGeneralItems.filter(id => id !== itemId)
      });
    } else {
      this.setState({ 
        selectedGeneralItems: [...this.state.selectedGeneralItems, itemId]
      });
    }
  };

  private handleIPAddressChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedIPAddresses: typeof value === 'string' ? value.split(',') : value });
  };

  private handleCourseRelatedIPChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedCourseRelatedIPs: typeof value === 'string' ? value.split(',') : value });
  };

  private handleGeneralIPChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedGeneralIPs: typeof value === 'string' ? value.split(',') : value });
  };

  private getCourseRelatedIPAddresses = () => {
    const ipAddresses = this.state.data
      .filter(row => row.courseId)
      .map(item => item.ipAddress)
      .filter(ip => ip && ip.trim() !== '')
      .filter((ip, index, self) => self.indexOf(ip) === index)
      .sort();
    return ipAddresses;
  };

  private getGeneralIPAddresses = () => {
    const ipAddresses = this.state.data
      .filter(row => !row.courseId)
      .map(item => item.ipAddress)
      .filter(ip => ip && ip.trim() !== '')
      .filter((ip, index, self) => self.indexOf(ip) === index)
      .sort();
    return ipAddresses;
  };

  private handleCourseChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedCourses: typeof value === 'string' ? value.split(',') : value });
  };

  private handleControllerChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedControllers: typeof value === 'string' ? value.split(',') : value });
  };

  private handleStateChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedStates: typeof value === 'string' ? value.split(',') : value });
  };

  private handleReferrerChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedReferrers: typeof value === 'string' ? value.split(',') : value });
  };

  private getCourseNames = () => {
    const courses = this.state.data
      .filter(row => row.courseId)
      .map(item => item.name)
      .filter(name => name && name.trim() !== '')
      .filter((name, index, self) => self.indexOf(name) === index)
      .sort();
    return courses;
  };

  private getControllerNames = () => {
    const controllers = this.state.data
      .filter(row => row.courseId)
      .map(item => item.controller)
      .filter(controller => controller && controller.trim() !== '')
      .filter((controller, index, self) => self.indexOf(controller) === index)
      .sort();
    return controllers;
  };

  private getStateNames = () => {
    const states = this.state.data
      .filter(row => row.courseId)
      .map(item => item.state)
      .filter(state => state && state.trim() !== '')
      .filter((state, index, self) => self.indexOf(state) === index)
      .sort();
    return states;
  };

  private getReferrerNames = () => {
    const referrers = this.state.data
      .filter(row => row.courseId)
      .map(item => item.referer)
      .filter(ref => ref && ref.trim() !== '' && !ref.includes('https://www.golfcourseproject.com/'))
      .filter((ref, index, self) => self.indexOf(ref) === index)
      .sort();
    return referrers;
  };

  private handleGeneralControllerChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedGeneralControllers: typeof value === 'string' ? value.split(',') : value });
  };

  private handleGeneralReferrerChange = (event: any) => {
    const value = event.target.value;
    this.setState({ selectedGeneralReferrers: typeof value === 'string' ? value.split(',') : value });
  };

  private getGeneralControllerNames = () => {
    const controllers = this.state.data
      .filter(row => !row.courseId)
      .map(item => item.controller)
      .filter(controller => controller && controller.trim() !== '')
      .filter((controller, index, self) => self.indexOf(controller) === index)
      .sort();
    return controllers;
  };

  private getGeneralReferrerNames = () => {
    const referrers = this.state.data
      .filter(row => !row.courseId)
      .map(item => item.referer)
      .filter(ref => ref && ref.trim() !== '' && !ref.includes('https://www.golfcourseproject.com/'))
      .filter((ref, index, self) => self.indexOf(ref) === index)
      .sort();
    return referrers;
  };

  private renderLocationTooltip = (ip: string) => {
    const location = this.state.ipLocations[ip];
    if (!location) return '';
    
    if (!location.success) {
      return location.error || 'Location lookup failed';
    }
    
    const data = location.data;
    return `${data.city}, ${data.region}, ${data.country}\nISP: ${data.isp}\nTimezone: ${data.timezone}`;
  };

  private loadTelemetry = () => {
    this.setState({ action: 'loading', errorMsg: '' });

    const client: TelemetryService = new TelemetryService();  
    
    // Load telemetry for the last 30 days by default
    client.listByDays(30).then(async (response: ITelemetryListApiResponse) => {        
      console.log('Telemetry list response:', response);

      // Check if we got a valid array (even if empty)
      const telemetryItems = response.value || [];
      const isValidResponse = Array.isArray(telemetryItems);

      if (isValidResponse) {
        this.setState({
          data: telemetryItems,
          count: telemetryItems.length,
          selectedRowId: '',     
          errorMsg: '',
          action: telemetryItems.length === 0 ? 'empty' : 'normal'         
        });
      } else {
        // Invalid response structure
        this.setState({ 
          errorMsg: response.message || 'Invalid response from server', 
          action: 'error', 
          selectedRowId: '',
          data: []
        });
      }
    }).catch((error: Error) => {      
      console.error('Telemetry list error:', error);
      this.setState({ errorMsg: error.message, action: 'error', data: []});           
    });
  }

  render() {
    return (
      <Box>   

        <Box display={this.state.action === 'error' ? 'block' : 'none'}>
          <ErrorMessage message={this.state.errorMsg}></ErrorMessage>               
        </Box>
        
        <Box display="flex" justifyContent="center" alignItems="center" sx={this.state.action === 'empty' ? { display: 'flex', minHeight: '400px' } : { display: 'none' }}>
          <Box maxWidth="lg" textAlign="center">
            <Box
              height={'100%'}
              width={'100%'}
              maxWidth={{ xs: 500, md: '100%' }}
              margin="0 auto"
            >
              <NotFoundIllustration width={'100%'} height={'100%'} />
            </Box>
            <Box marginTop={4}>
              <Typography
                variant="h3"
                component={'h1'}
                align={'center'}
                sx={{ fontWeight: 700 }}
              >
                No Telemetry Data Found
              </Typography>
              <Typography
                variant="h6"
                component={'p'}
                color="textSecondary"
                align={'center'}
                sx={{ marginTop: 2 }}
              >
                There is no telemetry data available for the last 30 days.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={this.state.action === 'normal' ? { display: 'block' } : { display: 'none' }}>
          {(() => {
            let withCourseId = this.state.data.filter(row => row.courseId);
            let withoutCourseId = this.state.data.filter(row => !row.courseId);
            
            // Apply separate IP filters
            if (this.state.selectedCourseRelatedIPs.length > 0) {
              withCourseId = withCourseId.filter(item => 
                item.ipAddress && this.state.selectedCourseRelatedIPs.includes(item.ipAddress)
              );
            }
            
            // Apply course filter
            if (this.state.selectedCourses.length > 0) {
              withCourseId = withCourseId.filter(item => 
                item.name && this.state.selectedCourses.includes(item.name)
              );
            }
            
            // Apply controller filter
            if (this.state.selectedControllers.length > 0) {
              withCourseId = withCourseId.filter(item => 
                item.controller && this.state.selectedControllers.includes(item.controller)
              );
            }
            
            // Apply state filter
            if (this.state.selectedStates.length > 0) {
              withCourseId = withCourseId.filter(item => 
                item.state && this.state.selectedStates.includes(item.state)
              );
            }
            
            // Apply referrer filter
            if (this.state.selectedReferrers.length > 0) {
              withCourseId = withCourseId.filter(item => 
                item.referer && this.state.selectedReferrers.includes(item.referer)
              );
            }
            
            if (this.state.selectedGeneralIPs.length > 0) {
              withoutCourseId = withoutCourseId.filter(item => 
                item.ipAddress && this.state.selectedGeneralIPs.includes(item.ipAddress)
              );
            }
            
            // Apply general controller filter
            if (this.state.selectedGeneralControllers.length > 0) {
              withoutCourseId = withoutCourseId.filter(item => 
                item.controller && this.state.selectedGeneralControllers.includes(item.controller)
              );
            }
            
            // Apply general referrer filter
            if (this.state.selectedGeneralReferrers.length > 0) {
              withoutCourseId = withoutCourseId.filter(item => 
                item.referer && this.state.selectedGeneralReferrers.includes(item.referer)
              );
            }
            
            return (
              <>
                {/* First List - Items with Course ID */}
                {withCourseId.length > 0 && (
                  <>
                    <Box marginBottom={2} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <GolfCourseIcon sx={{ marginRight: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                          Course related data
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={this.toggleCourseRelatedExpanded}
                        sx={{ marginLeft: 1 }}
                      >
                        {this.state.courseRelatedExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    <Box marginBottom={4} sx={{ display: this.state.courseRelatedExpanded ? 'flex' : 'none' }}>            
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 520 }} aria-label="course telemetry table">
                          <TableHead>
                            <TableRow>   
                              <TableCell align="center" sx={{ width: '5%' }}>
                                <Checkbox 
                                  size="small"
                                  checked={withCourseId.length > 0 && withCourseId.every(item => this.state.selectedCourseRelatedItems.includes(item.id))}
                                  onChange={this.handleCourseRelatedHeaderRadio}
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ width: '3%' }}></TableCell>
                              <TableCell align="left" sx={{ width: '22%' }}>
                                <FormControl size="small" sx={{ width: '100%' }}>
                                  <Select
                                    multiple
                                    value={this.state.selectedCourses}
                                    onChange={this.handleCourseChange}
                                    displayEmpty
                                    renderValue={(selected: any) => {
                                      if (selected.length === 0) {
                                        return <span style={{ fontSize: '0.9em', color: '#666' }}>Course</span>;
                                      }
                                      return (
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.slice(0, 1).map((value: string) => (
                                            <Chip key={value} label={value.length > 15 ? value.substring(0, 15) + '...' : value} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          ))}
                                          {selected.length > 1 && (
                                            <Chip label={`+${selected.length - 1}`} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          )}
                                        </MuiBox>
                                      );
                                    }}
                                    sx={{ fontSize: '0.9em' }}
                                  >
                                    {this.getCourseNames().map((course) => (
                                      <MenuItem key={course} value={course} style={{ fontSize: '1em' }}>
                                        <Checkbox checked={this.state.selectedCourses.indexOf(course) > -1} size="small" />
                                        {course}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>        
                              <TableCell align="left" sx={{ width: '19%' }}>
                                <FormControl size="small" sx={{ width: '100%' }}>
                                  <Select
                                    multiple
                                    value={this.state.selectedControllers}
                                    onChange={this.handleControllerChange}
                                    displayEmpty
                                    renderValue={(selected: any) => {
                                      if (selected.length === 0) {
                                        return <span style={{ fontSize: '0.9em', color: '#666' }}>Controller</span>;
                                      }
                                      return (
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.slice(0, 1).map((value: string) => (
                                            <Chip key={value} label={value.length > 15 ? value.substring(0, 15) + '...' : value} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          ))}
                                          {selected.length > 1 && (
                                            <Chip label={`+${selected.length - 1}`} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          )}
                                        </MuiBox>
                                      );
                                    }}
                                    sx={{ fontSize: '0.9em' }}
                                  >
                                    {this.getControllerNames().map((controller) => (
                                      <MenuItem key={controller} value={controller} style={{ fontSize: '1em' }}>
                                        <Checkbox checked={this.state.selectedControllers.indexOf(controller) > -1} size="small" />
                                        {controller}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>   
                              <TableCell align="center" sx={{ width: '9%' }}>
                                <FormControl size="small" sx={{ width: '100%' }}>
                                  <Select
                                    multiple
                                    value={this.state.selectedStates}
                                    onChange={this.handleStateChange}
                                    displayEmpty
                                    renderValue={(selected: any) => {
                                      if (selected.length === 0) {
                                        return <span style={{ fontSize: '0.9em', color: '#666' }}>State</span>;
                                      }
                                      return (
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.slice(0, 1).map((value: string) => (
                                            <Chip key={value} label={value} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          ))}
                                          {selected.length > 1 && (
                                            <Chip label={`+${selected.length - 1}`} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          )}
                                        </MuiBox>
                                      );
                                    }}
                                    sx={{ fontSize: '0.9em' }}
                                  >
                                    {this.getStateNames().map((state) => (
                                      <MenuItem key={state} value={state} style={{ fontSize: '1em' }}>
                                        <Checkbox checked={this.state.selectedStates.indexOf(state) > -1} size="small" />
                                        {state}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>   
                              <TableCell align="left" sx={{ width: '12%' }}>
                                <FormControl size="small" sx={{ width: '100%' }}>
                                  <Select
                                    multiple
                                    value={this.state.selectedCourseRelatedIPs}
                                    onChange={this.handleCourseRelatedIPChange}
                                    displayEmpty
                                    renderValue={(selected: any) => {
                                      if (selected.length === 0) {
                                        return <span style={{ fontSize: '0.9em', color: '#666' }}>IP</span>;
                                      }
                                      return (
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.slice(0, 1).map((value: string) => (
                                            <Chip key={value} label={value} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          ))}
                                          {selected.length > 1 && (
                                            <Chip label={`+${selected.length - 1}`} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          )}
                                        </MuiBox>
                                      );
                                    }}
                                    sx={{ fontSize: '0.9em' }}
                                  >
                                    {this.getCourseRelatedIPAddresses().map((ip) => (
                                      <MenuItem key={ip} value={ip} style={{ fontSize: '1em' }}>
                                        <Checkbox checked={this.state.selectedCourseRelatedIPs.indexOf(ip) > -1} size="small" />
                                        {ip}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>   
                              <TableCell align="left" sx={{ width: '18%' }}>
                                <FormControl size="small" sx={{ width: '100%' }}>
                                  <Select
                                    multiple
                                    value={this.state.selectedReferrers}
                                    onChange={this.handleReferrerChange}
                                    displayEmpty
                                    renderValue={(selected: any) => {
                                      if (selected.length === 0) {
                                        return <span style={{ fontSize: '0.9em', color: '#666' }}>Referer</span>;
                                      }
                                      return (
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.slice(0, 1).map((value: string) => (
                                            <Chip key={value} label={value.length > 18 ? value.substring(0, 18) + '...' : value} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          ))}
                                          {selected.length > 1 && (
                                            <Chip label={`+${selected.length - 1}`} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          )}
                                        </MuiBox>
                                      );
                                    }}
                                    sx={{ fontSize: '0.9em' }}
                                  >
                                    {this.getReferrerNames().map((referrer) => (
                                      <MenuItem key={referrer} value={referrer} style={{ fontSize: '1em' }}>
                                        <Checkbox checked={this.state.selectedReferrers.indexOf(referrer) > -1} size="small" />
                                        {referrer.length > 30 ? referrer.substring(0, 30) + '...' : referrer}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>   
                              <TableCell align="center" sx={{ width: '13%' }}>Date Created</TableCell>                                                                                         
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {withCourseId.map((row) => (                    
                              <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                                hover                                  
                              >     
                                <TableCell align="center" sx={{ width: '5%' }}>
                                  <Checkbox 
                                    size="small"
                                    checked={this.state.selectedCourseRelatedItems.includes(row.id)}
                                    onChange={() => this.handleCourseRelatedItemRadio(row.id)}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ width: '3%' }}>
                                  {row.isFlagged && (
                                    <FlagIcon fontSize="small" sx={{ color: 'red' }} />
                                  )}
                                </TableCell>                        

                                <TableCell 
                                  align="left" 
                                  sx={{ 
                                    width: '22%'
                                  }}
                                >
                                  <Link component="button" onClick={() => this.handleOpenTelemetrySideBar(row)} sx={{ textAlign: 'left' }}>
                                    {row.name || '-'}
                                  </Link>
                                </TableCell>  

                                <TableCell align="left" sx={{ width: '19%' }}>{row.controller || '-'}</TableCell>

                                <TableCell align="center" sx={{ width: '9%' }}>{row.state || '-'}</TableCell>

                                <TableCell align="left" sx={{ width: '12%' }}>
                                  <Box display="flex" alignItems="center">
                                    <span>{row.ipAddress || '-'}</span>
                                    {row.ipAddress && (
                                      <Tooltip title={this.renderLocationTooltip(row.ipAddress) || 'Click to lookup location'}>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => this.handleIPLocationLookup(row.ipAddress)}
                                          disabled={this.state.loadingLocations[row.ipAddress]}
                                          sx={{ marginLeft: 0.5 }}
                                        >
                                          {this.state.ipLocations[row.ipAddress] && this.state.ipLocations[row.ipAddress].success ? (
                                            <LocationOnIcon fontSize="small" sx={{ color: 'green' }} />
                                          ) : (
                                            <NotListedLocationIcon fontSize="small" />
                                          )}
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </TableCell>

                                <TableCell align="left" sx={{ width: '18%' }}>
                                  {row.referer && !row.referer.includes('https://www.golfcourseproject.com/') ? (
                                    <span style={{ fontSize: '0.85em', wordBreak: 'break-all' }}>
                                      {row.referer.length > 15 ? row.referer.substring(0, 15) + '...' : row.referer}
                                    </span>
                                  ) : ''}
                                </TableCell>

                                <TableCell align="center" sx={{ width: '13%' }}>
                                  {row.dateCreated ? new Date(row.dateCreated).toLocaleDateString() : '-'}
                                </TableCell>                                                                               
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </>
                )}

                {/* Spacer between tables */}
                {withCourseId.length > 0 && withoutCourseId.length > 0 && (
                  <Box sx={{ marginBottom: '20px' }} />
                )}

                {/* Second List - Items without Course ID */}
                {withoutCourseId.length > 0 && (
                  <>
                    <Box marginTop={withCourseId.length > 0 ? '50px' : 0} marginBottom={2} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <ArticleIcon sx={{ marginRight: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                          General Telemetry Data
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={this.toggleGeneralExpanded}
                        sx={{ marginLeft: 1 }}
                      >
                        {this.state.generalExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    <Box marginBottom={4} sx={{ display: this.state.generalExpanded ? 'flex' : 'none' }}>            
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 520 }} aria-label="general telemetry table">
                          <TableHead>
                            <TableRow>   
                              <TableCell align="center" sx={{ width: '8%' }}>
                                <Checkbox 
                                  size="small"
                                  checked={withoutCourseId.length > 0 && withoutCourseId.every(item => this.state.selectedGeneralItems.includes(item.id))}
                                  onChange={this.handleGeneralHeaderRadio}
                                />
                              </TableCell>
                              <TableCell align="left" sx={{ width: '39%' }}>
                                <FormControl size="small" sx={{ width: '100%' }}>
                                  <Select
                                    multiple
                                    value={this.state.selectedGeneralControllers}
                                    onChange={this.handleGeneralControllerChange}
                                    displayEmpty
                                    renderValue={(selected: any) => {
                                      if (selected.length === 0) {
                                        return <span style={{ fontSize: '0.9em', color: '#666' }}>Controller</span>;
                                      }
                                      return (
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.slice(0, 1).map((value: string) => (
                                            <Chip key={value} label={value.length > 20 ? value.substring(0, 20) + '...' : value} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          ))}
                                          {selected.length > 1 && (
                                            <Chip label={`+${selected.length - 1}`} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          )}
                                        </MuiBox>
                                      );
                                    }}
                                    sx={{ fontSize: '0.9em' }}
                                  >
                                    {this.getGeneralControllerNames().map((controller) => (
                                      <MenuItem key={controller} value={controller} style={{ fontSize: '1em' }}>
                                        <Checkbox checked={this.state.selectedGeneralControllers.indexOf(controller) > -1} size="small" />
                                        {controller}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>   
                              <TableCell align="left" sx={{ width: '22%' }}>
                                <FormControl size="small" sx={{ width: '100%' }}>
                                  <Select
                                    multiple
                                    value={this.state.selectedGeneralIPs}
                                    onChange={this.handleGeneralIPChange}
                                    displayEmpty
                                    renderValue={(selected: any) => {
                                      if (selected.length === 0) {
                                        return <span style={{ fontSize: '0.9em', color: '#666' }}>IP</span>;
                                      }
                                      return (
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.slice(0, 1).map((value: string) => (
                                            <Chip key={value} label={value} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          ))}
                                          {selected.length > 1 && (
                                            <Chip label={`+${selected.length - 1}`} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          )}
                                        </MuiBox>
                                      );
                                    }}
                                    sx={{ fontSize: '0.9em' }}
                                  >
                                    {this.getGeneralIPAddresses().map((ip) => (
                                      <MenuItem key={ip} value={ip} style={{ fontSize: '1em' }}>
                                        <Checkbox checked={this.state.selectedGeneralIPs.indexOf(ip) > -1} size="small" />
                                        {ip}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>   
                              <TableCell align="left" sx={{ width: '17%' }}>
                                <FormControl size="small" sx={{ width: '100%' }}>
                                  <Select
                                    multiple
                                    value={this.state.selectedGeneralReferrers}
                                    onChange={this.handleGeneralReferrerChange}
                                    displayEmpty
                                    renderValue={(selected: any) => {
                                      if (selected.length === 0) {
                                        return <span style={{ fontSize: '0.9em', color: '#666' }}>Referer</span>;
                                      }
                                      return (
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.slice(0, 1).map((value: string) => (
                                            <Chip key={value} label={value.length > 14 ? value.substring(0, 14) + '...' : value} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          ))}
                                          {selected.length > 1 && (
                                            <Chip label={`+${selected.length - 1}`} size="small" style={{ fontSize: '0.8em', height: '22px' }} />
                                          )}
                                        </MuiBox>
                                      );
                                    }}
                                    sx={{ fontSize: '0.9em' }}
                                  >
                                    {this.getGeneralReferrerNames().map((referrer) => (
                                      <MenuItem key={referrer} value={referrer} style={{ fontSize: '1em' }}>
                                        <Checkbox checked={this.state.selectedGeneralReferrers.indexOf(referrer) > -1} size="small" />
                                        {referrer.length > 30 ? referrer.substring(0, 30) + '...' : referrer}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>   
                              <TableCell align="center" sx={{ width: '14%' }}>Date Created</TableCell>                                                                                         
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {withoutCourseId.map((row) => (                    
                              <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                                hover                                  
                              >     
                                <TableCell align="center" sx={{ width: '8%' }}>
                                  <Checkbox 
                                    size="small"
                                    checked={this.state.selectedGeneralItems.includes(row.id)}
                                    onChange={() => this.handleGeneralItemRadio(row.id)}
                                  />
                                </TableCell>                    

                                <TableCell 
                                  align="left" 
                                  sx={{ 
                                    width: '42%'
                                  }}
                                >
                                  <Link component="button" onClick={() => this.handleOpenTelemetrySideBar(row)} sx={{ textAlign: 'left' }}>
                                    {row.controller || '-'}
                                  </Link>
                                </TableCell>                        

                                <TableCell align="left" sx={{ width: '22%' }}>
                                  <Box display="flex" alignItems="center">
                                    <span>{row.ipAddress || '-'}</span>
                                    {row.ipAddress && (
                                      <Tooltip title={this.renderLocationTooltip(row.ipAddress) || 'Click to lookup location'}>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => this.handleIPLocationLookup(row.ipAddress)}
                                          disabled={this.state.loadingLocations[row.ipAddress]}
                                          sx={{ marginLeft: 0.5 }}
                                        >
                                          {this.state.ipLocations[row.ipAddress] && this.state.ipLocations[row.ipAddress].success ? (
                                            <LocationOnIcon fontSize="small" sx={{ color: 'green' }} />
                                          ) : (
                                            <NotListedLocationIcon fontSize="small" />
                                          )}
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </TableCell>

                                <TableCell align="left" sx={{ width: '14%' }}>
                                  {row.referer && !row.referer.includes('https://www.golfcourseproject.com/') ? (
                                    <span style={{ fontSize: '0.85em', wordBreak: 'break-all' }}>
                                      {row.referer.length > 20 ? row.referer.substring(0, 20) + '...' : row.referer}
                                    </span>
                                  ) : ''}
                                </TableCell>

                                <TableCell align="center" sx={{ width: '14%' }}>
                                  {row.dateCreated ? new Date(row.dateCreated).toLocaleDateString() : '-'}
                                </TableCell>                                                                               
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </>
                )}
              </>
            );
          })()}          
        </Box>

        <Box display={this.state.action === 'loading' ? 'block' : 'none'}>  
          {/* Skeleton Header for Course-Related Telemetry */}
          <Box marginBottom={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Box sx={{ width: 600 }}>
                <Skeleton animation="wave" height={32} />
              </Box>
            </Box>
            <Box sx={{ width: 24, height: 24 }}>
              <Skeleton animation="wave" variant="rectangular" width={24} height={24} />
            </Box>
          </Box>
          
          <SkeletonTable rows={10} columns={7} display={this.state.action === 'loading' ? true : false} columnWidths={['5%', '22%', '19%', '9%', '12%', '18%', '13%']} minWidth={520}></SkeletonTable>
          
          <Box sx={{ marginTop: '50px' }}>
            {/* Skeleton Header for General Telemetry */}
            <Box marginBottom={2} display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 600 }}>
                  <Skeleton animation="wave" height={32} />
                </Box>
              </Box>
              <Box sx={{ width: 24, height: 24 }}>
                <Skeleton animation="wave" variant="rectangular" width={24} height={24} />
              </Box>
            </Box>
            
            <SkeletonTable rows={10} columns={5} display={this.state.action === 'loading' ? true : false} columnWidths={['8%', '39%', '22%', '17%', '14%']} minWidth={520}></SkeletonTable>
          </Box>                 
        </Box>    

        <ViewTelemetry
          theme={this.props.theme}
          open={this.state.openTelemetrySideBar}
          id={this.state.selectedTelemetryId}
          onClose={this.handleSidebarClose}
        >
        </ViewTelemetry>   
      </Box>
    );
  }
}

export default ListTelemetry;

interface IProps {
  callback: () => void;
  theme: Theme;
}

interface IForm {
  action: string,
  errorMsg: string;  
  data: ITelemetryListItem[]; 
  count: number;
  selectedRowId: string;  
  openTelemetrySideBar: boolean; 
  selectedTelemetryId: string | null;
  courseRelatedExpanded: boolean;
  generalExpanded: boolean;
  ipLocations: { [key: string]: any };
  loadingLocations: { [key: string]: boolean };
  selectedCourseRelatedItems: string[];
  selectedGeneralItems: string[];
  selectedCourseRelatedIPs: string[];
  selectedGeneralIPs: string[];
  selectedCourses: string[];
  selectedControllers: string[];
  selectedStates: string[];
  selectedReferrers: string[];
  selectedGeneralControllers: string[];
  selectedGeneralReferrers: string[];
}
