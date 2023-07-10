function addConsent(options) {
  const scripts = options.head.script || [];
  scripts.push({
    hid: options.scriptId,
    innerHTML: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      if(!window.isFlag){ // weird reset on first page change
          window.isFlag = true;
          if (localStorage.getItem('${options.localStorageItem}') === null) {
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied'
          });
        }else{
            var consent = JSON.parse(localStorage.getItem('${options.localStorageItem}'))
            var consentMode = {
              ad_storage: consent.ad_storage ? 'granted' : 'denied',
              analytics_storage: consent.analytics_storage ? 'granted' : 'denied',
              functionality_storage: consent.functionality_storage
                ? 'granted'
                : 'denied',
              personalization_storage: consent.personalization_storage
                ? 'granted'
                : 'denied',
              security_storage: consent.security_storage ? 'granted' : 'denied',
            }
            gtag('consent', 'default', consentMode)
          }
        }
        `,
  });
  options.head.__dangerouslyDisableSanitizersByTagID =
    options.head.__dangerouslyDisableSanitizersByTagID || {};
  options.head.__dangerouslyDisableSanitizersByTagID[options.scriptId] = [
    "innerHTML",
  ];
}

module.exports = function () {
  const options = {
    localStorageItem:
      this.options.consentGTM?.localStorageItem || "storedConsentLocale",
    ...this.options,
    scriptId: "consent-script",
  };
  options.publicRuntimeConfig.consent = options.localStorageItem;
  !process.client && addConsent(options);
};
