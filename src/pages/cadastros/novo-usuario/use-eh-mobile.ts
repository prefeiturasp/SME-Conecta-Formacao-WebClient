import { useEffect, useState } from 'react';

const MEDIA_MOBILE = '(max-width: 768px)';

const obterEhMobile = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.(MEDIA_MOBILE).matches;

export const useEhMobile = () => {
  const [ehMobile, setEhMobile] = useState(obterEhMobile);

  useEffect(() => {
    const media = window.matchMedia?.(MEDIA_MOBILE);
    if (!media) return;

    const onChange = () => setEhMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return ehMobile;
};
