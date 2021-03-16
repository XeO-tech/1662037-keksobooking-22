const FILE_TYPES = ['.jpg', '.jpeg', '.png'];
const MAX_PREVIEW_PIC_SIZE = 70;

const avatarContainerNode = document.querySelector('.ad-form-header__preview');
const housePictureContainerNode = document.querySelector('.ad-form__photo');
let defaultAvatarNode = avatarContainerNode.querySelector('img');

const scalePicture = (picture) => {
  const originalWidth = picture.width;
  const originalHeight = picture.height;
  let newWidth, newHeight;

  if (originalWidth  === originalHeight) {
    newWidth = newHeight = MAX_PREVIEW_PIC_SIZE;
  } else if (originalWidth > originalHeight){
    newWidth = MAX_PREVIEW_PIC_SIZE;
    newHeight = Math.round((MAX_PREVIEW_PIC_SIZE / originalWidth) * originalHeight);
  } else {
    newHeight = MAX_PREVIEW_PIC_SIZE;
    newWidth = Math.round((MAX_PREVIEW_PIC_SIZE / originalHeight) * originalWidth);
  }
  picture.width = newWidth;
  picture.height = newHeight;
};
const setupAllPicturesUploaders = () => {
  const avatarInputField = document.querySelector('.ad-form-header__input');
  const housePictureInputField = document.querySelector('.ad-form__input');

  const setupUploader = (pictureChooser, pictureContainer, pictureAltText) => {
    const onChange = () => {
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
    pictureChooser.addEventListener('change', onChange);
  };
  setupUploader(housePictureInputField, housePictureContainerNode, 'Фото жилья');
  setupUploader(avatarInputField, avatarContainerNode, 'Аватар пользователя');
};
const clearAllPicturesPreview = () => {
  avatarContainerNode.innerHTML = '';
  avatarContainerNode.appendChild(defaultAvatarNode);
  avatarContainerNode.removeAttribute('style');
  housePictureContainerNode.innerHTML = '';
  housePictureContainerNode.removeAttribute('style');
};
export {setupAllPicturesUploaders, clearAllPicturesPreview};
