/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CardContent, CircularProgress, Divider, Drawer, Grid, IconButton, TextField, Typography, Tabs, Tab, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { ErrorMessage } from 'common/components';
import { IBlog, IFetchBlogApiResponse } from 'interfaces/blog.interfaces';
import BlogService from 'services/blog.service';

class EditBlog extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    ready: false,
    blurErrors: [],
    data: null,
    id: this.props.id || '',
    title: '',
    pageName: '',
    shortDescription: '',
    description: '',
    markdownTab: 0,
  }

  private resetForm = () => {
    this.setState({
      action: 'loading',
      messageCode: 200,
      messageText: '',
      open: false,
      ready: false,
      blurErrors: [],
      data: null,
      id: '',
      title: '',
      pageName: '',
      shortDescription: '',
      description: '',
      markdownTab: 0,
    });
  }

  private fetch = (id: string) => {
    const client: BlogService = new BlogService();

    client.fetch(id).then((response: IFetchBlogApiResponse) => {
      if (response.success && response.value) {
        this.setState({
          data: response.value,
          id: response.value.id ?? '',
          title: response.value.title ?? '',
          pageName: response.value.pageName ?? '',
          shortDescription: response.value.shortDescription ?? '',
          description: response.value.description ?? '',
          action: 'normal',
          ready: true
        });
      } else {
        this.setState({
          action: 'normal',
          ready: true,
          messageCode: response.messageCode,
          messageText: response.message || 'Failed to fetch blog data'
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

  componentDidUpdate(prevProps: any) {
    if (prevProps.open !== this.props.open && this.props.open) {      
      this.setState({ 
        open: this.props.open,
        id: this.props.id || '',
        action: 'loading',
        ready: false
      });

      if (this.props.id) {
        this.fetch(this.props.id);
      } else {
        // No ID provided (new blog creation scenario)
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

  handleSaveOnClick() {
    // TODO: Implement save functionality when API is ready
    this.setState({ action: 'update' });
    console.log('Save clicked', {
      id: this.state.id,
      title: this.state.title,
      pageName: this.state.pageName,
      shortDescription: this.state.shortDescription,
      description: this.state.description
    });
    // Simulate save completion
    setTimeout(() => {
      this.setState({ action: 'normal' });
    }, 1000);
  }

  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<IForm, keyof IForm>);
  };

  private handleInputBlur = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    let blurErrors: string[] = this.state.blurErrors;

    if (blurErrors.includes(e.currentTarget.name)) {
      blurErrors.splice(blurErrors.indexOf(e.currentTarget.name), 1);
    }

    switch (e.currentTarget.name) {
      case 'title':
        if (this.state.title.length < 3 && !blurErrors.includes(e.currentTarget.name)) {
          blurErrors.push('title');
        }
        break;
      case 'pageName':
        if (this.state.pageName.length < 3 && !blurErrors.includes(e.currentTarget.name)) {
          blurErrors.push('pageName');
        }
        break;
      default:
        break;
    }

    this.setState({ blurErrors: blurErrors });
  }

  private handleMarkdownChange = (value: string) => {
    this.setState({ description: value });
  }

  private handleMarkdownTabChange = (event: React.SyntheticEvent, newValue: number) => {
    this.setState({ markdownTab: newValue });
  }

  private renderMarkdown = (text: string): string => {
    // Use marked library to convert markdown to HTML
    // marked.parse is synchronous in this version
    const rawHtml = marked.parse(text) as string;
    // Sanitize the HTML to prevent XSS attacks
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return cleanHtml;
  }

  private setHelperTextMessage = (field: string) => {
    switch (field) {
      case 'title':
        return this.state.blurErrors.includes('title') ? 'Title is required' : ' ';
      case 'pageName':
        return this.state.blurErrors.includes('pageName') ? 'Page Name is required' : ' ';
      default:
        return ' ';
    }
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
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: { xs: '100%', sm: '80%' } } }}
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
            <Typography
              variant="h3"
              align={'center'}
              sx={{ fontWeight: 500 }}
            >
              {this.state.title || 'New Blog Post'}
            </Typography>
          </Box>

          <Divider variant="middle" />

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Box width={'100%'}>
              <ErrorMessage message={this.state.messageText} />
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} marginTop={4} marginBottom={2}>
            <Box display={this.state.action === 'loading' ? 'flex' : 'none'}>
              <CircularProgress color="primary" />
            </Box>
          </Box>

          <Box component={CardContent} padding={4} display={this.state.action === 'loading' ? 'none' : 'block'}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <ErrorMessage message={this.setErrorMessage(this.state.messageCode, this.state.messageText)} />
                <form noValidate autoComplete="off">
                  <Box display="flex" flexDirection={'column'}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Blog ID"
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
                          label="Title *"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'title'}
                          value={this.state.title}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('title') ? true : false}
                          helperText={this.setHelperTextMessage('title')}
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Page Name *"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'pageName'}
                          value={this.state.pageName}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('pageName') ? true : false}
                          helperText={this.setHelperTextMessage('pageName')}
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Short Description"
                          variant="outlined"
                          color="primary"
                          multiline
                          rows={4}
                          fullWidth
                          name={'shortDescription'}
                          value={this.state.shortDescription}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          helperText={' '}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} sx={{ marginTop: '15px' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                          Description
                        </Typography>
                        <Box>
                          <Tabs
                            value={this.state.markdownTab}
                            onChange={(e: any, val: any) => this.handleMarkdownTabChange(e, val)}
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                          >
                            <Tab label="Markdown" />
                            <Tab label="Preview" />
                          </Tabs>
                          <Box sx={{ marginTop: 2 }}>
                            {this.state.markdownTab === 0 && (
                              <Box>
                                <SimpleMDE
                                  value={this.state.description}
                                  onChange={this.handleMarkdownChange}
                                  options={{
                                    spellChecker: false,
                                    placeholder: 'Write your blog post in markdown...',
                                    status: false,
                                    toolbar: [
                                      'bold',
                                      'italic',
                                      'heading',
                                      '|',
                                      'quote',
                                      'unordered-list',
                                      'ordered-list',
                                      '|',
                                      'link',
                                      'image',
                                      '|',
                                      'preview',
                                      'guide'
                                    ],
                                    minHeight: '400px',
                                  }}
                                />
                              </Box>
                            )}
                            {this.state.markdownTab === 1 && (
                              <Paper
                                variant="outlined"
                                sx={{
                                  padding: 3,
                                  minHeight: '400px',
                                  backgroundColor: '#fafafa',
                                  color: '#333',
                                  '& h1': { fontSize: '2em', marginBottom: '0.5em', color: '#333' },
                                  '& h2': { fontSize: '1.5em', marginBottom: '0.5em', color: '#333' },
                                  '& h3': { fontSize: '1.17em', marginBottom: '0.5em', color: '#333' },
                                  '& p': { color: '#333' },
                                  '& code': {
                                    backgroundColor: '#f5f5f5',
                                    padding: '2px 4px',
                                    borderRadius: '3px',
                                    fontFamily: 'monospace',
                                    color: '#333'
                                  },
                                  '& pre': {
                                    backgroundColor: '#f5f5f5',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    overflow: 'auto',
                                    color: '#333'
                                  },
                                  '& blockquote': {
                                    borderLeft: '4px solid #ddd',
                                    paddingLeft: '10px',
                                    margin: '10px 0',
                                    color: '#666'
                                  }
                                }}
                              >
                                <div dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.state.description) }} />
                              </Paper>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12} sx={{ marginTop: '20px' }}>
                        <Box
                          display={'flex'}
                          justifyContent={'flex-start'}
                          sx={{ paddingBottom: '10px' }}
                        >
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{ width: { xs: '100%', md: 'auto' }, minWidth: '200px' }}
                            onClick={(e: any) => this.handleSaveOnClick()}
                            disabled={this.state.action === 'update'}
                          >
                            {this.state.action === 'update' ? 'Saving...' : 'Save'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </form>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    );
  }
}

export default EditBlog;

interface IProps {
  theme: Theme;
  open: boolean;
  id?: string;
  title?: string;
  onClose: () => void;
}

interface IForm {
  action: string;
  messageText: string;
  messageCode: number;
  open: boolean;
  ready: boolean;
  blurErrors: string[];
  data: IBlog | null;
  id: string;
  title: string;
  pageName: string;
  shortDescription: string;
  description: string;
  markdownTab: number;
}
