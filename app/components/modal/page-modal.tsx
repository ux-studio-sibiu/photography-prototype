'use client';

import { usePathname } from 'next/navigation';
import { Modal } from './modal';
import Calendar from '@/app/components/calendar/calendar';
import { SocialLinksModal } from '@/app/components/social-links/social-links-modal';
import '@/app/(site)/about/about.scss';
import '@/app/(site)/contact/contact.scss';

interface PageModalProps {
  availability?: any;
  social?: any;
}

export function PageModal({ availability, social }: PageModalProps) {
  const pathname = usePathname();
  const isModalRoute = ['/about', '/calendar', '/contact'].includes(pathname);

  if (!isModalRoute) return null;

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
              <SocialLinksModal social={social} className="contact-page-social" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <Modal>{renderContent()}</Modal>;
}
