import Quagga from '@ericblade/quagga2';

interface DetectionResult {
  code: string;
  format: string;
}

function preprocessImage(imageData: string): string {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      // Resize image if it's too large
      const maxSize = 1000;
      let width = img.width;
      let height = img.height;
      if (width > height && width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      } else if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and preprocess the image
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Increase contrast
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const newVal = avg < 128 ? avg / 2 : Math.min(255, avg * 2);
        data[i] = data[i + 1] = data[i + 2] = newVal;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
}

export async function detectBarcode(imageData: string): Promise<DetectionResult> {
  const preprocessedImage = await preprocessImage(imageData);

  const detectionConfigs = [
    { readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader', 'code_128_reader'] },
    { readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader', 'code_128_reader'], locate: false },
    { readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader', 'code_128_reader'], halfSample: true },
  ];

  for (const config of detectionConfigs) {
    try {
      const result = await attemptDetection(preprocessedImage, config);
      if (result) {
        return result;
      }
    } catch (error) {
      console.error('Detection attempt failed:', error);
    }
  }

  throw new Error('No barcode found after multiple attempts');
}

function attemptDetection(imageData: string, config: any): Promise<DetectionResult> {
  return new Promise((resolve, reject) => {
    Quagga.decodeSingle(
      {
        decoder: {
          readers: config.readers,
          multiple: false,
        },
        locate: config.locate !== false,
        src: imageData,
        numOfWorkers: 0,
        inputStream: {
          size: 800,
        },
        halfSample: config.halfSample || false,
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true,
        },
      },
      (result: any) => {
        if (result && result.codeResult) {
          resolve({
            code: result.codeResult.code,
            format: result.codeResult.format,
          });
        } else {
          reject(new Error('No barcode found in this attempt'));
        }
      }
    );
  });
}

