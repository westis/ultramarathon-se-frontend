// types/navigation.ts
export interface NavigationItem {
  _id: string;
  title: string;
  slug: string;
  children?: NavigationItem[];
  open?: boolean;
}
