/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} imageSrc - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */

 const createImage = (url) =>
 new Promise((resolve, reject) => {
     const image = new Image();
     image.addEventListener("load", () => resolve(image));
     image.addEventListener("error", (error) => reject(error));
     image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
     image.src = url;
 });

function getRadianAngle(degreeValue) {
 return (degreeValue * Math.PI) / 180;
}

const TO_RADIANS = Math.PI / 180

export async function getCroppedImg2(
    image,
    // canvas,
    crop,
    scale = 1,
    rotate = 0,
  ) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')
  
    if (!ctx) {
      throw new Error('No 2d context')
    }
  
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio
    // const pixelRatio = 1
  
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
  
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'
  
    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY
  
    const rotateRads = rotate * TO_RADIANS
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2
  
    ctx.save()
  
    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY)
    // 3) Rotate around the origin
    ctx.rotate(rotateRads)
    // 2) Scale the image
    ctx.scale(scale, scale)
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    )
  
    // ctx.restore()

    return canvas.toDataURL("image/jpeg")
}

// export default async function getCroppedImg(imageSrc, crop,  scale = 1,
//     rotate = 0,) {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement('canvas');
//     const pixelRatio = window.devicePixelRatio;
//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;
//     const ctx = canvas.getContext('2d');

//     canvas.width = crop.width * pixelRatio * scaleX;
//     canvas.height = crop.height * pixelRatio * scaleY;

//     // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
//     // ctx.imageSmoothingQuality = 'high';

//     // ctx.drawImage(
//     //   image,
//     //   crop.x * scaleX,
//     //   crop.y * scaleY,
//     //   crop.width * scaleX,
//     //   crop.height * scaleY,
//     //   0,
//     //   0,
//     //   crop.width * scaleX,
//     //   crop.height * scaleY
//     // );
//     ctx.scale(pixelRatio, pixelRatio)
//     ctx.imageSmoothingQuality = 'high'
  
//     const cropX = crop.x * scaleX
//     const cropY = crop.y * scaleY
  
//     const rotateRads = rotate * TO_RADIANS
//     const centerX = image.naturalWidth / 2
//     const centerY = image.naturalHeight / 2

//     ctx.save()

//   // 5) Move the crop origin to the canvas origin (0,0)
//   ctx.translate(-cropX, -cropY)
//   // 4) Move the origin to the center of the original position
//   ctx.translate(centerX, centerY)
//   // 3) Rotate around the origin
//   ctx.rotate(rotateRads)
//   // 2) Scale the image
//   ctx.scale(scale, scale)
//   // 1) Move the center of the image to the origin (0,0)
//   ctx.translate(-centerX, -centerY)
//   ctx.drawImage(
//     image,
//     0,
//     0,
//     image.naturalWidth,
//     image.naturalHeight,
//     0,
//     0,
//     image.naturalWidth,
//     image.naturalHeight,
//   )

//   ctx.restore()
//     // canvas.width = crop.width;
//     // canvas.height = crop.height;

//     // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
//     // ctx.imageSmoothingQuality = 'high';

//     // ctx.drawImage(
//     //   image,
//     //   crop.x,
//     //   crop.y,
//     //   crop.width,
//     //   crop.height,
//     //   0,
//     //   0,
//     //   crop.width,
//     //   crop.height
//     // );

// return canvas.toDataURL("image/jpeg")
//     return new Promise((resolve, reject) => {
//         canvas.toDataURL("image/jpeg")
//     //   canvas.toBlob(
//     //     (blob) => {
//     //       if (!blob) {
//     //         //reject(new Error('Canvas is empty'));
//     //         console.error('Canvas is empty');
//     //         return;
//     //       }
//     //       blob.name = fileName;
//     //       window.URL.revokeObjectURL(this.fileUrl);
//     //       this.fileUrl = window.URL.createObjectURL(blob);
//     //       resolve(this.fileUrl);
//     //     },
//     //     'image/jpeg',
//     //     1
//     //   );
//     });
//   }



export default async function getCroppedImg(image, crop) {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    return canvas.toDataURL("image/jpeg")
    // return new Promise((resolve, reject) => {
    //   canvas.toBlob(
    //     (blob) => {
    //       if (!blob) {
    //         //reject(new Error('Canvas is empty'));
    //         console.error('Canvas is empty');
    //         return;
    //       }
    //       blob.name = fileName;
    //       window.URL.revokeObjectURL(this.fileUrl);
    //       this.fileUrl = window.URL.createObjectURL(blob);
    //       resolve(this.fileUrl);
    //     },
    //     'image/jpeg',
    //     1
    //   );
    // });
  }

// export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
//  const image = await createImage(imageSrc);
//  const canvas = document.createElement("canvas");
//  const ctx = canvas.getContext("2d");

//  const maxSize = Math.max(image.width, image.height);
//  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
// // const safeArea = 320

//  // set each dimensions to double largest dimension to allow for a safe area for the
//  // image to rotate in without being clipped by canvas context
//  canvas.width = safeArea;
//  canvas.height = safeArea;

// // canvas.width = 320
// // canvas.height = 200

//  // translate canvas context to a central location on image to allow rotating around the center.
//  ctx.translate(safeArea / 2, safeArea / 2);
//  ctx.rotate(getRadianAngle(rotation));
//  ctx.translate(-safeArea / 2, -safeArea / 2);

// //  draw rotated image and store data.
//  ctx.drawImage(
//      image,
//      safeArea / 2 - image.width * 0.5,
//      safeArea / 2 - image.height * 0.5
//  );

// // ctx.drawImage(
// //     image,
// //     pixelCrop.x,
// //     pixelCrop.y,
// //     pixelCrop.width,
// //     pixelCrop.height,
// //     0,
// //     0,
// //     320,
// //     200
// //   )

//  const data = ctx.getImageData(0, 0, safeArea, safeArea);
// // const data = ctx.getImageData(0, 0, 320, 200);

//  // set canvas width to final desired crop size - this will clear existing context
//  canvas.width = pixelCrop.width;
//  canvas.height = pixelCrop.height;
// // canvas.width = 320;
// // canvas.height = 200;

//  // paste generated rotate image with correct offsets for x,y crop values.
//  ctx.putImageData(
//      data,
//      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
//      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
//  );

//  // As Base64 string
//  return canvas.toDataURL("image/jpeg");
// //  return canvas;
// }

export const generateDownload = async (imageSrc, crop) => {
 if (!crop || !imageSrc) {
     return;
 }

 const canvas = await getCroppedImg(imageSrc, crop);
//  return canvas

 canvas.toBlob(
     (blob) => {
         const previewUrl = window.URL.createObjectURL(blob);

         const anchor = document.createElement("a");
         anchor.download = "image.jpeg";
         anchor.href = URL.createObjectURL(blob);
        //  anchor.click();

         window.URL.revokeObjectURL(previewUrl);
     },
     "image/jpeg",
     0.8
 );
};