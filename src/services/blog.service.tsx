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

      const results = await Promise.resolve(response);
      return await results.json();
    } catch (error) {
      return await Promise.reject(error);
    }
  }

  async fetch(id: string): Promise<IFetchBlogApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${blogServiceUrl}/api/blog/${id}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }),
      });

      const results = await Promise.resolve(response);
      return await results.json();
    } catch (error) {
      return await Promise.reject(error);
    }
  }
}

export default BlogService;
