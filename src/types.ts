export interface Hotspot {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  icon?: any;
}

export interface StoryStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
}
