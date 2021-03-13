const FILE_TYPES = ['.jpg', '.jpeg', '.png'];
const MAX_PREVIEW_PIC_SIZE = 70;

const scalePicture = (picture) => {
  const originalWidth = picture.width;
  const originalHeight = picture.height;
  let newWidth, newHeight;

  if (picture.width === picture.height) {
    picture.width = picture.height = MAX_PREVIEW_PIC_SIZE;
  } else {
    switch (true) {
      case (originalWidth > originalHeight):
        newWidth = MAX_PREVIEW_PIC_SIZE;
        newHeight = Math.round((MAX_PREVIEW_PIC_SIZE / originalWidth) * originalHeight);
        break;
      default:
        newHeight = MAX_PREVIEW_PIC_SIZE;
        newWidth = Math.round((MAX_PREVIEW_PIC_SIZE / originalHeight) * originalWidth);
    }
    picture.width = newWidth;
    picture.height = newHeight;
  }
};

const setupAllPicturesUploaders = () => {
  const avatarContainer = document.querySelector('.ad-form-header__preview');
  const avatarChooser = document.querySelector('.ad-form-header__input');
  const housePictureContainer = document.querySelector('.ad-form__photo');
  const housePictureChooser = document.querySelector('.ad-form__input');

  const setupPictureUploader = (pictureChooser, pictureContainer, pictureAltText) => {
    const onPictureChange = () => {
      const picture = pictureChooser.files[0];
      const pictureName = picture.name.toLowerCase();

      const match = () => FILE_TYPES.some((it) => pictureName.endsWith(it));

      if (match()) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const picturePreview = document.createElement('img');

          picturePreview.alt = pictureAltText;
          picturePreview.src = reader.result;
          picturePreview.addEventListener('load', () => scalePicture(picturePreview));

          pictureContainer.innerHTML = '';
          pictureContainer.style.padding = 0;
          pictureContainer.style.textAlign = 'center';
          pictureContainer.appendChild(picturePreview);
        });
        reader.readAsDataURL(picture);

      } else {
        alert('Некорректный формат изображения. Попробуйте использовать картинку с расширением .jpg, .jpeg или .png.');
      }
    };
    pictureChooser.addEventListener('change', onPictureChange);
  };
  setupPictureUploader(avatarChooser, avatarContainer, 'Аватар пользователя');
  setupPictureUploader(housePictureChooser, housePictureContainer, 'Фото жилья');
};

export {setupAllPicturesUploaders};
