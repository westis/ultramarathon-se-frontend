// Define a type for your podcast episodes
export interface PodcastEpisode {
  title: string;
  slug: { current: string };
  description: any[]; // Adjust according to your actual type
  audioFile: { asset: { url: string } };
  coverImageUrl: string;
  publicationDate: string;
  mainHost: string;
  coHost?: string;
  guests: string[];
  tags: string[];
  transcript: string;
}
