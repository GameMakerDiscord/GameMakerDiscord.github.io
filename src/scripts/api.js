// Imports
import $ from 'jquery';

const ONE_HOUR = 60 * 60 * 1000;

// API url
const api = 'https://chrisanselmo.com/gmd_ghorg_api';

/**
 * Loads organization information from cache or server
 */
export default async function loadData() {
  let org = {};

  // Check for cached information
  let existing = localStorage.getItem('gmd_ghorg_api');

  if (existing) {

    // Parse cache
    existing = JSON.parse(existing);
    
    // Extract cache timestamp
    let cacheDate = new Date(existing.timestamp);

    // Check if cache was created within one hour from now
    if (((new Date) - cacheDate) < ONE_HOUR) {

      // Return cached information
      return existing.org;
    }
  }

  // Attempt to connect to API
  try {

    // Hit API and parse
    let org = JSON.parse(await downloadOrganizationInformation());

    // Cache results
    let cache = {
      org: org,
      timestamp: new Date()
    };

    // Save cache to local storage
    localStorage.setItem('gmd_ghorg_api', JSON.stringify(cache));

    return org;
  } catch (e) {

    // Return cached data in the event that API is unreachable and cache exists
    if (existing) return existing.org;
    
    // Throw an API error
    throw new Error(e);
  }
}

/**
 * Fetches organization info
 */
function downloadOrganizationInformation() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: api,
      type: 'GET',
      success: s => resolve(s),
      error: e => reject(e)
    });
  });
}
