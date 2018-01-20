// Load the bootstrap stack
import $ from 'jquery';
import Popper from 'popper.js';
import bootstrap from 'bootstrap';

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

  buildRepoGrid(org.repos);
})();

/**
 * Builds and bootstraps the repo grid
 */
function buildRepoGrid(repos) {

  // Clear container of all existing elements
  $('.card-columns').empty();

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
      window.open(repo.html_url, '_blank');
    });

    cards.push(cardParent);
  });

  // Append cards to page
  cards.forEach(card => {
    $('.card-columns').append(card);
  });
}
