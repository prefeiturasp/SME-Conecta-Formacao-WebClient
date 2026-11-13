import { useEffect, useState } from 'react';

const MEDIA_MOBILE = '(max-width: 768px)';

const obterEhMobile = () => !!globalThis.matchMedia?.(MEDIA_MOBILE).matches;

export const useEhMobile = () => {
  const [ehMobile, setEhMobile] = useState(obterEhMobile);

  useEffect(() => {
    const media = globalThis.matchMedia?.(MEDIA_MOBILE);
    if (!media) return;

    const onChange = () => setEhMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return ehMobile;
};
