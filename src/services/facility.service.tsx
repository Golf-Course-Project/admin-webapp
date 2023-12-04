import { courseServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper'; 
import { IFetchFacilityResponse } from 'interfaces/facility.interfaces';
import { IStandardApiResponse } from 'interfaces/api-response.interface';

export class FacilityService {
  
  async fetch(id : string): Promise<IFetchFacilityResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/facility/' + id, {
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

  async delete(id : string): Promise<IStandardApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/facility/' + id, {
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
   
}

export default FacilityService;