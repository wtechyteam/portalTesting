"use client";

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import Link from 'next/link';
import SidebarSubmenu from './sidebar-submenu';
import routes from '@/helper/sidebar-routes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setPageTitle } from '@/features/common/headerSlice';
import { UserProfile } from '@/helper/types';
import BookmarkSquareIcon from '@heroicons/react/24/outline/BookmarkSquareIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/outline/ArrowUpOnSquareIcon';
import { getUserInfo } from '@/features/common/userSlice';
import auth from '@/lib/auth';

// Import statements...

interface LeftSidebarProps {}

function LeftSidebar(props: LeftSidebarProps) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const close = () => {
        const leftSidebarDrawer = document.getElementById('left-sidebar-drawer');
        if (leftSidebarDrawer) leftSidebarDrawer.click();
    };

    useEffect(() => {
        const routeObj = routes.find((r) => r.path === pathname);
        if (routeObj) {
            dispatch(setPageTitle({ title: routeObj.pageTitle }));
        } else {
            const secondSlashIndex = pathname.indexOf('/', pathname.indexOf('/') + 1);
            if (secondSlashIndex !== -1) {
                const substringBeforeSecondSlash = pathname.substring(0, secondSlashIndex);
                const submenuRouteObj = routes.find((r) => r.path === substringBeforeSecondSlash);
                if (submenuRouteObj?.submenu) {
                    const submenuObj = submenuRouteObj.submenu.find((r) => r.path === pathname);
                    if (submenuObj) {
                        dispatch(setPageTitle({ title: submenuObj.pageTitle }));
                    }
                }
            }
        }
    }, [pathname]);

    useEffect(() => {
        const userId = auth.getUserId();
        if (userId) {
            dispatch(getUserInfo(userId)); // Dispatch action to fetch user info
        }
    }, [dispatch]);

    const logoutUser = async () => {
        await auth.logout();
        window.location.href = '/';
    };

    return (
        <div className="drawer-side z-30 overflow-hidden">
            <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
            <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
                <button
                    className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
                    onClick={close}
                >
                    <XMarkIcon className="h-5 inline-block w-5" />
                </button>

                <li className="mb-2 font-semibold text-xl">
                    <Link href="/welcome">
                        <img className="mask mask-squircle w-10" src="/logo192.png" alt="DashWind Logo" />
                        DashWind
                    </Link>
                </li>
                <div className="overflow-y-scroll pb-20 no-scrollbar" style={{ height: "85vh" }}>
                    {routes.map((route, k: number) => (
                        // Check if the user role is included in the allowed roles for this route
                        route.role?.includes(user.role) && (
                            <li className="" key={k}>
                                {route.submenu ? (
                                    <SidebarSubmenu {...route} />
                                ) : (
                                    <Link
                                        href={route.path}
                                        className={`${pathname === route.path ? 'font-semibold bg-base-200 ' : 'font-normal'}`}
                                    >
                                        {route.icon} {route.pageName}
                                        {pathname === route.path ? (
                                            <span
                                                className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                                                aria-hidden="true"
                                            ></span>
                                        ) : null}
                                    </Link>
                                )}
                            </li>
                        )
                    ))}
                </div>
            </ul>
            {/* Profile icon, opening menu on click */}
            <div className="dropdown bottom-0 absolute dropdown-top w-80 ">
                <div tabIndex={0} role="button" className="btn w-full bg-base-100 text-left justify-start ">
                    <div className="avatar">
                        <div className="w-6 rounded-full">
                            <img src={user.avatar} alt={user.name} />
                        </div>
                    </div>
                    <span className="ml-2">{user.name || 'User'} {user.role ? `(${user.role})` : ''}</span>
                    <ChevronUpIcon className='w-4 ' />
                </div>
                <ul tabIndex={0} className="dropdown-content visible w-52 px-4 z-[1] menu shadow bg-base-200 rounded-box ">
                    <li className="">
                        <Link href={'/settings/billing'}>
                            <BookmarkSquareIcon className='w-4 ' />Bill History
                        </Link>
                    </li>
                    <div className="divider py-2 m-0"></div>
                    <li onClick={() => logoutUser()}>
                        <a className=' ' >
                            <ArrowUpOnSquareIcon className='w-4 ' />Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default LeftSidebar;
