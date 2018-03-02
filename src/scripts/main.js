// Load the bootstrap stack
import $ from 'jquery';
import Popper from 'popper.js';
import bootstrap from 'bootstrap';

// Compile babel polyfill
import 'babel-polyfill';

// Local imports
import { showOverview, closeOverview } from './overview';
import { parseTopics, buildTopics } from './topics';
import { updateRepos, updateQuery, filterRepos, setMode, sortModes, setAscending, sortMode, sortAscending } from './search';
import { getCurrentPath } from './router';
import buildRepoGrid from './grid';
import loadData from './api';

// Config
import * as config from '../config.json';

// Global organization information
let org;

// List of all topics
let topics;

// Page setup
(async () => {
  
  // Attempt to load org data
  try {
    org = await loadData();
  } catch(e) {

    // Log load error
    console.log('Error loading data!\n\n' + e);

    return;
  }

  // Pass along repos to search module
  updateRepos(org.repos);

  // Build a list of all topics
  topics = parseTopics(org.repos);

  // Create topic boxes
  buildTopics(topics);

  // Build the initial grid of repos
  buildRepoGrid(org.repos);

  // Set up event handlers
  bindInputs();

  // Initial sort
  filterRepos();
  
  // Hide the loading screen
  hideLoadingScreen();

  // Open a repo if the url hash contains one
  openHashedRepo();
})();

/**
 * Sets up event handlers for common page elements
 */
function bindInputs() {

  // Bind logo links
  $('.logo-link').click(e => {
    e.preventDefault();

    // Show the about readme
    showOverview(window.aboutRepo);
  });

  // Bind overview close button
  $('#close-overview').click(e => closeOverview());

  // Bind overview cover to close
  $('.overview-cover').click(e => closeOverview());

  // Bind search input
  $('#search').on('input', e => {
    let query = $(e.target).val();
    updateQuery(query);
  });

  // Sort mode button
  $('#filter-mode').click(e => {

    // Toggle mode
    setMode(sortMode === sortModes.alphabetical ? sortModes.commitDate : sortModes.alphabetical);

    // Change text
    $(e.target).text(sortMode === sortModes.alphabetical ? 'Alphabetical' : 'Commit Date');
  });

  // Sort direction button
  $('#filter-direction').click(e => {

    // Get svg icon reference
    // NOTE: using $(e.target) breaks after toggling mode, so explicitely select #filter-direction
    let svg = $('#filter-direction').find('svg');
    
    // Toggle direction
    setAscending(sortAscending ? false : true);

    // Change icon
    if (sortAscending) {
      svg.removeClass('fa-sort-amount-down').addClass('fa-sort-amount-up');
    } else {
      svg.addClass('fa-sort-amount-down').removeClass('fa-sort-amount-up');
    }
  });

  // Bind markdown anchors
  $('.overview').on('click', 'a', function(e) {
    let href = $(this).attr('href');

    // If this link is a hash link
    if (href[0] === '#') {
      
      // Search for element
      let target = $(href);

      // If found
      if (target.length) {

        // Scroll there
        $('.overview').animate({
          scrollTop: target[0].offsetTop
        }, 400);

        // Prevent navigation
        e.preventDefault();
      }
    }
  });
}

/**
 * Dismisses the loading screen
 */
function hideLoadingScreen() {

  // Fade out the loading screen
  $('.loading-container').css('opacity', 0);

  // Remove the loading screen after its gone
  setTimeout(() => $('.loading-container').remove(), 400);
}

/**
 * Opens a repo if the url contains a repo name after the hash
 */
function openHashedRepo() {
  let currentRoute = getCurrentPath();

  if (!currentRoute.length) return;

  org.repos.some((repo) => {
    if (repo.name === currentRoute) {
      showOverview(repo);
    }
  });
}
