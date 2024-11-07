
import { Preferences } from '@capacitor/preferences';

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
        scanname: domain,
        scantarget: domain,
        usecase: 'all',
        modulelist: 'module_sfp_orangenetwork',
        typelist: ''
      }),
      redirect: 'manual'
    };

    try {
      const response = await fetch('api/startscan', options);  // Replace 'api/startscan' with your API endpoint URL

      if ([301, 303].includes(response.status)) {
        const redirectUrl = response.headers.get('Location');
        if (!redirectUrl) throw new Error('Redirect URL not found.');
        return { redirectUrl };
      }

      if (response.ok) {
        const htmlContent = await response.text();
        const match = htmlContent.match(/downloadLogs\("([A-Za-z0-9]+)"\)/);
        if (match && match[1]) {
          const extractedId = match[1];

          // Retrieve existing scans (if any)
          const { value } = await Preferences.get({ key: 'scans' });
          const scans = value ? JSON.parse(value) : []; // Parse existing value or initialize as an empty array

          // New scan data to push
          const newScan = {
            scanID: extractedId,
            name: domain
          };

          // Push the new data into the array
          scans.push(newScan);

          // Save the updated array back to Preferences
          await Preferences.set({
            key: 'scans',
            value: JSON.stringify(scans)
          });

          return { extractedId };
        } else {
          throw new Error('ID not found in HTML content.');
        }
      }

      throw new Error(`HTTP error: ${response.status}`);

    } catch (err) {
      console.error('Error:', err);
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
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        throw new Error('Failed to fetch scan summary.');
      }
    } catch (error) {
      console.error('Error fetching scan summary:', error);
      throw new Error('An error occurred while fetching the scan summary.');
    }
  }
}

export default ScanManagerService;