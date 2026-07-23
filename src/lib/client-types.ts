export type LinkRow = {
  id: string;
  slug: string;
  destinationUrl: string;
  discountCode: string | null;
  startDate: Date | null;
  endDate: Date | null;
  fallbackUrl: string | null;
  clickCount: number;
};

export type SponsorGroup = {
  id: string;
  name: string;
  status: string;
  links: LinkRow[];
};
