/**
 * Represents a menu item on the home screen.
 */
export interface MenuItem {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  backgroundImage?: string;
  iconImage?: string;
}
