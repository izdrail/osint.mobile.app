import { Preferences } from '@capacitor/preferences';
import axios from "axios";

class ScanManagerService {

  static async performScan(domain: string) {
    const options = {
      method: 'POST',
      headers: {
        cookie: 'your-session-cookie-here',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'insomnia/10.0.0'
      },
      body: new URLSearchParams({
        scanname: `Scan for - ${domain}`,
        scantarget: `+${domain}`,
        usecase: 'all',
        modulelist: '',  // Placeholder for future modules
        typelist: ''
      }),
      redirect: 'manual'
    };

    try {
      const response = await fetch('api/startscan', options);

      // Handle redirection
      if ([301, 303].includes(response.status)) {
        const redirectUrl = response.headers.get('Location');
        if (!redirectUrl) throw new Error('Redirect URL not found.');
        return { redirectUrl };
      }

      // Parse HTML response for scan ID
      if (response.ok) {
        const htmlContent = await response.text();
        const match = htmlContent.match(/downloadLogs\("([A-Za-z0-9]+)"\)/);

        if (!match || !match[1]) throw new Error('Scan ID not found in HTML content.');

        const extractedId = match[1];

        // Retrieve and update scan list
        const { value } = await Preferences.get({ key: 'scans' });
        const scans = value ? JSON.parse(value) : [];

        scans.push({ scanID: extractedId, name: domain });

        await Preferences.set({
          key: 'scans',
          value: JSON.stringify(scans)
        });

        return { extractedId };
      }

      throw new Error(`HTTP error: ${response.status}`);
    } catch (err) {
      console.error('Error during performScan:', err);
      throw new Error('An error occurred while performing the scan.');
    }
  }

  static async getScans() {
    try {
      const { value } = await Preferences.get({ key: 'scans' });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error retrieving scans:', error);
      return [];
    }
  }

  static async getScanSummary(scanID: string, type: string) {
    const url = 'api/scansummary';
    const formData = new URLSearchParams();
    formData.append('id', scanID);
    formData.append('by', type);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch scan summary.');
      }
    } catch (error) {
      console.error('Error fetching scan summary:', error);
      throw new Error('An error occurred while fetching the scan summary.');
    }
  }

  static async getEventResults(scanID: string, event: string) {
    const url = 'api/scaneventresults';
    const formData = new URLSearchParams();
    formData.append('id', scanID);
    formData.append('eventType', event);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (response.ok) {
        const rawData = await response.json();

        // Map each raw entry to a structured object
        const structuredData = rawData.map((entry: any) => ({
          timestamp: entry[0],
          source: entry[1],
          destination: entry[2],
          module: entry[3],
          eventProgress: entry[4],
          overallProgress: entry[5],
          statusCode: entry[6],
          hash: entry[7],
          retryCount: entry[8],
          errorCount: entry[9],
          dataType: entry[10]
        }));

        return structuredData;
      } else {
        throw new Error('Failed to fetch event results.');
      }
    } catch (error) {
      console.error('Error fetching event results:', error);
      throw new Error('An error occurred while fetching event results.');
    }
  }
}

export default ScanManagerService;
