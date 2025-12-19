export interface IIPLocationResponse {
  success: boolean;
  data?: {
    ip: string;
    city: string;
    region: string;
    country: string;
    country_code: string;
    latitude: number;
    longitude: number;
    timezone: string;
    isp: string;
    org: string;
  };
  error?: string;
}

export class LocationService {
  /**
   * Get geolocation data for an IP address using ip-api.com
   * Free tier: 1,000 requests per minute, no API key required
   */
  static async getIPLocation(ip: string): Promise<IIPLocationResponse> {
    try {
      // Skip lookup for localhost/private IPs
      if (!ip || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return {
          success: false,
          error: 'Private/localhost IP address'
        };
      }

      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,query`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check for API error response
      if (data.status === 'fail') {
        return {
          success: false,
          error: data.message || 'API error occurred'
        };
      }

      return {
        success: true,
        data: {
          ip: data.query,
          city: data.city || 'Unknown',
          region: data.regionName || 'Unknown',
          country: data.country || 'Unknown',
          country_code: data.countryCode || '',
          latitude: data.lat || 0,
          longitude: data.lon || 0,
          timezone: data.timezone || '',
          isp: data.isp || 'Unknown',
          org: data.org || 'Unknown'
        }
      };
    } catch (error) {
      console.error('IP geolocation lookup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}