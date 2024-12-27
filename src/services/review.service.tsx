import { courseServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper'; 
import { IStandardApiResponse } from 'interfaces/api-response.interface';
import { IFetchReviewApiResponse } from 'interfaces/review.interface';
import { IPostReviewApiResponse, IReviewPost } from 'interfaces/review.interfaces';

export class ReviewService {
  
  async fetch(courseId : string): Promise<IFetchReviewApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/course/review/${courseId}`, {
        method: 'get',
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

  async delete(courseId : string): Promise<IStandardApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/course/review/${courseId}`, {
        method: 'delete',
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
 
  async post(data: IReviewPost, courseId: string): Promise<IPostReviewApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/course/review/${courseId}`, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }),
        body: JSON.stringify(data)
      });

      const results = await Promise.resolve(response);
      return await results.json();
    } catch (error) {
      return await Promise.reject(error);
    }
  }  
}

export default ReviewService;