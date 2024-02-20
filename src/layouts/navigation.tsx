export const pages = [
  {  
    authOnly: false,  
    pages: [
      {
        title: 'Home',
        href: './',
        authHide: false,
      },      
      {
        title: 'About',
        href: '/about',
        authHide: false,
      },
      {
        title: 'Search',
        href: '/search',
        authHide: false,
      },
      {
        title: 'Contact',
        href: '/contact',
        authHide: false,
      },      
      {
        title: 'Login',
        href: '/login',
        authHide: true,        
      },  
      {
        title: 'Sign up',
        href: '/signup', 
        authHide: true,       
      }, 
      {
        title: 'Forgot Password',
        href: '/forgot-password', 
        authHide: true,       
      },           
    ],
  },
  {
    title: 'My Stuff',
    id: 'my-stuff',
    authOnly: true,
    pages: [
      {
        title: 'Profile',
        href: '/my-profile',
        authHide: false,
      },
      {
        title: 'Settings',
        href: '/my-settings',
        authHide: false,
      },
      {
        title: 'Notifications',
        href: '/my-notifications',
        authHide: false,
      },
      {
        title: 'Logout',
        href: '/logout',
        authHide: false,
      },      
    ],
  },
  {
    title: 'Admin Pages',
    id: 'admin-pages',
    authOnly: true,
    role: 'site-admin',
    pages: [
      {
        title: 'Users',
        href: '/admin-users',
        authHide: false,
      },
      {
        title: 'Active Tokens',
        href: '/admin-tokens',
        authHide: false,
      },  
      {
        title: 'Courses',
        href: '/admin-courses',
        authHide: false,
      },  
      {
        title: 'Misc',
        href: '/admin-docs',
        authHide: false,
      },        
    ],
  }, 
];
