"use client";

import style from "./header.module.css";
import Image from "next/image";
import tick from "@/public/header/tick.svg";
import NotificationCard from "./NotificationCard";
import { Notification } from "@/database/models";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment } from "react";
import { PaginatedNotifications } from "@/types/pagination-types";
import { showErrorToast, showSuccessToast } from "@/utils/toast-helpers";
import NotificationsLoading from "./NotificationsLoading";
import Link from "next/link";

const NotificationsPopup = ({ role }: { role: 'admin' | 'user' }) => {
  const queryClient = useQueryClient();

  const markAllAsRead = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch('/api/users/notifications/mark-all-as-read', { method: 'PATCH' });
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  };

  const { mutate, isPending: loading } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      showSuccessToast('All notifications marked as read');
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
  });

  const markNotificationsAsRead = async (notifications: Notification[]) => {
    if (!notifications || !notifications.length) return;
    const unreadIds = [...new Set(notifications.filter(notification => !notification.read).map(notification => notification.id))];
    await fetch('/api/users/notifications/mark-as-read', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: unreadIds }),
    });
  };

  const fetchNotifications = async ({ pageParam = 1 }): Promise<PaginatedNotifications | never> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch(`/api/users/notifications?page=${pageParam}`);
    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }
    const notifications = await response.json() as PaginatedNotifications;
    markNotificationsAsRead(notifications.items);
    return notifications;
  }

  const { data, fetchNextPage, hasNextPage, isFetching, isError, isPending, isRefetching } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.totalPages > lastPage.page ? lastPage.page + 1 : null,
    retryOnMount: false,
    staleTime: Infinity,
    retry: false,
  });

  return (
    <div className={style.container_notifications} id="scrollbar-target">
      <div className={style.FeedContainer}>
        <div className={style.FeedHeaderLeft}>
          <p className={style.NotificationText}>Notifications</p>
        </div>
        <div className={style.FeedHeaderRight}>
          {role === 'admin' && (
            <Link href={'/admin/logs'}>
              <button className="whitespace-nowrap text-[#1C1C1C]">
                View Logs
              </button>
            </Link>
          )}
          <button className="disabled:opacity-50" onClick={() => mutate()} disabled={isPending || loading || isRefetching}>
            <Image src={tick} alt="check" />
          </button>
        </div>
      </div>
      {isPending || loading || isRefetching ? (
        <NotificationsLoading />
      ) : (
        <>
          <InfiniteScroll dataLength={data?.pages.flatMap(page => page.items).length || 0} next={fetchNextPage} hasMore={hasNextPage} loader={<NotificationsLoading />} scrollableTarget="scrollbar-target" scrollThreshold={0.9}>
            {data?.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.items.map((notification: Notification) => (
                  <NotificationCard notification={notification} key={notification.id} />
                ))}
              </Fragment>
            ))}
          </InfiniteScroll>
          {(!isFetching && !isError && !data?.pages?.[0].totalItems) && (
            <p className="text-center my-4 text-[deepskyblue] text-xl"><b>No notifications found!</b></p>
          )}
        </>
      )}
    </div>
  )
}
export default NotificationsPopup;