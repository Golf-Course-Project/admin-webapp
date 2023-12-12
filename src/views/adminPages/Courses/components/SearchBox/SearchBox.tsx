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
import { MenuItem, Select} from '@material-ui/core';
import { ICourseSearch } from 'interfaces/course.interfaces';
import { CourseSearch } from 'common/classes/course.search';

class SearchBox extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: ISearchBox = {
    action: 'normal',
    errorMsg: '',
    searchText: '',
    searchState: 'MI',
  }

  componentDidMount() {

  } 

  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<ISearchBox, keyof ISearchBox>);
  };

  private handleStateChanges = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const target = e.target as HTMLSelectElement;
    this.setState({ [target.name]: target.value } as unknown as Pick<ISearchBox, keyof ISearchBox>); 
  };

  private handleSearchButtonClick = (e: React.ChangeEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const body: ICourseSearch = this.buildSearchText(this.state.searchText, this.state.searchState);  
    body.pageNumber = 1;

    this.props.callback(body);
  }

  private handleEnterKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      this.handleSearchButtonClick(e);
    }
  }

  private buildSearchText = (searchText: string, state: string): ICourseSearch => {   
    let len: number = searchText.length;
    let ind: number;
    let key: string, val: string;

    let split = searchText.split(',');
    if (split.length < 1) split.push(searchText);

    let body: ICourseSearch = new CourseSearch(state);

    split.forEach((i) => {
      ind = i.indexOf(':');
      key = i.slice(0, ind).trim();
      val = i.slice(ind + 1, len).trim();

      body.address = key.includes('address') ? this.setValue(val) : null;
      body.city = key.includes('city') ? this.setValue(val) : null;
      body.email = key.includes('email') ? this.setValue(val) : null;
      body.phone = key.includes('phone') ? this.setValue(val) : null;
      body.website = key.includes('website') ? this.setValue(val) : null;
      body.type = key.includes('type') ? this.setValue(val) : null;
    });   

    body.text = searchText.trim().toLocaleLowerCase();

    if (body.address !== null || body.city !== null || body.email !== null || body.phone !== null || body.website !== null || body.type !== null) {
      body.text = null;
    }

    return body;
  }

  private setValue = (val: string): string | null => {
    val = val.trim().toLocaleLowerCase();    
    if (val === 'null' || val === 'empty') return '-1';
    if (val === '') return null;
    return val;
  }

  render() {
    
    return (
      <Container maxWidth={'85%'}>
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
                    onKeyPress={(e: any) => this.handleEnterKey(e)}
                  />                  
                </Grid>
                <Grid item xs={12} md={2}>
                  <Select                     
                    variant="outlined"
                    color="primary"
                    name={'searchState'}
                    fullWidth                                     
                    value={this.state.searchState}
                    label="search state"
                    onChange={(e: any) => this.handleStateChanges(e)}
                  >
                    <MenuItem value={'AL'}>Alabama</MenuItem>
                    <MenuItem value={'AK'}>Alaska</MenuItem>
                    <MenuItem value={'AZ'}>Arizona</MenuItem>
                    <MenuItem value={'AR'}>Arkansas</MenuItem>
                    <MenuItem value={'CA'}>California</MenuItem>
                    <MenuItem value={'CO'}>Colorado</MenuItem>
                    <MenuItem value={'CT'}>Connecticut</MenuItem>
                    <MenuItem value={'DE'}>Delaware</MenuItem>
                    <MenuItem value={'FL'}>Florida</MenuItem>
                    <MenuItem value={'GA'}>Georgia</MenuItem>
                    <MenuItem value={'HI'}>Hawaii</MenuItem>
                    <MenuItem value={'ID'}>Idaho</MenuItem>
                    <MenuItem value={'IL'}>Illinois</MenuItem>
                    <MenuItem value={'IN'}>Indiana</MenuItem>
                    <MenuItem value={'IA'}>Iowa</MenuItem>
                    <MenuItem value={'KS'}>Kansas</MenuItem>
                    <MenuItem value={'KY'}>Kentucky</MenuItem>
                    <MenuItem value={'LA'}>Louisiana</MenuItem>
                    <MenuItem value={'ME'}>Maine</MenuItem>
                    <MenuItem value={'MD'}>Maryland</MenuItem>
                    <MenuItem value={'MA'}>Massachusetts</MenuItem>
                    <MenuItem value={'MI'}>Michigan</MenuItem>
                    <MenuItem value={'MN'}>Minnesota</MenuItem>
                    <MenuItem value={'MS'}>Mississippi</MenuItem>
                    <MenuItem value={'MO'}>Missouri</MenuItem>
                    <MenuItem value={'MT'}>Montana</MenuItem>
                    <MenuItem value={'NE'}>Nebraska</MenuItem>
                    <MenuItem value={'NV'}>Nevada</MenuItem>
                    <MenuItem value={'NH'}>New Hampshire</MenuItem>
                    <MenuItem value={'NJ'}>New Jersey</MenuItem>
                    <MenuItem value={'NM'}>New Mexico</MenuItem>
                    <MenuItem value={'NY'}>New York</MenuItem>
                    <MenuItem value={'NC'}>North Carolina</MenuItem>
                    <MenuItem value={'ND'}>North Dakota</MenuItem>
                    <MenuItem value={'OH'}>Ohio</MenuItem>
                    <MenuItem value={'OK'}>Oklahoma</MenuItem>
                    <MenuItem value={'OR'}>Oregon</MenuItem>
                    <MenuItem value={'PA'}>Pennsylvania</MenuItem>
                    <MenuItem value={'RI'}>Rhode Island</MenuItem>
                    <MenuItem value={'SC'}>South Carolina</MenuItem>
                    <MenuItem value={'SD'}>South Dakota</MenuItem>
                    <MenuItem value={'TN'}>Tennessee</MenuItem>
                    <MenuItem value={'TX'}>Texas</MenuItem>
                    <MenuItem value={'UT'}>Utah</MenuItem>
                    <MenuItem value={'VT'}>Vermont</MenuItem>
                    <MenuItem value={'VA'}>Virginia</MenuItem>
                    <MenuItem value={'WA'}>Washington</MenuItem>
                    <MenuItem value={'WV'}>West Virginia</MenuItem>
                    <MenuItem value={'WI'}>Wisconsin</MenuItem>
                    <MenuItem value={'WY'}>Wyoming</MenuItem>           
                  </Select>
                </Grid>
                <Grid item xs={12} md={1}>
                  <Box
                    component={Button}
                    variant="contained"
                    color="primary"
                    size="large"
                    height={54}
                    maxWidth={500}                
                    fullWidth
                    onClick={(e: any) => this.handleSearchButtonClick(e)}
                    onKeyPress={(e: any) => this.handleEnterKey(e)}
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
  callback: (body: ICourseSearch) => void;
  theme: Theme;
}

interface ISearchBox {
  action: string,
  errorMsg: string;
  searchText: string;
  searchState: string;
}