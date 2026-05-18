import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  // Church info
  churchName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  // Service times
  mondayTime: string;
  mondayHidden: boolean;
  tuesdayTime: string;
  tuesdayHidden: boolean;
  wednesdayTime: string;
  wednesdayHidden: boolean;
  thursdayTime: string;
  thursdayHidden: boolean;
  fridayTime: string;
  fridayHidden: boolean;
  saturdayTime: string;
  saturdayHidden: boolean;
  sundayTime1: string;
  sundayTime2: string;
  sundayHidden: boolean;
  // Pastor
  pastorName: string;
  pastorWifeName: string;
  pastorPhotoUrl: string;
  pastorWifePhotoUrl: string;
  pastorHidden: boolean;
  // Social
  youtubeUrl: string;
  youtubeChannelId: string;
  youtubeChannelUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  whatsappNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankAccountDescription: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    churchName: { type: String, default: "Assemblies Of God Church" },
    tagline: { type: String, default: "Choba 2 · Port Harcourt" },
    address: { type: String, default: "Assemblies Of God Church, Choba, Port Harcourt, Rivers State" },
    phone: { type: String, default: "+234 801 234 5678" },
    email: { type: String, default: "hello@agchurch.org" },
    mondayTime: { type: String, default: "" },
    mondayHidden: { type: Boolean, default: true },
    tuesdayTime: { type: String, default: "" },
    tuesdayHidden: { type: Boolean, default: true },
    wednesdayTime: { type: String, default: "6:00 PM — Midweek Service" },
    wednesdayHidden: { type: Boolean, default: false },
    thursdayTime: { type: String, default: "" },
    thursdayHidden: { type: Boolean, default: true },
    fridayTime: { type: String, default: "6:00 AM — Early Morning Prayer" },
    fridayHidden: { type: Boolean, default: false },
    saturdayTime: { type: String, default: "" },
    saturdayHidden: { type: Boolean, default: true },
    sundayTime1: { type: String, default: "8:00 AM — First Service" },
    sundayTime2: { type: String, default: "10:30 AM — Second Service" },
    sundayHidden: { type: Boolean, default: false },
    pastorName: { type: String, default: "Rev. Emmanuel Okafor" },
    pastorWifeName: { type: String, default: "Mrs. Grace Okafor" },
    pastorPhotoUrl: { type: String, default: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces" },
    pastorWifePhotoUrl: { type: String, default: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces" },
    pastorHidden: { type: Boolean, default: false },
    youtubeUrl: { type: String, default: "https://www.youtube.com/@AssembliesOfGodChoba2" },
    youtubeChannelId: { type: String, default: "UCQshxkbjIwOPDHTtLoM19cQ" },
    youtubeChannelUrl: { type: String, default: "https://www.youtube.com/@AssembliesOfGodChoba2" },
    facebookUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    bankName: { type: String, default: "Zenith Bank" },
    bankAccountNumber: { type: String, default: "1229195658" },
    bankAccountName: { type: String, default: "Assemblies of God 2 Choba — Proj Account" },
    bankAccountDescription: { type: String, default: "Use this account for project support and general giving." },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
