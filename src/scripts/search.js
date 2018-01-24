// Imports
import $ from 'jquery';
import buildRepoGrid from './grid';

// Define sort mode constants
export const sortModes = {
  commitDate: 0,
  alphabetical: 1
};

let repos = [],
    query = '',
    topics = [],
    sortMode = sortModes.commitDate,
    sortAscending = true;

export function setMode(mode) {
  sortMode = mode;
  filterRepos();
}

export function setAscending(asc) {
  sortAscending = asc;
  filterRepos();
}

/**
 * Updates the search module repo list
 */
export function updateRepos(newRepos) {
  repos = newRepos;
}

/**
 * Update the search query to filter repos by
 * @param {string} query search query
 */
export function updateQuery(newQuery) {
  query = newQuery.toUpperCase();

  // Update grid
  filterRepos();
}

/**
 * Update the selection of topics to filter repos by
 * @param {Array<string>} topics topic selection
 */
export function updateTopics(newTopics) {
  topics = newTopics;

  // Update grid
  filterRepos();
}

/**
 * Rebuild the repo grid with filters applied
 */
export function filterRepos() {
  let searchResults = [], filteredResults = [];

  // Only filter by query if there's more than one character
  if (query.length > 1) {

    // Iterate over each repo
    repos.forEach(repo => {
      let added = false;

      // Add repos that have the query in the name
      if (~repo.name.toUpperCase().indexOf(query)) {
        searchResults.push(repo);
        added = true;
      }

      // Add repos that have query in description
      if (!added && ~repo.description.toUpperCase().indexOf(query)) {
        searchResults.push(repo);
      }
    });
  } else {
    searchResults = repos;
  }

  // If topics are selected
  if (topics.length > 0) {

    // Iterate over results
    searchResults.forEach(repo => {
      let found = false;

      // Iterate over current topic filter
      topics.forEach(topic => {
        (~repo.topics.data.names.indexOf(topic)) && (found = true);
      });

      // Add repos that have topics in the filter
      (found) && (filteredResults.push(repo));
    });
  } else {
    filteredResults = searchResults;
  }

  // Sort results
  filteredResults = sortRepos(filteredResults);

  // Rebuild grid with our filtered results
  buildRepoGrid(filteredResults);
}

/**
 * Sorts repos based on current mode and direction
 */
function sortRepos(repos) {
  let sortedRepos = Array.from(repos);

  // Sort by proper function
  sortedRepos.sort(repoSorts[sortMode]);

  // Reverse
  if (!sortAscending) {
    sortedRepos.reverse();
  }

  return sortedRepos;
}

// Sort functions
let repoSorts = {};

repoSorts[sortModes.alphabetical] = (a, b) => {
  let comp = 0;

  if (a.name.toUpperCase() < b.name.toUpperCase()) {
    comp = -1;
  } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
    comp = 1;
  }

  return comp;
};

repoSorts[sortModes.commitDate] = (a, b) => {
  let comp = 0;

  let aDate = new Date(a.lastUpdated);
  let bDate = new Date(b.lastUpdated);

  if (aDate < bDate) {
    comp = -1;
  } else if (aDate > bDate) {
    comp = 1;
  }

  return comp * -1;
};
