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

class EditBlog extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'normal',
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    ready: true,
    blurErrors: [],
    id: this.props.id || '',
    title: 'Sample Blog Post Title',
    pageName: 'sample-blog-post-title',
    shortDescription: 'This is a short description of the blog post that provides a quick overview of the content.',
    description: '# Sample Blog Post\n\nThis is a **markdown** editor with preview support.\n\n## Features\n\n- Write in markdown\n- Preview your content\n- Easy to use\n\n```javascript\nconst example = "code block";\n```\n\n> This is a blockquote',
    markdownTab: 0,
  }

  private resetForm = () => {
    this.setState({
      action: 'normal',
      messageCode: 200,
      messageText: '',
      open: false,
      ready: false,
      blurErrors: [],
      id: '',
      title: '',
      pageName: '',
      shortDescription: '',
      description: '',
      markdownTab: 0,
    });
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.open !== this.props.open && this.props.open) {      
      this.setState({ 
        open: this.props.open,
        id: this.props.id || '',
        // TODO: Fetch blog data by ID when API is ready
        // For now, using mock data
        title: 'Sample Blog Post Title',
        pageName: 'sample-blog-post-title',
        shortDescription: 'This is a short description of the blog post that provides a quick overview of the content.',
        description: '# Sample Blog Post\n\nThis is a **markdown** editor with preview support.\n\n## Features\n\n- Write in markdown\n- Preview your content\n- Easy to use\n\n```javascript\nconst example = "code block";\n```\n\n> This is a blockquote',
        action: 'normal',
        ready: true
      });
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

          <Box component={CardContent} padding={4}>
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
                                  '& h1': { fontSize: '2em', marginBottom: '0.5em' },
                                  '& h2': { fontSize: '1.5em', marginBottom: '0.5em' },
                                  '& h3': { fontSize: '1.17em', marginBottom: '0.5em' },
                                  '& code': {
                                    backgroundColor: '#f5f5f5',
                                    padding: '2px 4px',
                                    borderRadius: '3px',
                                    fontFamily: 'monospace'
                                  },
                                  '& pre': {
                                    backgroundColor: '#f5f5f5',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    overflow: 'auto'
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
  id: string;
  title: string;
  pageName: string;
  shortDescription: string;
  description: string;
  markdownTab: number;
}
