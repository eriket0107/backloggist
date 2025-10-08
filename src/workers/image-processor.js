import { isMainThread, parentPort, workerData } from "worker_threads";
import sharp from 'sharp';
import { createWriteStream } from "fs";

if (!isMainThread) {
  const { fileBuffer, filePath, quality } = workerData;

  const sharpStream = sharp(fileBuffer)
    .resize(800, 600, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality });

  const fileStream = createWriteStream(filePath);

  sharpStream
    .pipe(fileStream)
    .on('finish', () => {
      parentPort?.postMessage({ success: true, filePath });
    })
    .on('error', (error) => {
      parentPort?.postMessage({ success: false, error: error.message });
    });
}