import "./nav-menu.scss";

export interface NavMenuItem {
  label: string;
  href: string;
}

interface NavMenuProps {
  items: NavMenuItem[];
  className?: string;
}

export default function NavMenu({
  items,
  className = "",
}: NavMenuProps) {
  return (
    <nav className={`nav-menu ${className}`.trim()}>
      <ul className="nav-menu-list">
        {items.map((item) => (
          <li key={item.href} className="nav-menu-item">
            <a href={item.href} className="nav-menu-link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
