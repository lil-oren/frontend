import axios from 'axios';
import { Utils } from '@/utils';

async function imageUploadder(file: File | undefined) {
  const formData = new FormData();
  if (file !== undefined) {
    formData.append('file', file);
  }
  formData.append('upload_preset', 'liloren');
  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dzxnc4h4n/image/upload',
      formData,
    );
    return response.data.url;
  } catch (error) {
    Utils.handleGeneralError(error);
    throw error;
  }
}

export default imageUploadder;
