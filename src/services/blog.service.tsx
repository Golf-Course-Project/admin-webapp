import { blogServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper'; 
import { IBlogListApiResponse, IBlogPatch, IBlogPublishPatch, IFetchBlogApiResponse } from 'interfaces/blog.interfaces';
import { IStandardApiResponse } from 'interfaces/api-response.interface';

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
      const text = await results.text();
      return text ? JSON.parse(text) : {};
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
      const text = await results.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      return await Promise.reject(error);
    }
  }

  async publish(body: IBlogPublishPatch): Promise<IFetchBlogApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(blogServiceUrl + '/api/blog/publish', {
        method: 'patch',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }),
        body: JSON.stringify(body)
      });

      const results = await Promise.resolve(response);
      const text = await results.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      return await Promise.reject(error);
    }
  } 
  
  async patch(body: IBlogPatch): Promise<IFetchBlogApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(blogServiceUrl + '/api/blog/update', {
        method: 'patch',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }),
        body: JSON.stringify(body)
      });

      const results = await Promise.resolve(response);
      const text = await results.text();

      return text ? JSON.parse(text) : {};
    } catch (error) {
      return await Promise.reject(error);
    }
  } 

  async create(): Promise<IFetchBlogApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(blogServiceUrl + '/api/blog/create', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }),        
      });

      const results = await Promise.resolve(response);
      const text = await results.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      return await Promise.reject(error);
    }
  } 

  async destroy(id: string): Promise<IStandardApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(blogServiceUrl + '/api/blog/' + id, {
        method: 'delete',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }),        
      });

      const results = await Promise.resolve(response);
      const text = await results.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      return await Promise.reject(error);
    }
  }
}

export default BlogService;
