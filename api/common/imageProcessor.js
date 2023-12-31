import Jimp from 'jimp';

const imageProcessor = async (image, type) => {

  let resultImage = image;

  if(type === 'logo') {
    let buffer = Buffer.from(image, 'base64');

    let processingimage = await Jimp.read(buffer);
    
    // Crea una nuova immagine trasparente con la stessa larghezza e altezza dell'immagine originale
    let mask = new Jimp(processingimage.bitmap.width, processingimage.bitmap.height);
    
    // Disegna un cerchio bianco (#FFFFFF) al centro della maschera
    const radius = Math.min(processingimage.bitmap.width, processingimage.bitmap.height) / 2;
    const centerX = processingimage.bitmap.width / 2;
    const centerY = processingimage.bitmap.height / 2;
    for (let x = 0; x < mask.bitmap.width; x++) {
      for (let y = 0; y < mask.bitmap.height; y++) {
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        if (distanceFromCenter <= radius) {
          mask.setPixelColor(Jimp.rgbaToInt(255, 255, 255, 255), x, y);
        }
      }
    }
    
    // Applica la maschera all'immagine originale
    processingimage.mask(mask, 0, 0);
    
    // Converte l'immagine modificata in un buffer PNG
    let pngBuffer = await processingimage.getBufferAsync(Jimp.MIME_PNG);
    
    // Converte il buffer in una stringa base64
    let base64Image = pngBuffer.toString('base64');
    
    // Ora 'base64Image' contiene l'immagine modificata come stringa base64
    resultImage = base64Image;

  } else if (type === 'full') {

    let buffer = Buffer.from(image, 'base64');

    let processingimage = await Jimp.read(buffer);
    // Duplica l'immagine
    let secondImage = processingimage.clone();
  
    // Ruota la seconda immagine di 180 gradi
    processingimage.rotate(180);
    secondImage.rotate(180);
  
    // Ridimensiona le immagini per occupare metà dell'immagine finale
    processingimage.resize(Jimp.AUTO, processingimage.bitmap.width / 2);
    secondImage.resize(Jimp.AUTO, secondImage.bitmap.width / 2);
  
    // Crea un'immagine vuota con la stessa larghezza e il doppio dell'altezza
    let finalImage = new Jimp(processingimage.bitmap.width * 2, processingimage.bitmap.height);
  
    // Posiziona le immagini nella metà superiore e inferiore dell'immagine finale
    finalImage.composite(processingimage, 0, 0);
    finalImage.composite(secondImage, processingimage.bitmap.width, 0);

    // Converte l'immagine risultante in un buffer
    const resultBuffer = await finalImage.getBufferAsync(Jimp.AUTO);

    // Converte il buffer in una stringa base64
    const base64Image = resultBuffer.toString('base64');
    
    // Ora 'base64Image' contiene l'immagine modificata come stringa base64
    resultImage = base64Image;
  }

  return resultImage;
}

export default imageProcessor;