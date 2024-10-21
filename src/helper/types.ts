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
    _id: string;
    name: string;
    id?: string;
  avatar: string;
  emailId: string;
  token?: string; 
  role: string
}

// Assuming this is in your types file or wherever you define your types
export interface Question {
    _id: string; // Add this if you expect an ID
    text: string;
    askedForUserId: string; // ID of the user for whom the question is asked
    createdAt: string; // Timestamps from Mongoose
    updatedAt: string; // Timestamps from Mongoose
  }
  
export interface User {
    _id: string;
    name: string;
    emailId: string;
}


/**
 * Interface for lead data.
 */
export interface Lead {
    name: string;
    email: string;
    id?: number;
    role:string;
    password: string
}
