import { Log } from './logger';

const STORAGE_KEY='urlShortenerData';

export const getStoredUrls=()=>
{
  try 
  {
    const data = localStorage.getItem(STORAGE_KEY);

    return data?JSON.parse(data):[];
  } 
  catch (error) 
  {
    Log('frontend', 
        'error'
        , 'utils', 
        `Error retrieving stored URLs: ${error.message}`
);
    return [];
  }
};

export const saveUrl=(urlData)=>
{
  try 
  {
    const existingUrls=getStoredUrls();

    // destructure kiya h

    const updatedUrls =[...existingUrls,urlData];
    localStorage.setItem(STORAGE_KEY,JSON.stringify(updatedUrls));
    Log('frontend', 
        'info'
        , 'utils'
        , `URL saved successfully: ${urlData.shortCode}`);


    return true;
  } catch (error) {
    Log('frontend', 
        'error'
        , 'utils'
        ,`Error saving URL: ${error.message}`);

    return false;
  }
};

export const updateUrlStats=(shortCode, clickData)=>{
  try
  {
    const urls=getStoredUrls();
    const urlIndex= urls.findIndex(url=>url.shortCode===shortCode);
    

    if(urlIndex === -1) 
    {
      Log('frontend'
        , 'error', 
        'utils', 
        `URL not found for stats update: ${shortCode}`);


      return false;
    }
    
    urls[urlIndex].clicks=urls[urlIndex].clicks||[];
    urls[urlIndex].clicks.push(clickData);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    Log('frontend', 
        'info', 
        'utils', 
        `Stats updated for URL: ${shortCode}`
    );



    return true;
  } 
  catch(error) 
  {
        Log('frontend', 
        'error', 
        'utils'
        , `Error updating URL stats: ${error.message}`);


    return false;

  }
};