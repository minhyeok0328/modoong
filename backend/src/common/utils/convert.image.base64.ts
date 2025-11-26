import axios from 'axios';

export async function convertImageToBase64(
  imageUrl: string,
): Promise<string | null> {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data, 'binary');
    const base64 = buffer.toString('base64');
    const mimeType = response.headers['content-type'] || 'image/jpeg';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}
