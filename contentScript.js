let imageIndex = 0;
const imageUrls = [
  {
    url: "image1.gif",
    text: "Relaxes the neck pain due to continous work.",
  },
  {
    url: "image2.gif",
    text: "Increase the blood flow in your arm and reduce soreness.",
  },
  {
    url: "image3.gif",
    text: "This stretch is also known as the rhomboid upper or upper back stretch.",
  },
  {
    url: "image4.gif",
    text: "Regain your mobility and full range of motion and flexibility of the neck muscles.",
  },
  {
    url: "image5.gif",
    text: "This frees your glute muscles and relaxes the waist pain.",
  },
];

let startTime = null;
let intervalId = null;

function updateImage() {
  const image = document.getElementById("carousel-image");
  image.src = chrome.runtime.getURL(imageUrls[imageIndex].url);

  const paragraph = document.getElementById("carousel-paragraph");
  paragraph.textContent = imageUrls[imageIndex].text;
}

function getRandomImageIndex() {
  imageIndex = Math.floor(Math.random() * imageUrls.length);
}

function updateActiveTime() {
  const currentTime = new Date();
  const activeTime = Math.floor((currentTime - startTime) / 1000); // in seconds

  const hours = Math.floor(activeTime / 3600);
  const minutes = Math.floor((activeTime % 3600) / 60);
  const seconds = activeTime % 60;

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const activeTimeElement = document.getElementById("active-time");
  activeTimeElement.textContent = `Surfing Time: ${formattedTime}`;
}

document.addEventListener("DOMContentLoaded", () => {
  getRandomImageIndex();
  updateImage();

  chrome.runtime.sendMessage("getStartTime", (response) => {
    startTime = new Date(response.startTime);
    updateActiveTime();
    intervalId = setInterval(updateActiveTime, 1000); // update every second
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "nextImage") {
    getRandomImageIndex();
    updateImage();
  }
  if (message === "popupClosed") {
    clearInterval(intervalId);
  }
});
