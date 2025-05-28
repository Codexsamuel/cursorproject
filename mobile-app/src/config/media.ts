export const mediaConfig = {
  videos: {
    homeBackground: 'https://res.cloudinary.com/dko5sommz/video/upload/v1744416795/page1_cfuzxw.mp4',
    assistantIT: 'https://res.cloudinary.com/dko5sommz/video/upload/v1744417105/assistant_IT_hwlbqq.mp4',
    aiAssistantBackground: 'https://res.cloudinary.com/dko5sommz/video/upload/v1744416232/background_abzanh.mp4',
    restaurantCRM: 'https://res.cloudinary.com/dko5sommz/video/upload/v1745412167/852122-hd_1920_1080_30fps_j0tn6y.mp4',
    communityManagerCRM: 'https://res.cloudinary.com/dko5sommz/video/upload/v1745413001/13510815_3840_2160_30fps_ilwhfm.mp4',
    websitePresentation: 'https://res.cloudinary.com/dko5sommz/video/upload/v1745331051/mon_site_web_aqda4c.mkv',
  },

  images: {
    logos: {
      novacore: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744370550/logo-novacore_iqi2pd.png',
      dlSolutions: 'https://res.cloudinary.com/dko5sommz/image/upload/v1743895989/1_f3thi3.png',
      dlCircle: 'https://res.cloudinary.com/dko5sommz/image/upload/v1743945163/dl_cpdzem.png',
    },

    qrCodes: {
      novacore: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744370550/qrcode-novacore_ri6640.png',
    },

    storeBadges: {
      appStore: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744370550/appstore-badge_jso4bp.png',
      playStore: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744370550/playstare-badge_eo42yn.png',
    },

    chatbot: {
      avatar: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744744139/chatbot_la13t1.gif',
    },

    payment: {
      visa: {
        old: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744740463/carte_visa_ihneze.jpg',
        new: 'https://res.cloudinary.com/dko5sommz/image/upload/v1745424905/0f86075d899c9069b235c23b792d70ef_tg1wku.jpg',
      },
      paypal: {
        old: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744740472/paypal_fdmyzu.png',
        new: 'https://res.cloudinary.com/dko5sommz/image/upload/v1745424901/paypal_kecrcr.jpg',
      },
      mobileMoney: {
        old: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744740453/mobile-money_p989yz.jpg',
        new: 'https://res.cloudinary.com/dko5sommz/image/upload/v1745424899/mobile_money_k7d2rg.jpg',
      },
      orangeMoney: 'https://res.cloudinary.com/dko5sommz/image/upload/v1745424893/orange_money_gwziqy.jpg',
    },

    dlStyle: {
      main: 'https://res.cloudinary.com/dko5sommz/image/upload/v1746843551/DLStyle_kpjzmz.jpg',
      background1: 'https://res.cloudinary.com/dko5sommz/image/upload/v1746843375/bg1_h2htyr.jpg',
      background2: 'https://res.cloudinary.com/dko5sommz/image/upload/v1746843376/bg2_addx30.jpg',
    },
  },
} as const;

// Types pour TypeScript
export type MediaConfig = typeof mediaConfig;
export type VideoConfig = MediaConfig['videos'];
export type ImageConfig = MediaConfig['images'];

// Helpers pour accéder aux médias
export const getVideoUrl = (key: keyof VideoConfig): string => mediaConfig.videos[key];
export const getImageUrl = (category: keyof ImageConfig, key: string): string => {
  const categoryImages = mediaConfig.images[category];
  if (typeof categoryImages === 'string') {
    return categoryImages;
  }
  return (categoryImages as Record<string, string>)[key];
};

// Exemple d'utilisation:
// const novacoreLogo = getImageUrl('logos', 'novacore');
// const homeVideo = getVideoUrl('homeBackground'); 