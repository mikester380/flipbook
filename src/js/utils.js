export const preloadAssets = function (asset) {
  return new Promise(function (resolve) {
    const img = new Image();
    img.src = asset;
    img.addEventListener("load", () => resolve());
  });
};
