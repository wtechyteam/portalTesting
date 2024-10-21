// Routes Interface Starts ------------------------

/**
 * Interface for sidebar menu items.
 */
export interface SidebarMenuObj {
    path: string;
    icon: JSX.Element; // Change this to typeof Squares2X2Icon | typeof InboxArrowDownIcon | ...
    pageName: string;
    pageTitle: string;
    submenu?: SubmenuItem[];
    role: string[]
}

/**
 * Interface for submenu items.
 */
export interface SubmenuItem {
    path: string;
    icon: any; // Change this to typeof Squares2X2Icon | typeof InboxArrowDownIcon | ...
    pageName: string;
    pageTitle: string;
}


// Routes Interface End ------------------------

/**
 * Interface for api response
 */
export interface APIResponse {
    token: string;
    user: UserProfile; 
}

/**
 * Interface for UserProfile data.
 */
export interface UserProfile {
    name: string;
  avatar: string;
  emailId: string;
  token?: string; 
  role: string
}



/**
 * Interface for lead data.
 */
export interface Lead {
    name: string;
    email: string;
    id?: number;
    role:string
}
