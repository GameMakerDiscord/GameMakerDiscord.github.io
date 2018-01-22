// Imports
import $ from 'jquery';
import { showOverview } from './overview';

/**
 * Builds and bootstraps the repo grid
 */
export default function buildRepoGrid(repos) {

  // Clear container of all existing elements
  $('.card-container').empty();

  // Iterate over each repo
  repos.forEach(repo => {

    // Construct bootstrap card
    let cardParent = $('<div class="card text-white card-gms2">');
    let cardHeader = $('<div class="card-header">');
    let cardBody = $('<div class="card-body">');
    let cardText = $(`<p class="card-text">`);

    // Apply topic classes
    repo.topics.data.names.forEach(topic => {
      cardParent.addClass(`topic-${topic}`);
    });

    // Apply repo information to card
    cardHeader.text(repo.name);
    cardText.text(repo.description);

    // Build structure
    cardBody.append(cardText);
    cardParent.append(cardHeader);
    cardParent.append(cardBody);

    // Show overview on click
    cardParent.on('click', e => {
      showOverview(repo);
    });

    // Append to container
    $('.card-container').append(cardParent);
  });
}
