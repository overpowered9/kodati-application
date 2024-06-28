import { Notification } from "@/database/models";
import success from "@/public/header/success.svg";
import info from "@/public/header/info.svg";
import warning from "@/public/header/warning.svg";
import error from "@/public/header/error.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import moment from "moment";

const icons = {
  info,
  warning,
  error,
  success,
};

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const [showDot, setShowDot] = useState(!notification.read);
  const renderIcon = icons[notification.type];

  useEffect(() => {
    if (!notification.read) {
      const timeout = setTimeout(() => {
        setShowDot(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-start">
      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
        <Image src={renderIcon} className="h-6 w-6" alt="Notification Icon" />
      </div>
      <div className="ml-4 flex-grow">
        <p className="text-gray-800 font-semibold">{notification.message}</p>
        <p className="text-sm text-gray-500">{moment.utc(notification.created_at, 'YYYY-MM-DD HH:mm:ss').fromNow()}</p>
      </div>
      {showDot && (
        <div className="animate-ping h-3 w-3 bg-red-500 rounded-full"></div>
      )}
    </div>
  );
};

export default NotificationCard;