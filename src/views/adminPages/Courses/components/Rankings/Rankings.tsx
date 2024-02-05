/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Divider, IconButton, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Skeleton, Link, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircle';
import { green, grey } from '@material-ui/core/colors';

import RankingService from 'services/ranking.service';
import { IListRankingsApiResponse, IPostRankingApiResponse, IRanking, IRankingPost } from 'interfaces/rankings.interfaces';
import { RefValueData } from 'data/refvalue.data';
import ErrorMessage from 'common/components/ErrorMessage';
import { IStandardApiResponse } from 'interfaces/api-response.interface';

class Rankings extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {}; 

  state: IForm = {
    action: 'loading',   
    messageCode: 200,
    messageText: '',   
    blurErrors: [],  
    snackOpen: false,  
    data: [], 
    count: 0,  
    courseId: this.props.courseId,    
    facilityId: this.props.facilityId,
    source: '',
    sourceRefValueId: 100,
    name: '',
    nameRefValueId: 201,
    year: 2023,
    value: 0,
  }

  componentDidMount() {
    if (this.props.ready === true) this.fetch(this.props.courseId);
  }

  componentDidUpdate(prevProps: any) {

    if (prevProps.ready !== this.props.ready) {           
      this.setState({ action: 'loading' });   
      if (this.props.ready === true) this.fetch(this.props.courseId);
    }  
  }

  private fetch = (courseId: string) => {
    const client: RankingService = new RankingService();

    client.listByCourse(courseId).then(async (response: IListRankingsApiResponse) => {        

      // if we return a 300, then the course has no rankings
      if (response.messageCode === 300) {
        this.setState({
          data: null,          
          action: 'normal',         
          count: 0     
        });
        return;
      }

      if (response.success) {
        this.setState({
          data: response.value,          
          action: 'normal',        
          count: response.count,
        });
      }
    }).catch((error: Error) => {
      console.log(error);
    });
  }  

  private handleOpenCreateBoxOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ action: 'create' });
  }

  private handleSaveOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ action: 'normal' });

    let body: IRankingPost | null = {
      courseId: this.state.courseId,
      facilityId: this.state.facilityId,
      sourceRefValueId: this.state.sourceRefValueId ?? 0,
      nameRefValueId: this.state.nameRefValueId ?? 0,
      source: RefValueData.sources.find((source) => source.id === this.state.sourceRefValueId)?.text ?? '',
      name: RefValueData.names.find((name) => name.id === this.state.nameRefValueId)?.text ?? '',
      year: this.state.year,
      value: this.state.value,
    } as IRankingPost;    

    let client: RankingService | null = new RankingService();

    client.post(body).then(async (response: IPostRankingApiResponse) => {
      
      if (response.success) {        
        let data: IRanking[] | null = this.state.data;
        let count: number = this.state.count;        
        
        // if count is 0, then we need to fetch the data
        // if count is > 0, then we can just add the new ranking to the existing data without having to fetch it again
        if (count === 0) { this.fetch(this.props.courseId); } else { if (response.value) data?.push(response.value); }

        this.setState({ data: data, count: count + 1, action: 'normal', message: '', snackOpen: true, value: 1 }); 
      } 
      else {
        this.setState({ action: 'failed', message: this.setErrorMessage(response.messageCode, response.message) });
      }

    }).catch((error: Error) => {
      this.setState({ action: 'failed', message: error.message });
    });

    client = null;
  }

  private handleDeleteOnClick = (id: string) => {
    
    let client: RankingService | null = new RankingService();

    client.delete(id).then(async (response: IStandardApiResponse) => {      
      if (response.success) {                  
        const updatedData = this.state.data?.filter(item => item.id !== id);
               
        this.setState({ action: 'normal', message: '', data: updatedData }); 
      } 
      else {
        this.setState({ action: 'failed', message: this.setErrorMessage(response.messageCode, response.message) });
      }

    }).catch((error: Error) => {
      this.setState({ action: 'failed', message: error.message });
    });

    client = null;
  }

  private handleCancelRankingOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ action: 'normal' });
  }

  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();   
    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<IForm, keyof IForm>);
  };   

  private handleSelectChanges = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault();
    
    const target = e.target as HTMLSelectElement;    
    this.setState({ [target.name]: target.value } as unknown as Pick<IForm, keyof IForm>);   
    
    if (target.name === 'nameRefValueId' && target.value !== '202') {
      this.setState({ value: 1 });
    }
  };

  private handleSnackClose = () => {
    this.setState({ snackOpen: false });       
  };  

  private setErrorMessage = (messageCode: number, msg: string = '') => {
    switch (messageCode) {
      case 402:
        return 'Form values that were posted to the server are invalid.';
      case 407:
        return 'Empty post document.';
      case 600:
        return 'There was an error on the server: ' + msg;
      default:
        return msg;
    }
  }

  render() {

    return (   
      <Box>  
        <Snackbar open={this.state.snackOpen} autoHideDuration={1000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={(e: any) => this.handleSnackClose()}>
          <Alert severity="success" sx={{ minWidth: '300px' }}>
            Ranking record added
          </Alert>
        </Snackbar>       

        <Box display="flex" flexDirection={'column'} minHeight={'200px'} sx={{ p: 0, width: '100%' }}>         
          
          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'}>
            <Typography sx={{ mb: 1 }} variant="h6" component="div">
              ⛳ Media Course Rankings
            </Typography>
            <IconButton sx={{ mb: 1 }} disabled={this.state.action !== 'normal'} onClick={(e: any) => this.handleOpenCreateBoxOnClick(e)}>
              <AddIcon sx={this.state.action === 'normal' ? { color: green[500] } : { color: grey[500] }} />
            </IconButton>
          </Box>         

          <Divider />    

          <Box display={'box'} width={'100%'} sx={{ marginTop: '10px', width: '100%' }} flexDirection={'column'}>
            <ErrorMessage message={this.state.messageText} />
          </Box>      

          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'} sx={ this.state.action === 'normal' && this.state.count > 0 ? {display: 'flex'} : {display: 'none'}}>
            <List dense={true} sx={{ width: '100%' }}>
              {this.state.data && this.state.data.map((ranking: IRanking) => (
                <ListItem divider key={ranking.id} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={(e: any) => this.handleDeleteOnClick(ranking.id)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemAvatar>
                    <Avatar>
                      {ranking.value}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={ranking.name}
                    secondary={ranking.source + ', ' + ranking.year}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box display="block" width={'100%'} sx={this.state.action === 'create' ? { display: 'block', width: '100%' } : { display: 'none' }}>
            <Box display="block" flexDirection={'column'} sx={{ marginTop: '10px' }}>
              <form noValidate autoComplete="off">
                <Grid container spacing={2} style={{ width: '100%' }}>
                  <Grid item xs={12} md={12}>
                    <Select
                      labelId="source-label"
                      id="sourceRefValueId"
                      value={this.state.sourceRefValueId}
                      onChange={(e: any) => this.handleSelectChanges(e)}
                      label="source *"
                      name="sourceRefValueId"
                      fullWidth={true}
                    >                     
                      {RefValueData.sources.map((source) => (
                        <MenuItem key={source.id} value={source.id}>
                          {source.text}
                        </MenuItem>
                      ))}                    
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Select
                      labelId="name-label"
                      id="name"
                      value={this.state.nameRefValueId}
                      onChange={(e: any) => this.handleSelectChanges(e)}
                      label="Name *"
                      name="nameRefValueId"
                      fullWidth={true}
                    >
                      {RefValueData.names.map((name) => (
                        <MenuItem key={name.id} value={name.id}>
                          {name.text}
                        </MenuItem>
                      ))}      
                    </Select>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <FormControl fullWidth variant="outlined" size="small" color="primary">
                      <InputLabel id="year-label">Year *</InputLabel>
                      <Select
                        labelId="year-label"
                        id="year"
                        value={this.state.year}
                        onChange={(e: any) => this.handleSelectChanges(e)}
                        label="Year *"
                        name="year"
                      >
                        {RefValueData.years.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}                        
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      type="text"
                      label="Ranking *"
                      variant="outlined"
                      size="small"
                      color="primary"
                      fullWidth
                      name={'value'}
                      value={this.state.value}
                      onChange={(e: any) => this.handleInputChanges(e)}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} textAlign={'right'}>
                    <Button variant="contained" color="primary" size="small" onClick={(e: any) => this.handleSaveOnClick(e)}>Save</Button>&nbsp;
                    <Button variant="contained" size="small" onClick={(e: any) => this.handleCancelRankingOnClick(e)} sx={{background: this.props.theme.palette.grey[600]}}>Cancel</Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>  

          <Box display="flex" width={'100%'} sx={this.state.action === 'normal' && this.state.count === 0 ? { display: 'flex', width: '100%' } : { display: 'none' }}>
            <Typography
              variant="body1"
              align={'left'}
              sx={{ fontWeight: 500, marginTop: 2, marginBottom: 2 }}
            >
              No records found. <Link component="button" fontSize={16} onClick={(e: any) => this.handleOpenCreateBoxOnClick(e)}>Click here</Link> to add a new course ranking.                        
              
            </Typography>
          </Box>          

          <Box sx={ this.state.action === 'loading' ? {display: 'block', width: '100%' } : {display: 'none', width: '100%' }}>            
            <Skeleton animation="wave" width={'100%'} />  
            <Skeleton animation="wave" width={'100%'} /> 
            <Skeleton animation="wave" width={'100%'} />           
          </Box>

        </Box>          
      </Box>           
    );

  }
}

export default Rankings;

interface IProps {     
  theme: Theme;  
  facilityId: string;
  courseId: string;
  ready: boolean;
}

interface IForm {
  action: string, 
  messageText: string;
  messageCode: number;
  blurErrors: string[],
  snackOpen: boolean;
  data: IRanking[] | null,
  count: number;
  facilityId: string;
  courseId: string;  
  sourceRefValueId: number;
  source: string;
  nameRefValueId: number;
  name: string;
  year: number;
  value: number;
}

