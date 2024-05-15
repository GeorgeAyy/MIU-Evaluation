console.log("Content script loaded");

let running = false; // Flag to indicate whether the extension is running
let sliderValue = 3;
// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_EVALUATION") {
    console.log("Received START_EVALUATION message");
    running = true; // Start the extension
    evaluateAndMark(); // Start evaluating and marking
  } else if (message.type === "STOP_EVALUATION") {
    console.log("Received STOP_EVALUATION message");
    running = false; // Stop the extension
  } else if (message.type === "UPDATE_EVALUATION") {
    console.log("Received UPDATE_EVALUATION message");
    sliderValue = message.rating; // Store the slider value
    console.log("Slider value:", sliderValue);
    markRadioButtons(); // Call the function to mark radio buttons with the slider value
  }
});

// Function to continuously evaluate and mark radio buttons
function evaluateAndMark() {
  if (running) {
    console.log("Evaluating and marking radio buttons");
    const evaluateButtons = document.querySelectorAll(
      ".btn.green, .btn-primary"
    );
    evaluateButtons.forEach((button) => {
      //if (!isInHiddenTd(button)) {
      // Check if the button is not inside a hidden <td>
      button.click(); // Click the evaluate button
      markRadioButtons(); // Mark the radio buttons
      //}
    });
    setTimeout(evaluateAndMark, 1500);
  }
}

// Function to check if an element is inside a hidden <td>
function isInHiddenTd(element) {
  let parentElement = element.parentElement;
  while (parentElement) {
    if (
      parentElement.tagName === "TD" &&
      parentElement.classList.contains("ng-hide")
    ) {
      return true; // Element is inside a hidden <td>
    }
    parentElement = parentElement.parentElement;
  }
  return false; // Element is not inside a hidden <td>
}

// Function to mark the first radio button input within each ng-repeat block
function markRadioButtons() {
  console.log("Marking radio buttons");
  const ngRepeatDivs = document.querySelectorAll(".portlet-body > .ng-scope");
  ngRepeatDivs.forEach((ngRepeatDiv) => {
    const radioButton = ngRepeatDiv.querySelectorAll("input[type='radio']");
    if (radioButton) {
      radioButton[sliderValue - 1].click();
    } else {
      console.log("No radio button found in div:", ngRepeatDiv);
    }
  });
}

//<div ng-repeat="item in Questions" class="ng-scope">
