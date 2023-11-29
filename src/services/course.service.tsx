import { courseServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper'; 
import { IStandardApiResponse } from 'interfaces/api-response.interface';
import { ICourseSearch, IListCoursesResponse } from 'interfaces/course.interfaces';

export class CourseService {
  
  async Fetch(id : string): Promise<IStandardApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/course/' + id, {
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

  async Search(body: ICourseSearch): Promise<IListCoursesResponse> {    
    const jwt: string | null = fetchJwt();
       
    try {
      const response = await fetch(courseServiceUrl + '/api/course/list/states/' + body.state, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwt}`,
          Accept: 'application/json',
        }), 
        body: JSON.stringify(body),       
      });

      const results = await Promise.resolve(response);
      return await results.json();
    } catch (error) {
      return await Promise.reject(error);
    }
  } 
}

export default CourseService;