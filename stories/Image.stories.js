// MyComponent.stories.js

import React from 'react';
import imageFile from '../src/assets/Adventure_icon.svg';
import image1 from '../src/assets/maxresdefault1.png';
import image2 from '../src/assets/maxresdefault2.png';
import image3 from '../src/assets/maxresdefault3.png';

export default {
  title: 'Image',
};

const image = {
  src: imageFile,
  alt: 'my image',
};

const imageS = {
  src1: image1,
  src2: image2,
  src3: image3,
  alt: 'my image',
};

export const ThumbnailImage = () => (
  <img 
    src={image.src} 
    alt={image.alt} 
    className={[`storybook-image--app-thumbnail`]}
  />
);


export const ScreenImages = () => (  
  <React.Fragment>
    <img src={imageS.src1} alt={imageS.alt} className={[`storybook-image--app-thumbnail-gallery-item mr-4`]} />
    <img src={imageS.src2} alt={imageS.alt} className={[`storybook-image--app-thumbnail-gallery-item mr-4`]} />
    <img src={imageS.src3} alt={imageS.alt} className={[`storybook-image--app-thumbnail-gallery-item`]} />
  </React.Fragment>  
);