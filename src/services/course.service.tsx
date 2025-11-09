import { courseServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper'; 
import { IStandardApiResponse } from 'interfaces/api-response.interface';
import { ICoursePatch, ICourseSearchCriteriaProps, ICourseSearchCriteriaBody, IFetchCourseAndFacilityApiResponse, ICourseListApiResponse, IPatchCourseApiResponse, ICourseListWithRankingApiResponse, IFetchPhotosApiResponse, ICoursePatchForDefaultPhoto } from 'interfaces/course.interfaces';

export class CourseService {
  
  /*
  async fetch(id : string): Promise<IFetchCourseApiResponse> {
    
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
  */

  async fetchIncFacility(id : string): Promise<IFetchCourseAndFacilityApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/course/' + id + '/includefacility', {
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

  async fetchPhotos(id : string): Promise<IFetchPhotosApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/course/${id}/photos`, {
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

  async postPhotos(body: FormData, id: string): Promise<IFetchPhotosApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/course/${id}/postphotos`, {
        method: 'POST',
        headers: new Headers({   
          'X-Authorization': `Bearer ${jwt}`,        
        }),   
        body: body,     
      });

      const results = await Promise.resolve(response);
      return await results.json();
    } catch (error) {
      return await Promise.reject(error);
    }
  }

  // This is for the search without ranking (deprecated)
  /*
  async zz_search(body: ICourseSearch): Promise<ICourseListApiResponse> {    
    const jwt: string | null = fetchJwt();
       
    try {
      const response = await fetch(courseServiceUrl + '/api/course/search', {
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
  */

  async searchWithRanking(body: ICourseSearchCriteriaBody): Promise<ICourseListWithRankingApiResponse> {    
    const jwt: string | null = fetchJwt();
       
    try {
      const response = await fetch(courseServiceUrl + '/api/course/search', {
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

  async delete(id : string): Promise<IStandardApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/course/' + id, {
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

  async deletePhoto(courseId: string, name : string): Promise<IStandardApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/course/${courseId}/${name}`, {
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

  async patch(data: ICoursePatch | ICoursePatchForDefaultPhoto): Promise<IPatchCourseApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/course/update', {
        method: 'patch',
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

export default CourseService;