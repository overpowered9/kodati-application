"use client";

import { useState } from 'react';
import style from './settings.module.css';
import UpdatePassword from './UpdatePassword';
import OrderSettings from './OrderSettings';

const Settings = ({ metadata, role }: { metadata?: Record<string, any> | null, role: 'user' | 'admin' }) => {
  const [activeSection, setActiveSection] = useState<'password' | 'order'>('password');

  return (
    <div className={style.parent}>
      <div className={style.subparentsett}>
        <p className={style.settings_heading}>Settings</p>
        <div className={style.settings_menu}>
          <div className={style.title}>
            <div className={activeSection === 'password' ? style.settings_active : style.settings_nonactive} onClick={() => setActiveSection('password')}>
              <p>Login & Security</p>
            </div>
            {role === 'user' && (
              <div className={activeSection === 'order' ? style.settings_active : style.settings_nonactive}
                onClick={() => setActiveSection('order')}>
                <p>Order Settings</p>
              </div>
            )}
          </div>
          {activeSection === 'password' ? (
            <UpdatePassword />
          ) : (
            role === 'user' && <OrderSettings metadata={metadata} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;