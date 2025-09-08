import {Log} from './logger';

export const isValidUrl=(url)=>{
  try 
  {
    // nya objc crreate kiya then return ture if valid
    new URL(url);

    return true;
  } catch (error) {
    // check is log valid no not in this way by me
    Log('frontend', 'warn', 'utils', `Invalid URL format: ${url}`);

    return false;
  }
};

export const isValidShortCode = (code) => {

  const isValid = /^[a-zA-Z0-9_-]{1,20}$/.test(code);
  if (!isValid) {
    Log('frontend', 
        'warn', 
        'utils', 
        `Invalid shortcode format: ${code}`
    );
  }


  return isValid;
};

export const isShortCodeUnique = (code) => {
  const urls=JSON.parse(localStorage.getItem('urlShortenerData')||'[]');


  const isUnique=!urls.some(url => url.shortCode === code);


  if (!isUnique) {
    Log('frontend', 
        'warn', 
        'utils', 
        `Shortcode already exists: ${code}`
    );
    
  }
  return isUnique;
};