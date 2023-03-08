import { preloadAssets } from "./utils.js";
import { imgBaseUrl } from "./data.js";

const canvas = document.querySelector(".flipbook");
const html = document.querySelector("html");

const supportsCanvas = !!canvas.getContext;
const frameCount = 95;

if (supportsCanvas) {
  const ctx = canvas.getContext("2d");
  let cachedCurrentFrame = 1;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  //returns the img url
  const getFrame = function (index) {
    return `${imgBaseUrl}${index < 10 ? `000${index}` : `00${index}`}.webp`;
  };

  const updateFrame = function (index) {
    const img = new Image();
    img.src = getFrame(index);
    let aspectRatioHeight = (canvas.width * 1080) / 1920;
    let imgPosY = canvas.height / 2 - aspectRatioHeight / 2;

    ctx.drawImage(img, 0, imgPosY, canvas.width, aspectRatioHeight);
  };

  //preload images: returns a list of promises
  const promisedImgs = new Array(frameCount).fill(0).map((_, i) => {
    const imgUrl = getFrame(i + 1);
    return preloadAssets(imgUrl);
  });

  //checks if all the promises are fulfilled (all images loaded).
  Promise.all(promisedImgs).then(function () {
    //
    //draws the first frame to the canvas
    updateFrame(1);

    window.addEventListener("scroll", function (e) {
      const currentScrollY = html.scrollTop;
      const maxScrollY = html.scrollHeight - html.clientHeight;
      const scrollProgress = (currentScrollY / maxScrollY) * 100;
      const currentFrame = Math.floor((scrollProgress / 100) * frameCount);

      cachedCurrentFrame = currentFrame;

      requestAnimationFrame(() => updateFrame(currentFrame));
    });

    //NOT REALLY NECESSARY: JUST FOR RESPONSIVENESS

    //using this api wasn't really necessary. there is an easier way to solve this, just wanted to see how it works, lol
    //
    //checks if the canvas's size changed and redraws the current frame
    const observer = new MutationObserver(function (list, observer) {
      list.forEach((item) => {
        if (item.attributeName === "width" || item.attributeName === "height") {
          updateFrame(cachedCurrentFrame);
        }
      });
    });

    observer.observe(canvas, { attributes: true });
  });
}
