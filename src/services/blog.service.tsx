import { blogServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper'; 
import { IBlogListApiResponse, IFetchBlogApiResponse } from 'interfaces/blog.interfaces';

export class BlogService {
  
  async list(): Promise<IBlogListApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${blogServiceUrl}/api/blog/list`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          success: false,
          message: `HTTP error! status: ${response.status}`,
          messageCode: 501,
          count: 0,
          value: []
        }));
        return errorData;
      }

      const results = await response.json();
      return results;
    } catch (error) {
      console.error('Blog list fetch error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        messageCode: 501,
        count: 0,
        value: []
      };
    }
  }

  async fetch(id: string): Promise<IFetchBlogApiResponse> {
    const jwt: string | null = fetchJwt();

    if (!id) {
      return {
        success: false,
        message: 'Blog ID is required',
        messageCode: 403,
        count: 0,
        value: null
      };
    }

    try {
      const response = await fetch(`${blogServiceUrl}/api/blog/${id}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          success: false,
          message: `HTTP error! status: ${response.status}`,
          messageCode: 501,
          count: 0,
          value: null
        }));
        return errorData;
      }

      const results = await response.json();
      return results;
    } catch (error) {
      console.error('Blog fetch error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        messageCode: 501,
        count: 0,
        value: null
      };
    }
  }
}

export default BlogService;
