// types/customUser.ts
export interface CustomUser {
    id: string;
    username?: string | null;
    emailAddresses?: { emailAddress: string }[] | null;
    profileImageUrl?: string | null;
    introduction?: string;
    topics?: string[];
  }
  