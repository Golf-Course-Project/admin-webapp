/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Container, Button, Typography, Grid } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import NotFoundIllustration from 'svg/illustrations/NotFound';
import EditBlog from '../EditBlog';

import { SkeletonTable } from 'common/components';

import { IBlog, IBlogListApiResponse } from 'interfaces/blog.interfaces';
import BlogService from 'services/blog.service';
import ErrorMessage from 'common/components/ErrorMessage';

class ListBlogs extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',
    errorMsg: '',   
    data: [],
    count: 0,   
    selectedRowId: '', 
    openBlogSideBar: false,   
    selectedBlog: null,
  }

  componentDidMount() {
    this.loadBlogs();
  }

  private handleOpenBlogSideBar = (row: IBlog) => {           
    this.setState({ openBlogSideBar: true, selectedBlog: row, selectedRowId: row.id });      
  };  

  private handleSidebarClose = () => {
    this.setState({ openBlogSideBar: false });       
  }; 

  private loadBlogs = () => {
    this.setState({ action: 'loading' });

    const client: BlogService = new BlogService();  
    
    client.list().then(async (response: IBlogListApiResponse) => {        

      if (response.messageCode !== 200) {
        this.setState({ errorMsg: response.message, action: 'error', selectedRowId: ''});        
        return;
      }

      if (response.success) {          
        this.setState({
          data: response.value,
          count: response.value.length,
          selectedRowId: '',     
          errorMsg: '',
          action: response.value.length === 0 ? 'empty' : 'normal'         
        });       
      }
    }).catch((error: Error) => {      
      this.setState({ errorMsg: error.message, action: 'error', data: []});           
    });
  }  

  render() {
    return (
      <Box>   

        <ErrorMessage message={this.state.errorMsg}></ErrorMessage>               
        
        <Box display="flex" justifyContent="center" alignItems="center" sx={this.state.action === 'empty' ? { display: 'flex', minHeight: '400px' } : { display: 'none' }}>
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid item container justifyContent={'center'} xs={12} md={6}>
                <Box
                  height={'100%'}
                  width={'100%'}
                  maxWidth={{ xs: 500, md: '100%' }}
                >
                  <NotFoundIllustration width={'100%'} height={'100%'} />
                </Box>
              </Grid>
              <Grid
                item
                container
                alignItems={'center'}
                justifyContent={'center'}
                xs={12}
                md={6}
              >
                <Box>
                  <Typography
                    variant="h1"
                    component={'h1'}
                    align={'left'}
                    sx={{ fontWeight: 700 }}
                  >
                    No Blog Posts Found
                  </Typography>
                  <Typography
                    variant="h6"
                    component="p"
                    color="textSecondary"
                    align={'left'}
                  >
                    Looks like there are no blog posts to edit.
                  </Typography>
                  <Box
                    marginTop={4}
                    display={'flex'}
                    justifyContent={'flex-start'}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Create new post
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>         
        </Box>

        <Box sx={this.state.action === 'normal' ? { display: 'block' } : { display: 'none' }}>          
          <Box marginBottom={4} sx={{ display: 'flex' }}>            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>   
                    <TableCell align="left" sx={{ width: '70%' }}>Title</TableCell>        
                    <TableCell align="center">Date Created</TableCell>   
                    <TableCell align="center">Draft</TableCell>  
                    <TableCell align="center">Active</TableCell>                                                                                         
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.map((row) => (                    
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                      hover                                  
                    >                         
                      <TableCell align="left" sx={{ width: '70%' }}>
                        <Link component="button" onClick={(e:any) => this.handleOpenBlogSideBar(row)} sx={{ textAlign: 'left' }}>
                          {row.title}
                        </Link>                        
                      </TableCell>                        

                      <TableCell align="center">{new Date(row.dateCreated).toLocaleDateString()}</TableCell>  

                      <TableCell align="center">
                        {row.isDraft ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                      </TableCell>
                      
                      <TableCell align="center">
                        {row.isActive ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                      </TableCell>                                                                               
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>          
        </Box>

        <Box display={this.state.action === 'loading' ? 'block' : 'none'}>  
          <SkeletonTable rows={10} columns={4} display={this.state.action === 'loading' ? true : false}></SkeletonTable>                 
        </Box>    

        <EditBlog
          theme={this.props.theme}
          open={this.state.openBlogSideBar}
          id={this.state.selectedBlog?.id}
          title={this.state.selectedBlog?.title}         
          onClose={this.handleSidebarClose}                            
        >
        </EditBlog>   
      </Box>
    );
  }
}

export default ListBlogs;

interface IProps {
  callback: () => void;
  theme: Theme;
}

interface IForm {
  action: string,
  errorMsg: string;  
  data: IBlog[]; 
  count: number;
  selectedRowId: string;  
  openBlogSideBar: boolean; 
  selectedBlog: IBlog | null; 
}
