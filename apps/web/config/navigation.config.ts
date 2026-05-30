export type NavLink = {
  label: string
  href: string
  iconName: string
  badge?: string
}

export type MenuAction = {
  label: string
  iconName: string
  variant?: 'default' | 'danger'
} & ({ href: string; action?: never } | { action: string; href?: never })

export const NAV_LINKS: NavLink[] = [
  { label: 'Playground', href: '/playground',  iconName: 'terminal' },
  { label: 'Snippets',   href: '/feed',         iconName: 'layout-grid' },
  { label: 'War Rooms',  href: '/war-rooms',    iconName: 'swords', badge: 'NEW' },
]

export const NAV_LINKS_EXTENDED: NavLink[] = [
  { label: 'Playground', href: '/playground',  iconName: 'terminal' },
  { label: 'Snippets',   href: '/feed',         iconName: 'layout-grid' },
  { label: 'War Rooms',  href: '/war-rooms',    iconName: 'swords', badge: 'NEW' },
  { label: 'Docs',       href: '#',             iconName: 'book-open' },
  { label: 'Pricing',    href: '#pricing',      iconName: 'credit-card' },
]

export const USER_MENU: MenuAction[] = [
  { label: 'Profile',   href: '/profile',  iconName: 'user' },
  { label: 'Settings',  href: '/settings', iconName: 'settings' },
  { label: 'Sign Out',  action: 'signout', iconName: 'log-out', variant: 'danger' },
]

export const ROUTES = {
  HOME:       '/',
  PLAYGROUND: '/playground',
  FEED:       '/feed',
  WAR_ROOMS:  '/war-rooms',
  SNIPPET:    (slug: string) => `/s/${slug}`,
  PROFILE:    (username: string) => `/profile/${username}`,
  LOGIN:      '/login',
  REGISTER:   '/register',
} as const
