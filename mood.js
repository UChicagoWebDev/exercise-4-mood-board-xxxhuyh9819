const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

/**
 * The event listener bound to the search request
 */
function reqListener(event) {
  const response = event.target.response
  const results = response["value"].slice(0, 18)
  const resultContainer = document.querySelector("#resultsImageContainer")

  renderResult(results, resultContainer)

  const relatedSearches = response["relatedSearches"]
  const conceptList = document.getElementById("suggestionsList")

  // if the related searches is undefined, the concepts won't be rendered
  if (relatedSearches !== undefined) {
    renderConcept(relatedSearches, conceptList)
  }
}

/**
 * An extracted function to render result images
 * @param results an array of results received
 * @param container a DOM element that contains newly created DOMs
 */
function renderResult(results, container) {
  for (let i = 0; i < results.length; i++) {
    let imageDiv = document.createElement("div");
    imageDiv.className = "resultImage"
    let image = document.createElement('img');
    image.src = results[i]["contentUrl"]
    image.alt = results[i]["name"]
    imageDiv.appendChild(image);

    // add an event listener to each image in the result panel
    image.addEventListener("click", () => {
      let board = document.getElementById("board")
      const saveImageDiv = document.createElement("div")
      saveImageDiv.className = "savedImage"
      saveImageDiv.appendChild(image)
      board.appendChild(saveImageDiv)
    })
    container.appendChild(imageDiv)
  }
}

/**
 * An extracted function to render concepts
 * @param concepts an array of concepts received
 * @param container a DOM element that contains newly created DOMs
 */
function renderConcept(concepts, container) {
  // we only want first 10 concepts
  for (let i = 0; i < Math.min(concepts.length, 10); i++) {
    let listItem = document.createElement("li")
    listItem.className = "concept"
    listItem.textContent = concepts[i].text
    container.appendChild(listItem)
  }
}

/**
 * A function to clear previous search results in a new search
 */
function clear() {
  const resultsContainer = document.getElementById("resultsImageContainer")
  resultsContainer.innerHTML = ""
  const conceptContainer = document.getElementById("suggestionsList")
  conceptContainer.innerHTML = ""
}

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  clear()

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.

  let request = new XMLHttpRequest();
  const input = document.querySelector('.form').querySelector("#searchInput").value
  const url = bing_api_endpoint + "?q=" + input

  // TODO: Construct the request object and add appropriate event listeners to
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  request.responseType = "json"

  request.addEventListener("load", reqListener);
  request.open("GET", url);
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  // TODO: Send the request
  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});

/**
 * An action listener added to the suggestions list
 * If clicking on a list item, the text content will be retrieved, applied to the search input, and perform a new search
 * If clicking on the empty space, nothing happens, since the click is deactivated (in CSS)
 */
document.querySelector("#suggestionsList").addEventListener("click", (e) => {
  const concept = e.target.textContent
  const inputField = document.querySelector('.form').querySelector("#searchInput")
  inputField.value = concept
  runSearch()
})
