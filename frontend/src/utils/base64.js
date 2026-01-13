export default function convertTobase64(file) {
  if (!file || !(file instanceof Blob) || file.size === 0) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result); // base64 string (data URL)
    reader.onerror = () => resolve(null);

    reader.readAsDataURL(file);
  });
}