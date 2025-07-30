import { useState, useEffect } from 'react';

export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'large';

interface ScreenSizeConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  large: number;
}

const defaultConfig: ScreenSizeConfig = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
  large: 1536,
};

export const useScreenSize = (config: ScreenSizeConfig = defaultConfig) => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('mobile');
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateScreenSize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);

      if (newWidth >= config.large) {
        setScreenSize('large');
      } else if (newWidth >= config.desktop) {
        setScreenSize('desktop');
      } else if (newWidth >= config.tablet) {
        setScreenSize('tablet');
      } else {
        setScreenSize('mobile');
      }
    };

    // Initial check
    updateScreenSize();

    // Add event listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, [config]);

  return {
    screenSize,
    width,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    isLarge: screenSize === 'large',
  };
};
