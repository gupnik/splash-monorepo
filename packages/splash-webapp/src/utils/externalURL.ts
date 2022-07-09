export enum ExternalURL {
  discord,
  twitter,
  notion,
  discourse,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return '';
    case ExternalURL.twitter:
      return '';
    case ExternalURL.notion:
      return '';
  }
};
