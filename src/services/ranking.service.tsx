import { courseServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper'; 
import { IApiResponse, IStandardApiResponse } from 'interfaces/api-response.interface';
import { IListRankingsApiResponse, IPostRankingApiResponse, IRankingPost, IRankingPost2} from 'interfaces/rankings.interfaces';

export class RankingService {
  
  async listByCourse(courseId : string): Promise<IListRankingsApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/rankings/list/course/' + courseId, {
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

  async listByFacility(facilityId : string): Promise<IListRankingsApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/rankings/list/facility/' + facilityId, {
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
 
  async post(data: IRankingPost): Promise<IPostRankingApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/rankings/create', {
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

  async createUpdate(data: IRankingPost2): Promise<IApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/rankings/create/update', {
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

  async delete(id : string): Promise<IStandardApiResponse> {
    
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(courseServiceUrl + '/api/rankings/' + id, {
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

export default RankingService;