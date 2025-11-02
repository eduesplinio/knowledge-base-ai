'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:shadow-lg',
        },
        unstyled: false,
      }}
      {...props}
    />
  );
};

export { Toaster };

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    [data-sonner-toast][data-type="success"] {
      background-color: #0ba95b !important;
      border-color: #0ba95b !important;
      color: white !important;
    }
    [data-sonner-toast][data-type="error"] {
      background-color: #e53e3e !important;
      border-color: #e53e3e !important;
      color: white !important;
    }
  `;
  document.head.appendChild(style);
}
