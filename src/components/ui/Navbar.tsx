

import Link from "next/link";
import { Button } from "./button";
import { MenuIcon, Search, LogOut } from "lucide-react";
import styles from "./Navbar.module.css";
import { useAuth } from "@/lib/authcontext";
import { useEffect, useState } from "react";

interface NavbarProps {
handleSlidein?: () => void;
}

const Navbar = ({ handleSlidein }: NavbarProps) => {
/*const User = {
id: "1",
Name: "Abser",
};
*/
const { user,Logout} = useAuth() 

const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);
const HandleLogout = () => {
Logout()
console.log("Logout");
};

return ( <header className={styles.header}> <div className={styles.navbar}>
{/* Left section: Menu and logo */} <div className={styles.leftSection}> <Button
         type="button"
         onClick={handleSlidein}
         className={styles.menuButton}
         aria-label="Toggle sidebar"
       > <MenuIcon size={21} /> </Button>


      <Link href="/" className={styles.logo}>
        <span>
          Stack
          <span className={styles.logoAccent}>Overflow</span>
        </span>
      </Link>
    </div>

    {/* Center section: Navigation */}
    <nav className={styles.navigation} aria-label="Main navigation">
      {["About", "Contact", "For Team"].map((item) => (
        <Link
          key={item}
          href="/"
          className={styles.navLink}
        >
          {item}
        </Link>
      ))}
    </nav>

    {/* Search */}
    <form
      className={styles.searchForm}
      onSubmit={(event) => event.preventDefault()}
      role="search"
    >
      <Search size={19} className={styles.searchIcon} />

      <input
        type="search"
        placeholder="Search anything..."
        aria-label="Search"
      />

      <kbd className={styles.shortcut}>/</kbd>
    </form>

    {/* Authentication */}
    <div className={styles.authSection}>
      {!mounted?null:!user ? (
        <Link href="/auth" className={styles.loginButton}>
          Log in
        </Link>
      ) : (
        <>
          <Link
            href={`/users/${user?._id}`}
            className={styles.avatar}
            title={user?.name}
            aria-label={`Profile of ${user?.name}`}
          >
            {user?.name.charAt(0).toUpperCase()}
          </Link>

          <Button
            type="button"
            onClick={HandleLogout}
            className={styles.logoutButton}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </Button>
        </>
      )}
    </div>
  </div>
</header>


);
};

export default Navbar;
