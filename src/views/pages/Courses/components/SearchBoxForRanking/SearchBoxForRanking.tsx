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
import { Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import OptionsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import RestoreIcon from '@material-ui/icons/Restore';

import { RefValueData } from 'data/refvalue.data';
import { ICourseSearchCriteriaProps } from 'interfaces/course.interfaces';
import { IOptions } from 'interfaces/rankings.interfaces';
import { CourseSearch } from 'common/classes/course.search';

class SearchBoxForRanking extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  
  state: IForm = {
    action: 'normal',
    errorMsg: '',
    searchText: localStorage.getItem('searchText') ?? '',
    searchState: localStorage.getItem('searchState') ?? 'MI',
    sourceRefValueId: -1,
    nameRefValueId: -1,
    year: new Date().getFullYear(),
    openOptions: false
  }

  componentDidMount() {
    const rankingOptions: IOptions = JSON.parse(localStorage.getItem('rankingOptions') ?? '{}');
    this.setState({ sourceRefValueId: rankingOptions.sourceRefValueId, nameRefValueId: rankingOptions.nameRefValueId, year: rankingOptions.year });
    
    // Check for initial search params from query string
    if (this.props.initialSearchParams) {
      const { searchText, state } = this.props.initialSearchParams;
      const newSearchText = searchText ?? this.state.searchText;
      const newSearchState = state ?? this.state.searchState;
      
      this.setState({ searchText: newSearchText, searchState: newSearchState }, () => {
        // Auto-trigger search after state is set
        const body: ICourseSearchCriteriaProps = this.buildSearchText(newSearchText.toLocaleLowerCase(), newSearchState.toLocaleLowerCase());
        const options: IOptions = { sourceRefValueId: this.state.sourceRefValueId, nameRefValueId: this.state.nameRefValueId, year: this.state.year };
        body.pageNumber = 1;
        this.props.callback(body, options);
      });
    }
  }

  componentDidUpdate(prevProps: IProps) {
    // Handle when query string params change
    if (this.props.initialSearchParams && prevProps.initialSearchParams !== this.props.initialSearchParams) {
      const { searchText, state } = this.props.initialSearchParams;
      const newSearchText = searchText ?? this.state.searchText;
      const newSearchState = state ?? this.state.searchState;
      
      this.setState({ searchText: newSearchText, searchState: newSearchState }, () => {
        // Auto-trigger search after state is set
        const body: ICourseSearchCriteriaProps = this.buildSearchText(newSearchText.toLocaleLowerCase(), newSearchState.toLocaleLowerCase());
        const options: IOptions = { sourceRefValueId: this.state.sourceRefValueId, nameRefValueId: this.state.nameRefValueId, year: this.state.year };
        body.pageNumber = 1;
        this.props.callback(body, options);
      });
    }
  }

  private handleOnSettingsClose = () => {
    const options: IOptions = { sourceRefValueId: this.state.sourceRefValueId, nameRefValueId: this.state.nameRefValueId, year: this.state.year };
    localStorage.setItem('rankingOptions', JSON.stringify(options));
    this.setState({ openOptions: false });   
  }

  private handleOnSettingsOpen = () => {
    const rankingOptions: IOptions = JSON.parse(localStorage.getItem('rankingOptions') ?? '{}');
    this.setState({ openOptions: true, sourceRefValueId: rankingOptions.sourceRefValueId, nameRefValueId: rankingOptions.nameRefValueId, year: rankingOptions.year });
  }

  private handleResetClick = () => {
    this.setState({ searchText: '', searchState: '' });
    localStorage.setItem('searchText', '');
    localStorage.setItem('searchState', '');
  }

  private handleSettingsSelectChanges = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault();
    
    const target = e.target as HTMLSelectElement;    
    this.setState({ [target.name]: target.value } as unknown as Pick<IForm, keyof IForm>);     
  };

  private handleSearchBoxInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<IForm, keyof IForm>);
  };

  private handleSelectStateChanges = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const target = e.target as HTMLSelectElement;
    this.setState({ [target.name]: target.value } as unknown as Pick<IForm, keyof IForm>);
  };

  private handleSearchButtonClick = (e: React.ChangeEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const searchText = this.state.searchText;
    const searchState = this.state.searchState;

    localStorage.setItem('searchText', searchText);
    localStorage.setItem('searchState', searchState);    
    
    const body: ICourseSearchCriteriaProps = this.buildSearchText(searchText.toLocaleLowerCase(), searchState.toLocaleLowerCase());
    const options: IOptions = { sourceRefValueId: this.state.sourceRefValueId, nameRefValueId: this.state.nameRefValueId, year: this.state.year };
   
    body.pageNumber = 1;
    this.props.callback(body, options);
  }

  private handleEnterKeyForSearch = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      this.handleSearchButtonClick(e);
    }
  }

  private buildSearchText = (searchText: string, state: string | null): ICourseSearchCriteriaProps => {
    let len: number = searchText.length;
    let ind: number;
    let key: string, val: string;

    let split = searchText.split(',');
    if (split.length < 1) split.push(searchText);

    if (state === 'all') state = null;

    let body: ICourseSearchCriteriaProps = new CourseSearch();

    body.state = state;

    split.forEach((i) => {
      ind = i.indexOf(':');
      key = i.slice(0, ind).trim();
      val = i.slice(ind + 1, len).trim();

      body.name = key.includes('name') ? this.setValue(val) : null;
      body.city = key.includes('city') ? this.setValue(val) : null;
      body.postalCode = key.includes('postalcode') ? this.setValue(val) : null;
      body.type = key.includes('type') ? this.setValue(val) : null;
      body.tag = key.includes('tag') ? this.setValue(val) : null;
      body.tier = key.includes('tier') ? (this.setValue(val) ?? '').toLocaleUpperCase() : null;
      body.isRanked = key.includes('isranked') ? this.setValue(val) : null;
      body.isFlagged = key.includes('isflagged') ? this.setValue(val) : null;
      body.isFeatured = key.includes('isfeatured') ? this.setValue(val) : null;
    });

    body.text = searchText.trim().toLocaleLowerCase();

    if (body.name !== null 
      || body.city !== null 
      || body.postalCode !== null 
      || body.type !== null 
      || body.tier !== null 
      || body.tag !== null 
      || body.isRanked !== null 
      || body.isFeatured !== null
      || body.isFlagged !== null) 
    {
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
      <div>
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
                <Grid container spacing={2} paddingRight={2} paddingLeft={2}>
                  <Grid item xs={12} md={7}>
                    <Box
                      component={TextField}
                      variant="outlined"
                      color="primary"
                      name={'searchText'}
                      fullWidth
                      height={54}
                      value={this.state.searchText}
                      onChange={(e: any) => this.handleSearchBoxInputChanges(e)}
                      onKeyPress={(e: any) => this.handleEnterKeyForSearch(e)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Select
                      variant="outlined"
                      color="primary"
                      name={'searchState'}
                      fullWidth
                      value={this.state.searchState}
                      onChange={(e: any) => this.handleSelectStateChanges(e)}
                    >
                      <MenuItem value={'ALL'}>All States</MenuItem>
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
                      maxWidth={'100%'}
                      fullWidth
                      onClick={(e: any) => this.handleSearchButtonClick(e)}
                      onKeyPress={(e: any) => this.handleEnterKeyForSearch(e)}
                    >
                      Search
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={1} display={'flex'} alignItems={'center'} justifyContent={'center'} gap={0.5}>
                    <IconButton aria-label="reset" onClick={this.handleResetClick} size="small">
                      <RestoreIcon />
                    </IconButton>
                    <IconButton aria-label="settings" onClick={(e: any) => this.handleOnSettingsOpen()} size="small">
                      <OptionsIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Box>
        </Container>

        <Drawer
          anchor='right'
          open={this.state.openOptions}
          variant={'temporary'}
          sx={{ '& .MuiPaper-root': { width: '30%', maxWidth: { xs: '100%', sm: '75%' } } }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                display={'flex'}
                justifyContent={'flex-end'}
                sx={{ paddingRight: '10px', paddingTop: '10px' }}
                onClick={(e: any) => this.handleOnSettingsClose()}
              >
                <IconButton>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          <Box marginBottom={1} marginLeft={5}>
            <Typography
              variant="h4"
              align={'left'}
              sx={{ fontWeight: 500, }}
            >
              Settings
            </Typography>
          </Box>

          <Box component={CardContent} padding={4}>
            <Grid container spacing={2} paddingTop={3} paddingBottom={3}>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth variant="outlined" color="primary">
                  <InputLabel id="name-label">Source </InputLabel>
                  <Select
                    labelId="source-label"
                    id="sourceRefValueId"
                    value={this.state.sourceRefValueId}
                    onChange={(e: any) => this.handleSettingsSelectChanges(e)}
                    label="Source "
                    name="sourceRefValueId"
                    fullWidth={true}
                  >
                    {RefValueData.sources.map((source) => (
                      <MenuItem key={source.id} value={source.id}>
                        {source.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth variant="outlined" color="primary">
                  <InputLabel id="name-label">Name </InputLabel>
                  <Select
                    labelId="nameRefValueId"
                    id="nameRefValueId"
                    label="Name "
                    value={this.state.nameRefValueId}
                    onChange={(e: any) => this.handleSettingsSelectChanges(e)}                   
                    name="nameRefValueId"
                    fullWidth={true}
                  >
                    {RefValueData.names.map((name) => (
                      <MenuItem key={name.id} value={name.id}>
                        {name.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth variant="outlined" color="primary">
                  <InputLabel id="year-label">Year </InputLabel>
                  <Select
                    labelId="year-label"
                    id="year"
                    value={this.state.year}
                    onChange={(e: any) => this.handleSettingsSelectChanges(e)}
                    label="Year "
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
            </Grid>
          </Box>
        </Drawer>
      </div>
    );
  }
}

export default SearchBoxForRanking;

interface IProps {
  callback: (body: ICourseSearchCriteriaProps, options: IOptions) => void;
  theme: Theme;
  initialSearchParams?: {searchText?: string, state?: string} | null;
}

interface IForm {
  action: string,
  errorMsg: string;
  searchText: string;
  searchState: string;
  openOptions: boolean;
  sourceRefValueId: number; 
  nameRefValueId: number; 
  year: number;
}