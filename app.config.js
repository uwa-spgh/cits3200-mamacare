
module.exports = ({ config }) => {
  const isDev = process.env.APP_VARIANT === "development";
  const appId = "au.edu.uwa.spgh.mamacare";

  return {
    ...config,
    name: isDev ? "MamaCare Dev" : "MamaCare",

    icon: isDev
      ? "./assets/flower-icon-dev.png"
      : "./assets/flower-icon.png",

    ios: {
      ...config.ios,
      bundleIdentifier: isDev ? `${appId}.dev` : appId,
    },

    android: {
      ...config.android,
      package: isDev ? `${appId}.dev` : appId,
      adaptiveIcon: {
        ...config.android.adaptiveIcon,
        foregroundImage: isDev
          ? "./assets/flower-adaptive-foreground-dev.png"
          : "./assets/flower-adaptive-foreground.png",
      },
    },
  };
};
