/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

import NotFoundIllustration from 'svg/illustrations/NotFound';
import ViewTelemetry from '../ViewTelemetry';

import { SkeletonTable } from 'common/components';

import { ITelemetryListItem, ITelemetryListApiResponse } from 'interfaces/telemetry.interfaces';
import TelemetryService from 'services/telemetry.service';
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
          <Box marginBottom={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              📊 Telemetry Data
            </Typography>
          </Box>
          <Box marginBottom={4} sx={{ display: 'flex' }}>            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 520 }} aria-label="telemetry table">
                <TableHead>
                  <TableRow>   
                    <TableCell align="center" sx={{ width: '5%' }}>View</TableCell>  
                    <TableCell align="left" sx={{ width: '15%' }}>Course</TableCell>        
                    <TableCell align="left" sx={{ width: '15%' }}>Title</TableCell>   
                    <TableCell align="center" sx={{ width: '8%' }}>State</TableCell>   
                    <TableCell align="left" sx={{ width: '12%' }}>IP</TableCell>   
                    <TableCell align="left" sx={{ width: '15%' }}>Referer</TableCell>   
                    <TableCell align="left" sx={{ width: '15%' }}>Agent</TableCell>   
                    <TableCell align="center" sx={{ width: '15%' }}>Date Created</TableCell>                                                                                         
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.map((row) => (                    
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                      hover                                  
                    >                         
                      <TableCell align="center" sx={{ width: '5%' }}>
                        <IconButton 
                          size="small" 
                          onClick={(e:any) => this.handleOpenTelemetrySideBar(row)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>                        

                      <TableCell align="left" sx={{ width: '15%' }}>{row.name || '-'}</TableCell>  

                      <TableCell align="left" sx={{ width: '15%' }}>{row.title || '-'}</TableCell>

                      <TableCell align="center" sx={{ width: '8%' }}>{row.state || '-'}</TableCell>

                      <TableCell align="left" sx={{ width: '12%' }}>{row.ipAddress || '-'}</TableCell>

                      <TableCell align="left" sx={{ width: '15%' }}>
                        {row.referer ? (
                          <span style={{ fontSize: '0.85em', wordBreak: 'break-all' }}>
                            {row.referer.length > 30 ? row.referer.substring(0, 30) + '...' : row.referer}
                          </span>
                        ) : '-'}
                      </TableCell>

                      <TableCell align="left" sx={{ width: '15%' }}>
                        {row.userAgent ? (
                          <span style={{ fontSize: '0.85em' }}>
                            {row.userAgent.length > 30 ? row.userAgent.substring(0, 30) + '...' : row.userAgent}
                          </span>
                        ) : '-'}
                      </TableCell>

                      <TableCell align="center" sx={{ width: '15%' }}>
                        {row.dateCreated ? new Date(row.dateCreated).toLocaleDateString() : '-'}
                      </TableCell>                                                                               
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>          
        </Box>

        <Box display={this.state.action === 'loading' ? 'block' : 'none'}>  
          <SkeletonTable rows={10} columns={8} display={this.state.action === 'loading' ? true : false} columnWidths={['5%', '15%', '15%', '8%', '12%', '15%', '15%', '15%']} minWidth={520}></SkeletonTable>                 
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
}
