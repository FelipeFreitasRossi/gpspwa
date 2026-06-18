import * as LucideIcons from 'lucide-react';

const socialLinks = [
  {
    name: 'LinkedIn',
    iconName: 'Linkedin',
    href: 'https://linkedin.com/',
    color: '#0274b3',
  },
  {
    name: 'GitHub',
    iconName: 'Github',
    href: 'https://github.com/',
    color: '#24262a',
  },
  {
    name: 'Instagram',
    iconName: 'Instagram',
    href: 'https://instagram.com/',
    color: 'linear-gradient(45deg, #405de6, #5b51db, #b33ab4, #c135b4, #e1306c, #fd1f1f)',
  },
  {
    name: 'YouTube',
    iconName: 'Youtube',
    href: 'https://youtube.com/',
    color: '#ff0000',
  },
];

export default function SocialIcons() {
  const getIcon = (name: string) => {
    let Icon = (LucideIcons as any)[name];
    if (!Icon && name === 'Github') {
      Icon = (LucideIcons as any)['GitHub'];
    }
    return Icon || LucideIcons.Circle;
  };

  return (
    <ul className="flex items-center gap-1 sm:gap-1.5">
      {socialLinks.map((social) => {
        const Icon = getIcon(social.iconName);
        return (
          <li key={social.name} className="relative">
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/5 text-mist transition-all duration-300 hover:text-white sm:h-10 sm:w-10"
            >
              <span
                className="absolute bottom-0 left-0 h-0 w-full transition-all duration-300 group-hover:h-full"
                style={{ background: social.color }}
              />
              <Icon className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:scale-110 sm:h-5 sm:w-5" />
            </a>
            <div
              className="pointer-events-none absolute left-1/2 top-[-28px] -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] text-white opacity-0 transition-all duration-300 group-hover:top-[-38px] group-hover:opacity-100 sm:top-[-30px] sm:px-2.5 sm:py-1 sm:text-xs"
              style={{ background: social.color }}
            >
              {social.name}
            </div>
          </li>
        );
      })}
    </ul>
  );
}