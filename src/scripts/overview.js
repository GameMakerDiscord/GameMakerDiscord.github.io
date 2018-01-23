// Imports
import $ from 'jquery';
import showdown from 'showdown';
import { getScrollBarWidth, isBodyScrolling } from './scrollbar';
import * as config from '../config.json';

// Set up markdown processor
let markdownConverter = new showdown.Converter();
markdownConverter.setFlavor('github');
markdownConverter.setOption('emoji', true);
markdownConverter.setOption('ghMentions', config.enableReadmeGitHubMentionLinks);

/**
 * Shows the overview panel for the given repo
 */
export function showOverview(repo) {
  
  // Set repo button link
  $('#visit-repo').attr('href', repo.html_url);

  // Parse the readme
  let readmeMarkdown = atob(repo.readme);

  // Parse markdown
  let readmeHTML = markdownConverter.makeHtml(readmeMarkdown);

  // Number emoji support
  readmeHTML = readmeHTML.replace(/(:zero:)/g,  '0️⃣');
  readmeHTML = readmeHTML.replace(/(:one:)/g,   '1️⃣');
  readmeHTML = readmeHTML.replace(/(:two:)/g,   '2️⃣');
  readmeHTML = readmeHTML.replace(/(:three:)/g, '3️⃣');
  readmeHTML = readmeHTML.replace(/(:four:)/g,  '4️⃣');
  readmeHTML = readmeHTML.replace(/(:five:)/g,  '5️⃣');
  readmeHTML = readmeHTML.replace(/(:six:)/g,   '6️⃣');
  readmeHTML = readmeHTML.replace(/(:seven:)/g, '7️⃣');
  readmeHTML = readmeHTML.replace(/(:eight:)/g, '8️⃣');
  readmeHTML = readmeHTML.replace(/(:nine:)/g,  '9️⃣');
  readmeHTML = readmeHTML.replace(/(:ten:)/g,   '🔟');

  // Clear existing markdown content (just in case)
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
  $('html').css('overflow-y', 'hidden');

  // Scroll the overview to the top
  $('.overview')[0].scrollTo(0, 0);

  // Determine if we need to account for scrollbar size
  if (isBodyScrolling()) {

    // Calculate scrollbar width
    let scrollbarWidth = getScrollBarWidth();

    // Apply it to the document
    $('html').css('padding-right', `${scrollbarWidth}px`);
  }
}

/**
 * Close the overview panel
 */
export function closeOverview() {
  
  // Slide the overview out
  $('.overview').css('transform', 'translateX(100%)'); 
  
  // Fade out the cover
  $('.overview-cover').css('opacity', 0);

  // Put away the cover after it's faded (400ms)
  setTimeout(() => $('.overview-cover').css('z-index', -1), 400);

  // Clear the markdown once its gone
  setTimeout(() => $('.md').empty(), 400);

  // Enable scrolling on the homepage
  $('html').css('overflow-y', 'scroll');

  // Remove any padding due to scroll bar
  $('html').css('padding-right', '0');
}
