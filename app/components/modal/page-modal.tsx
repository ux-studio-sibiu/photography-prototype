'use client';

import { usePathname } from 'next/navigation';
import { Modal } from './modal';
import Calendar from '@/app/components/calendar/calendar';

interface PageModalProps {
  availability?: any;
}

export function PageModal({ availability }: PageModalProps) {
  const pathname = usePathname();

  const renderContent = () => {
    switch (pathname) {
      case '/about':
        return (
          <div className="about-page">
            <div className="about-page-container">
              <h1>Despre Mine</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        );

      case '/calendar':
        return (

              <div className="calendar-page-content">
                <Calendar availability={availability} />
              </div>
        );

      case '/contact':
        return (
          <div className="contact-page">
            <div className="contact-page-container">
              <h1>Contact</h1>
              <p>Email: contact@example.com</p>
              <p>Phone: +40 123 456 7890</p>
              <p>Available for bookings and inquiries.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <Modal>{renderContent()}</Modal>;
}
