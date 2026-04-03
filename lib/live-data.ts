export interface LiveSettings {
  isLive: boolean;
  streamUrl: string;
  title: string;
  description: string;
}

export const defaultLiveSettings: LiveSettings = {
  isLive: false,
  streamUrl: "",
  title: "Sunday Service",
  description: "Join us live for worship and the Word.",
};
