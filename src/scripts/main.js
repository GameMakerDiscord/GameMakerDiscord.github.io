// Load the bootstrap stack
import $ from 'jquery';
import Popper from 'popper.js';
import bootstrap from 'bootstrap';

// Markdown processor
import marked from 'marked';

// Local imports
import loadData from './api';

// Page setup
(async () => {
  let org;

  // Attempt to load org data
  try {
    org = await loadData();
  } catch(e) {
    // Handle load error
    console.log('Error loading data!\n\n' + e);
  }

  console.log(org);

  // Build the initial grid of repos
  buildRepoGrid(org.repos);

  // Bind overview close button
  $('#close-overview').click(e => closeOverview());

  // Bind overview cover to close
  $('.overview-cover').click(e => closeOverview());
  
})();

/**
 * Builds and bootstraps the repo grid
 */
function buildRepoGrid(repos) {

  // Clear container of all existing elements
  $('.card-container').empty();

  let cards = [];

  // Iterate over each repo
  repos.forEach(repo => {

    // Construct bootstrap card
    let cardParent = $('<div class="card text-white card-gms2">');
    let cardHeader = $('<div class="card-header">');
    let cardBody = $('<div class="card-body">');
    let cardText = $(`<p class="card-text">`);

    // Apply repo information to card
    cardHeader.text(repo.name);
    cardText.text(repo.description);

    // Build structure
    cardBody.append(cardText);
    cardParent.append(cardHeader);
    cardParent.append(cardBody);

    cardParent.on('click', e => {
      showOverview(repo);
    });

    cards.push(cardParent);
  });

  // Append cards to page
  cards.forEach(card => {
    $('.card-container').append(card);
  });
}

/**
 * Shows the overview panel for the given repo
 */
function showOverview(repo) {
  
  // Set repo button link
  $('#visit-repo').attr('href', repo.html_url);

  // Parse the readme
  let readmeMarkdown = atob(repo.readme);

  // Parse markdown
  let readmeHTML = marked(readmeMarkdown);

  // Clear existing markdown content
  $('.md').empty();

  // Append markdown to the page
  $('.md').html(readmeHTML);

  // Bring cover to foreground
  $('.overview-cover').css('z-index', 1);

  // Fade it in
  $('.overview-cover').css('opacity', 0.5);

  // Slide the overview in
  $('.overview').css('transform', 'translateX(0)');

  // Prevent the body from scrolling
  $('body').css('overflow', 'hidden');
  $('html').css('overflow', 'hidden');
}

function closeOverview() {
  
  // Slide the overview out
  $('.overview').css('transform', 'translateX(100%)'); 
  
  // Fade out the cover
  $('.overview-cover').css('opacity', 0);

  // Put away the cover after it's faded (400ms)
  setTimeout(() => $('.overview-cover').css('z-index', -1), 400);

  // Enable scrolling on the homepage
  $('body').css('overflow', 'auto');
  $('html').css('overflow', 'auto');
}
