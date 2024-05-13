import { useEffect } from 'react';

function LoginCheck({ setUserName }) {
  useEffect(() => {
    fetch("https://zzrot.store/check", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(Response => Response.json())
      .then(data => {
        setUserName(data.user_name);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [setUserName]);

  return null;
}

export default LoginCheck;