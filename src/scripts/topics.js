// Imports
import $ from 'jquery';
import { updateTopics } from './search';

/**
 * Builds a list of topics from all available repos
 */
export function parseTopics(repos) {
  let topicList = [];

  // Iterate over each repo
  repos.forEach(repo => {

    // Iterate over topics
    repo.topics.data.names.forEach(topic => {

      // Add topic if it isn't 'gamemaker' and hasn't been added yet 
      (topic !== 'gamemaker' && !~topicList.indexOf(topic)) && topicList.push(topic);
    });
  });

  // Quick sort
  topicList.sort();

  return topicList;
}

/**
 * Builds and bootstraps the topic boxes
 */
export function buildTopics(topics) {

  // Clear topics container
  $('.topics').empty();

  // Iterate over each topic
  topics.forEach(topic => {
    
    // Construct topic checkbox
    let checkboxContainer = $('<div class="form-check form-check-inline">');
    let checkbox = $(`<input class="form-check-input topic-check-box" type="checkbox" id="${topic}-checkbox" value="${topic}">`);
    let label = $(`<label class="form-check-label" for="${topic}-checkbox">`);
    let badge = $(`<a class="badge badge-pill badge-primary">${topic}</a>`);

    // Bind checkbox change
    checkbox.change(e => {

      // Get all currently available topics
      let currentTopics = getCurrentTopicSelection();

      // Update filter topics
      updateTopics(currentTopics);
    });

    // Build structure
    label.append(badge);
    checkboxContainer.append(checkbox);
    checkboxContainer.append(label);

    // Append to topics container
    $('.topics').append(checkboxContainer);
  });
}

/**
 * Returns an array of currently selected topic filters
 */
function getCurrentTopicSelection() {
  let selectedTopics = [];

  // Loop through each topic checkbox
  $('.topic-check-box:checked').each((i, checkbox) => {
    let currentTopic = $(checkbox).val();

    // Add if not a duplicate
    (!~selectedTopics.indexOf(currentTopic)) && selectedTopics.push(currentTopic);
  });

  return selectedTopics;
}
