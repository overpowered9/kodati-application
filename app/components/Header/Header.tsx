"use client";

import { useEffect } from "react";
import header from "./header.module.css";
import Image from "next/image";
import logo from "@/public/header/logo-17.svg";
import flag from "@/public/header/US@2x.svg";
import notification from "@/public/header/Notification.svg";
import cart from "@/public/header/Cart.svg";
import { useSession } from "next-auth/react";
import { User } from "@/database/models";
import { useState } from "react";
import NotificationsPopup from "./NotificationsPopup";
import Sidebar from "../Sidebar/Sidebar";
import { FaBars } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import CartModal from "../Modals/CartModal";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const [open, setOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleHamburgerClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const setShowNotifications = () => {
    setOpen(!open);
    setShowSidebar(false);
  };

  const handleViewChange = () => {
    setShowSidebar(!showSidebar);
    setOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (showSidebar && !target.closest(`.${header.openSidebar}`)) {
      setShowSidebar(false);
    } else if (open && !target.closest(`.${header.openNotification}`)) {
      setOpen(false);
    }
    if (isMobileMenuOpen && !target.closest(`.${header.ulactive}`)) {
      setIsMobileMenuOpen(false);
    }
  };



  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showSidebar, open, isMobileMenuOpen]);

  const checkUnreadNotifications = async (): Promise<{ unreadCount: number } | never> => {
    const response = await fetch('/api/users/notifications/unread');
    if (!response.ok) {
      throw new Error('Failed to fetch unread notifications');
    }
    return await response.json();
  };

  const { data } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: () => checkUnreadNotifications(),
    refetchInterval: 30000,
    staleTime: Infinity,
    retryOnMount: false,
    retry: false,
  });

  return (
    <>
      <div className={header.parentcontainer}>
        <div className={header.container}>
          <div className={header.navbar}>
            <Image src={logo} className={header.logo} alt="logo" />
            <FaBars className={header.sidebarhambuger} onClick={handleViewChange} />
            <FaBars className={header.hamburger} onClick={handleHamburgerClick} />
            <nav>
              <ul className={`${isMobileMenuOpen ? header.ulactive : header.ul} ${user?.role === 'admin' ? 'mr-14' : ''}`}>
                <li className={header.li} id="flag">
                  <button className={header.flagc_}>
                    <Image src={flag} alt="flag" />
                    <p className={header.UK}>UK</p>
                  </button>
                </li>
                <li className={header.li}>
                  <button className={header.threeitems} onClick={setShowNotifications}>
                    <div className="relative flex items-center">
                      <Image src={notification} alt="notification" />
                      {data && data?.unreadCount > 0 && (
                        <div className="absolute bottom-3 left-4 w-4 h-4 flex items-center justify-center bg-red-500 rounded-full">
                          <span className="text-white text-xs">{data?.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </button>
                </li>
                {user?.role === 'user' && (
                  <li className={header.li} id="cart">
                    <button className={header.flagc_} onClick={() => setShowCart(!showCart)}>
                      <Image src={cart} alt="cart" />
                    </button>
                  </li>
                )}
                {user?.avatar && (
                  <li className={header.li}>
                    <Image className={header.avatar} src={user?.avatar as string} alt="avatar" width={100} height={100} />
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {open &&
        <div className={header.openNotification}>
          <NotificationsPopup role={user.role} />
        </div>
      }
      {showCart && (
        <div>
          <CartModal onClose={() => setShowCart(false)} />
        </div>
      )}
      <Sidebar role={user?.role} showSidebar={showSidebar} />
    </>
  );
};

export default Header;