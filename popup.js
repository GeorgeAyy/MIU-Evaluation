console.log("Popup script loaded");

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  const slider = document.getElementById("myRange");
  // Hide the "Stop" button initially
  stopButton.style.display = "none";

  // Retrieve the button state from chrome.storage
  chrome.storage.local.get(["buttonState", "sliderValue"], function (result) {
    const buttonState = result.buttonState;
    const savedSliderValue = result.sliderValue;
    if (buttonState === "start") {
      startButton.style.display = "none";
      stopButton.style.display = "block";
    } else {
      startButton.style.display = "block";
      stopButton.style.display = "none";
    }
    if (savedSliderValue) {
      slider.value = savedSliderValue;
    }
  });

  // Function to start evaluation
  function startEvaluation() {
    startButton.style.display = "none"; // Hide the "Start" button
    stopButton.style.display = "block"; // Show the "Stop" button
    chrome.storage.local.set({ buttonState: "start" }); // Save button state
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "START_EVALUATION" });
    });
  }

  // Function to stop evaluation
  function stopEvaluation() {
    startButton.style.display = "block"; // Show the "Start" button
    stopButton.style.display = "none"; // Hide the "Stop" button
    chrome.storage.local.set({ buttonState: "stop" }); // Save button state
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "STOP_EVALUATION" });
    });
  }

  // Listen for the click event on the "Start" button in the popup
  startButton.addEventListener("click", startEvaluation);

  // Listen for the click event on the "Stop" button in the popup
  stopButton.addEventListener("click", stopEvaluation);

  slider.addEventListener("input", updateEvaluation);
  function updateEvaluation() {
    const rating = slider.value;
    console.log("Rating selected:", rating);
    // Save the slider value to chrome.storage
    chrome.storage.local.set({ sliderValue: rating });
    // Send a message containing the slider value to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "UPDATE_EVALUATION",
        rating,
      });
    });
  }
});
