// Load the bootstrap stack
import $ from 'jquery';
import Popper from 'popper.js';
import bootstrap from 'bootstrap';

// Local imports
import { showOverview, closeOverview } from './overview';
import { parseTopics, buildTopics } from './topics';
import { updateRepos, updateQuery, filterRepos, setMode, sortModes, setAscending, sortMode, sortAscending } from './search';
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

  // Sort mode toggle function
  let sortModeHandler = e => {
    setMode(sortMode === sortModes.alphabetical ? sortModes.commitDate : sortModes.alphabetical);

    let selectedElement = sortMode === sortModes.alphabetical ? '#filter-alpha' : '#filter-commit';
    let deselectedElement = sortMode !== sortModes.alphabetical ? '#filter-alpha' : '#filter-commit';

    $(selectedElement).removeClass('btn-outline-secondary').addClass('btn-primary');
    $(deselectedElement).addClass('btn-outline-secondary').removeClass('btn-primary');
  }

  // Apply sort toggle handler
  $('#filter-alpha').click(sortModeHandler);
  $('#filter-commit').click(sortModeHandler);

  // Sort direction toggle function
  let sortDirectionHandler = e => {
    setAscending(sortAscending ? false : true);

    let selectedElement = sortAscending ? '#filter-asc' : '#filter-des';
    let deselectedElement = (!sortAscending) ? '#filter-asc' : '#filter-des';

    $(selectedElement).removeClass('btn-outline-secondary').addClass('btn-primary');
    $(deselectedElement).addClass('btn-outline-secondary').removeClass('btn-primary');
  }

  // Apply sort direction toggle handler
  $('#filter-asc').click(sortDirectionHandler);
  $('#filter-des').click(sortDirectionHandler);

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
