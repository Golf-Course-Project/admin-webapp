import { courseServiceUrl } from '../helpers/urls.helper';
import { fetchJwt } from '../helpers/jwt.helper';
import { ITelemetryListApiResponse, IFetchTelemetryApiResponse } from 'interfaces/telemetry.interfaces';

export class TelemetryService {
  
  async listByDays(days: number): Promise<ITelemetryListApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/telemetry/list/days/${days}`, {
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

  async listByState(state: string): Promise<ITelemetryListApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/telemetry/state/${state}`, {
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

  async listByCourse(courseId: string): Promise<ITelemetryListApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/telemetry/course/${courseId}`, {
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

  async fetch(id: string): Promise<IFetchTelemetryApiResponse> {
    const jwt: string | null = fetchJwt();

    try {
      const response = await fetch(`${courseServiceUrl}/api/telemetry/${id}`, {
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
}

export default TelemetryService;
