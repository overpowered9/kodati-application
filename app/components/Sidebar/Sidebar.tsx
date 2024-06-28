"use client";

import Image from "next/image";
import styles from "./sidebar.module.css";
import logoutimage from "@/public/sidebar/logout.svg";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/utils/toast-helpers";
import Spinner from "../Modals/Spinner";
import Link from "next/link";
import { logout } from "@/utils/client-helpers";
import { adminButtons, sidebarButtons, userButtons } from "@/constants/sidebar";

const Sidebar = ({ role, showSidebar }: { role: 'user' | 'admin', showSidebar: boolean }) => {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    router.prefetch('/login');
  }, []);

  const { mutate: handleLogout, isPending: loading } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      showSuccessToast('Logout successful');
      router.push(data?.url || '/login');
    },
    onError: (error) => {
      showErrorToast(error?.message || 'An error occurred while logging out');
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogout();
  };

  const isActive = (pathname: string) => path === pathname;

  const generateButtons = (buttonConfig: Array<{ path: string; image: string; text: string }>) => {
    return buttonConfig.map((button) => (
      <li key={button.path}>
        <Link href={button.path}>
          <button className={`${isActive(button.path) ? styles.active : styles.dashboardbuttons}`}>
            <Image className={styles.image} src={button.image} alt={button.text} />
            <p className={`${styles.buttontext} whitespace-nowrap`}>{button.text}</p>
          </button>
        </Link>
      </li>
    ));
  };

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div className={showSidebar ? styles.openSidebar : styles.hideSidebar}>
      <div className="mt-[76px]">
        <div className={styles.Parent}>
          <ul className={styles.list}>
            {generateButtons(sidebarButtons)}
            {role === 'admin' && generateButtons(adminButtons)}
            {role === 'user' && generateButtons(userButtons)}
          </ul>
          <form onSubmit={handleSubmit}>
            <button className={styles.logoutbutton} type="submit" style={{ marginTop: role === 'user' ? '105px' : '48px' }}>
              <Image src={logoutimage} alt="settings" />
              <p className={styles.logout_buttontext}>Logout</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Sidebar;