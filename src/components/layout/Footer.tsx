import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from '@/constants/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: NAV_LINKS,
    },
    {
      title: 'Community',
      links: [
        { label: 'Discord', href: '#' },
        { label: 'Twitter', href: '#' },
        { label: 'YouTube', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-primary/10 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/mangoloids-logo.png"
                alt="Mangoloids Guild Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-bold text-foreground">Mangoloids</span>
            </div>
            <p className="text-sm text-foreground/60">
              Join the ultimate gaming guild. Where legends are made.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map(section => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/60 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-primary/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-foreground/60 sm:flex-row sm:text-left">
          <p>&copy; {currentYear} Mangoloids Guild. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
