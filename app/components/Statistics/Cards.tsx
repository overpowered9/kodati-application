"use client";

import styles from './cards.module.css';
import van from '@/public/dashboard/van.svg';
import Image from 'next/image';
import cart from '@/public/dashboard/cart.svg';
import bag from '@/public/dashboard/bag.svg';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { User } from '@/database/models';

const Cards = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  const fetchStatistics = async () => {
    const response = await fetch(`/api/stats`);
    return await response.json();
  }

  const { data } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => fetchStatistics(),
    retryOnMount: false,
    staleTime: Infinity,
    retry: false,
  });

  return (
    <div className={styles.cards_parent}>
      <div className={styles.card}>
        <h3>All <br /> Orders</h3>
        <p>{data?.data?.allOrders ?? ''}</p>
        <Image className={styles.image} src={cart} alt='cart'></Image>
      </div>
      <div className={styles.card}>
        <h3>Pending <br /> Orders</h3>
        <p>{data?.data?.pendingOrders ?? ''}</p>
        <Image className={styles.image} src={bag} alt='van'></Image>
      </div>
      <div className={styles.card}>
        <h3>Fulfilled</h3>
        <p>{data?.data?.completedOrders ?? ''}</p>
        <Image className={styles.image} src={van} alt='van'></Image>
      </div>
      {user?.role === 'user' && (
        <div className={styles.card}>
          <h3>Total <br /> Balance</h3>
          <p>{data?.data?.currentBalance ?? ''}</p>
          <Image className={styles.image} src={van} alt='van'></Image>
        </div>
      )}
      {user?.role === 'admin' && (
        <div className={styles.card}>
          <h3>Failed <br /> Orders</h3>
          <p>{data?.data?.failedOrders ?? ''}</p>
          <Image className={styles.image} src={van} alt='van'></Image>
        </div>
      )}
    </div>
  );
};

export default Cards;