// API urls
const urls = {
  repos: 'https://api.github.com/orgs/GameMakerDiscord/repos'
};

// Load the bootstrap stack
import $ from 'jquery';
import Popper from 'popper.js';
import bootstrap from 'bootstrap';

(async () => {

  // Attempt to connect to API
  try {
    let repos = await getRepos();
    buildLayout(repos);
  } catch (e) {
    console.log(e);
    alert('Could not connect to GitHub API!');
  }
})();

function buildLayout(repos) {
  console.log(repos);

  let mediaElements = [];

  repos.forEach(repo => {
    let mediaParent = $('<div class="media mt-4">');
    let mediaBody = $('<div class="media-body">');
    let mediaHeader = $('<h5 class="mt-0">');
    let mediaHeaderLink = $(`<a href="${repo.html_url}">`);

    mediaHeaderLink.text(repo.name);
    mediaHeader.append(mediaHeaderLink);
    mediaBody.append(mediaHeader);
    mediaBody.append(repo.description);
    mediaParent.append(mediaBody);

    mediaElements.push(mediaParent);
  });

  mediaElements.forEach(element => {
    $('.container').append(element);
  });
}

/**
 * Fetches organization repos
 */
function getRepos() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: urls.repos,
      type: 'GET',
      beforeSend: xhr => {
        xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
      },
      success: s => resolve(s),
      error: e => reject(e)
    });
  });
}
