/**
 * Shared styles for markdown editor preview components
 */
export const getMarkdownPreviewStyles = (minHeight: string = '300px') => ({
  padding: 3,
  minHeight,
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
});
