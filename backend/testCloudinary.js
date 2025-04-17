const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dzgfwlrv4',
  api_key: '281737822743871',
  api_secret: 'Zji3Wb-eWM-qLnKTXbs60h005EA'
});

cloudinary.uploader.destroy('cloud/mebs6jbexipa3hktgqfk', (error, result) => {
  if (error) {
    console.error('Error deleting image:', error);
  } else {
    console.log('Deletion result:', result);
  }
});