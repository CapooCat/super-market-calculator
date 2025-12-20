import imageCompression from "browser-image-compression";

const compressImage = async (blob: Blob) => {
  const file = new File([blob], "name", {
    type: "image/webp",
  });

  const controller = new AbortController();

  const options = {
    initialQuality: 0.9,
    fileType: "image/webp",
    useWebWorker: true,
    signal: controller.signal,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return await imageCompression.getDataUrlFromFile(compressedFile);
  } catch {
    return undefined;
  }
};

export default compressImage;
