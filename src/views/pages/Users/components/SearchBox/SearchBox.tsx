/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Container from 'common/Container';
import { IListUsersRequest } from 'interfaces/user.admin.interfaces';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';

class SearchBox extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: ISearchBox = {
    action: 'normal',
    errorMsg: '',
    searchText: '',
    searchType: 'active',
  }

  componentDidMount() {

  }

  private buildSearchText = (searchText: string, type: string): IListUsersRequest => {   
    let len: number = searchText.length;
    let ind: number;
    let key, val: string;

    let split = searchText.split(',');
    if (split.length < 1) split.push(searchText);

    let body: IListUsersRequest = new ListUsersRequest();

    split.forEach((i) => {
      ind = i.indexOf(':');
      key = i.slice(0, ind).trim();
      val = i.slice(ind + 1, len).trim();

      body.name = key.includes('name') ? val : body.name;
      body.email = key.includes('email') ? val : body.email;
      body.role = key.includes('role') ? val : body.role;
      body.status = key.includes('status') ? parseInt(val) : body.status;
    });

    body.isDeleted = type === 'deleted' ? true : false; 

    return body;
  }

  private handleSearchTypeChange = (e: React.MouseEvent<HTMLElement>, x: string) => {
    e.preventDefault();

    this.setState({ searchType: x });      
    const body: IListUsersRequest = this.buildSearchText(this.state.searchText.toLowerCase(), x);
  
    this.props.callback(body);
  }

  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<ISearchBox, keyof ISearchBox>);
  };

  private handleSearchButtonClick = (e: React.ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();
   
    const body: IListUsersRequest = this.buildSearchText(this.state.searchText.toLowerCase(), this.state.searchType.toLowerCase());
    console.log(body);

    this.props.callback(body);
  }

  render() {
    
    return (
      <Container maxWidth={'75%'}>
        <Box
          component={Card}
          maxWidth={{ xs: '100%', md: '100%' }}
          boxShadow={4}
        >
          <CardContent>
            <Box
              component={'form'}
              noValidate
              autoComplete="off"
              sx={{ '& .MuiInputBase-input.MuiOutlinedInput-input': { bgcolor: 'background.paper', }, }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                  <Box
                    component={TextField}
                    label="search text"
                    variant="outlined"
                    color="primary"
                    name={'searchText'}
                    fullWidth
                    height={54}
                    value={this.state.searchText}
                    onChange={(e: any) => this.handleInputChanges(e)}
                  />                  
                </Grid>
                <Grid item xs={12} md={2}>
                  <ToggleButtonGroup
                    color="primary"
                    exclusive   
                    size="large"                   
                    value={this.state.searchType}  
                    sx={{ maxHeight: 56 }}                      
                  >
                    <ToggleButton value="active" onClick={(e: any) => this.handleSearchTypeChange(e, 'active')}>Active</ToggleButton>
                    <ToggleButton value="deleted" onClick={(e: any) => this.handleSearchTypeChange(e, 'deleted')}>Deleted</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={1}>
                  <Box
                    component={Button}
                    variant="contained"
                    color="primary"
                    size="large"
                    height={54}
                    fullWidth
                    onClick={(e: any) => this.handleSearchButtonClick(e)}
                  >
                    Search
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Box>
      </Container>
    );
  }
}

export default SearchBox;

interface IProps {
  callback: (body: IListUsersRequest) => void;
  theme: Theme;
}

interface ISearchBox {
  action: string,
  errorMsg: string;
  searchText: string;
  searchType: string;
}

class ListUsersRequest implements IListUsersRequest {
  constructor() {
    this.name = null;
    this.email = null;
    this.role = null;
    this.status = -1;
    this.isDeleted = false;
  }

  name: string | null;
  email: string | null;
  role: string | null;
  status: number;
  isDeleted: boolean;
}