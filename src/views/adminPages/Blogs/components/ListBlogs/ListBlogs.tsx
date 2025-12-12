/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Container, Skeleton } from '@material-ui/core';

import Illustration from 'svg/illustrations/Globe';
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
          action: 'normal'         
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
        
        <Box display="flex" justifyContent="center" alignItems="center" sx={this.state.action === 'empty' ? { display: 'block' } : { display: 'none' }}>
          <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems={'center'}>
              <Illustration width='400px' height='400px'/>
            </Box>
          </Container>         
        </Box>

        <Box sx={this.state.action === 'normal' ? { display: 'block' } : { display: 'none' }}>          
          <Box marginBottom={4} sx={{ display: 'flex' }}>            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>   
                    <TableCell align="left">Title</TableCell>        
                    <TableCell align="left">Short Description</TableCell>  
                    <TableCell align="center">Date Created</TableCell>   
                    <TableCell align="center">Is Draft</TableCell>  
                    <TableCell align="center">Is Active</TableCell>                                                                                         
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.map((row) => (                    
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                      hover                                  
                    >                         
                      <TableCell align="left">
                        <Link component="button" onClick={(e:any) => this.handleOpenBlogSideBar(row)} sx={{ textAlign: 'left' }}>
                          {row.title}
                        </Link>                        
                      </TableCell>                        
                      
                      <TableCell align="left">{row.shortDescription}</TableCell>   

                      <TableCell align="center">{new Date(row.dateCreated).toLocaleDateString()}</TableCell>  

                      <TableCell align="center">{row.isDraft ? 'Yes' : 'No'}</TableCell>
                      
                      <TableCell align="center">{row.isActive ? 'Yes' : 'No'}</TableCell>                                                                               
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>          
        </Box>

        <Box display={this.state.action === 'loading' ? 'block' : 'none'}>  
          <SkeletonTable rows={10} columns={5} display={this.state.action === 'loading' ? true : false}></SkeletonTable>                 
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
