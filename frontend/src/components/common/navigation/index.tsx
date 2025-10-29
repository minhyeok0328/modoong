import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUsers, FaHandshake, FaUser } from 'react-icons/fa';

export default function Navigation({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const location = useLocation();
  const baseNavItemStyles =
    'flex flex-col items-center justify-center transition-colors cursor-pointer';
  const iconStyles = 'text-2xl';
  const labelStyles = 'mt-1 text-xs';

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' ? 'text-primary' : 'text-gray-500';
    }
    return location.pathname.startsWith(path) ? 'text-primary' : 'text-gray-500';
  };

  return (
    <nav className={className} style={style} aria-label="메인 네비게이션">
      <ul className="grid grid-cols-5 gap-4 px-4 py-2" role="menubar">
        <li role="none">
          <Link
            to="/"
            className={`${baseNavItemStyles} ${isActive('/')}`}
            role="menuitem"
            aria-label="홈으로 이동"
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            <FaHome className={iconStyles} aria-hidden="true" />
            <span className={labelStyles}>홈</span>
          </Link>
        </li>
        <li role="none">
          <Link
            to="/reservation"
            className={`${baseNavItemStyles} ${isActive('/reservation')}`}
            role="menuitem"
            aria-label="체육시설 예약하기"
            aria-current={location.pathname.startsWith('/reservation') ? 'page' : undefined}
          >
            <FaCalendarAlt className={iconStyles} aria-hidden="true" />
            <span className={labelStyles}>예약</span>
          </Link>
        </li>
        <li role="none">
          <Link
            to="/mate"
            className={`${baseNavItemStyles} ${isActive('/mate')}`}
            role="menuitem"
            aria-label="매칭으로 이동"
            aria-current={location.pathname.startsWith('/mate') ? 'page' : undefined}
          >
            <FaHandshake className={iconStyles} aria-hidden="true" />
            <span className={labelStyles}>매칭</span>
          </Link>
        </li>
        <li role="none">
          <Link
            to="/lounge"
            className={`${baseNavItemStyles} ${isActive('/lounge')}`}
            role="menuitem"
            aria-label="라운지로 이동"
            aria-current={location.pathname.startsWith('/lounge') ? 'page' : undefined}
          >
            <FaUsers className={iconStyles} aria-hidden="true" />
            <span className={labelStyles}>라운지</span>
          </Link>
        </li>
        <li role="none">
          <Link
            to="/mypage"
            className={`${baseNavItemStyles} ${isActive('/mypage')}`}
            role="menuitem"
            aria-label="마이페이지로 이동"
            aria-current={location.pathname.startsWith('/mypage') ? 'page' : undefined}
          >
            <FaUser className={iconStyles} aria-hidden="true" />
            <span className={labelStyles}>마이페이지</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
