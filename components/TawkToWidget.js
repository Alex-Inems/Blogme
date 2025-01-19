'use client';

import { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    // Tawk.to script injection
    var Tawk_API = Tawk_API || {};
    // Removed `Tawk_LoadStart` since it's unused and causes a linting error
    (function () {
      var s1 = document.createElement('script');
      s1.async = true;
      s1.src = 'https://embed.tawk.to/678d82e43a84273260716256/1ii0cek4k';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      var s0 = document.getElementsByTagName('script')[0];
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return null; // This component doesn't render anything visible
};

export default TawkToWidget;
