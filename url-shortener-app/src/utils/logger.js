const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhc21pdHNyaXZhc3RhdmEwMTdAZ21haWwuY29tIiwiZXhwIjoxNzU3MzE5ODg4LCJpYXQiOjE3NTczMTg5ODgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI5YjNkNDNlYi1hMmJjLTQxNTEtYWY4Ni1lZGVlZThmNzkxYTIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhc21pdCBzcml2YXN0YXZhIiwic3ViIjoiYTg0NGY1YWEtNTJkMS00Y2Q1LWI3Y2QtZjBkY2JmN2Y2ZmYzIn0sImVtYWlsIjoiYXNtaXRzcml2YXN0YXZhMDE3QGdtYWlsLmNvbSIsIm5hbWUiOiJhc21pdCBzcml2YXN0YXZhIiwicm9sbE5vIjoiMjIwMTY0MTUyMDA1MiIsImFjY2Vzc0NvZGUiOiJzQVdUdVIiLCJjbGllbnRJRCI6ImE4NDRmNWFhLTUyZDEtNGNkNS1iN2NkLWYwZGNiZjdmNmZmMyIsImNsaWVudFNlY3JldCI6IkZZTmVyS0h3d25hd3BkV1MifQ.XUDdjjajek---tT_rek5ZyaH2ThFc88AcHZsNNIK-2Y'; 

export const Log = async (stack, level, packageName, message) => {
  const allowedStacks=['backend', 'frontend'];

  const allowedLevels = ['debug','info','warn','error','fatal'];

  const allowedPackages = 
  {
    backend: ['cache','controller','cron_job','db','domain','handler','repository','route','service']
    ,frontend: ['api','component','hook','page','state','style'],
    common: ['auth','config','middleware','utils']
  };


  if(!allowedStacks.includes(stack)//===false
) {
    console.error('Invalid stack value');

    return;
  }

  if(!allowedLevels.includes(level)//===false
) {
    console.error('Invalid level value');

    return;
  }

  let allowedForStack = [...allowedPackages[stack], ...allowedPackages.common];
  if(!allowedForStack.includes(packageName)//==false
) {
    console.error('Invalid package value for the selected stack');

    return;
  }

  const logData=
{
    stack,
    level,
    package: packageName,
    message
  };

  try
  {
    const response=await fetch(LOG_API_URL,{
      method:'POST',

      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },

      body:JSON.stringify(logData)
    });

    if(!response.ok){
      throw new Error('Log API request failed');
    }

    const data=await response.json();
    console.log('Log created successfully:',data.logID);
  } 
  catch(error) 
  {
    console.error('Error sending log:',error);
  }
};