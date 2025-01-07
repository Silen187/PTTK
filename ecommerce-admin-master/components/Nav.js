import Link from "next/link";
import {useRouter} from "next/router";
import {signOut} from "next-auth/react";
import Logo from "@/components/Logo";

export default function Nav({show}) {
  const inactiveLink = 'flex gap-1 p-1';
  const activeLink = inactiveLink+' bg-highlight text-black rounded-sm';
  const inactiveIcon = 'w-6 h-6';
  const activeIcon = inactiveIcon + ' text-primary';
  const router = useRouter();
  const {pathname} = router;
  async function logout() {
    await router.push('/');
    await signOut();
  }
  return (
    <aside className={(show?'left-0':'-left-full')+" top-0 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all"}>
      <div className="mb-4 mr-4">
      <Logo />
      </div>
      <nav className="flex flex-col gap-2">
        <Link href={'/dashboard'} className={pathname === '/dashboard' ? activeLink : inactiveLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname === '/dashboard' ? activeIcon : inactiveIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Trực quan
        </Link>

        <Link href={'/products'} className={pathname.includes('/products') ? activeLink : inactiveLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname.includes('/products') ? activeIcon : inactiveIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          Quản lý sản phẩm
        </Link>
        
        <Link
          href={'/inventorys'}
          className={pathname.includes('/inventorys') ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={pathname.includes('/inventorys') ? activeIcon : inactiveIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h18v18H3V3zm3 3h12v12H6V6zm3 3h6v6H9V9z"
            />
          </svg>
          Quản lý kho
        </Link>

        <Link
          href={'/vouchers'}
          className={pathname.includes('/vouchers') ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={pathname.includes('/vouchers') ? activeIcon : inactiveIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8h16M4 16h16m-6-8h6m-6 8h6"
            />
          </svg>
          Quản lý Voucher
        </Link>

        <Link
          href={'/vip-customers'}
          className={pathname.includes('/vip-customers') ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={pathname.includes('/vip-customers') ? activeIcon : inactiveIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 0v9m0 0l3.09 3.09m-3.09-3.09l-3.09 3.09"
            />
          </svg>
          Quản lý VIP
        </Link>

        <Link
          href={'/customers'}
          className={pathname.includes('/customers') ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={pathname.includes('/customers') ? activeIcon : inactiveIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m-3.75 0a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 006.75 21h10.5a2.25 2.25 0 002.25-2.25v-7.5A2.25 2.25 0 0017.25 9m-10.5 0h10.5"
            />
          </svg>
          Quản lý khách hàng
        </Link>
        <Link href={'/orders'} className={pathname.includes('/orders') ? activeLink : inactiveLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname.includes('/orders') ? activeIcon : inactiveIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
        Quản lý đơn hàng
        </Link>
        <button onClick={logout} className={inactiveLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Đăng xuất
        </button>
      </nav>
    </aside>
  );
}