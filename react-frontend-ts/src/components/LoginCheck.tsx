import React, { useEffect } from 'react';

interface LoginCheckProps {
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

const LoginCheck: React.FC<LoginCheckProps> = ({ setUserName }) => {
  useEffect(() => {
    fetch("https://zzrot.store/check", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.user_name) {
          setUserName(data.user_name);
        } else {
          console.error('No user name found in the response');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [setUserName]);

  return null;
};

export default LoginCheck;
