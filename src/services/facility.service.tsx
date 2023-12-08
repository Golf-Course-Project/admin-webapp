import { courseServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper'; 
import { IFacility, IFetchFacilityApiResponse, IPatchFacilityApiResponse } from 'interfaces/facility.interfaces';
import { IStandardApiResponse } from 'interfaces/api-response.interface';

export class FacilityService {
  
  async fetch(id : string): Promise<IFetchFacilityApiResponse> {
    
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

  async patch(data: IFacility): Promise<IPatchFacilityApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/facility/update', {
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

export default FacilityService;