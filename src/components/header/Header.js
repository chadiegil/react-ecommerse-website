import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import styles from "./Header.module.scss";
import { FaShoppingCart, FaTimes, FaUserCircle } from "react-icons/fa";
import { RiMenu4Line } from "react-icons/ri";
import { auth } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
} from "../../redux/slice/authSlice";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/hidddenLink";
import { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalQuantity,
} from "../../redux/slice/cartSlice";

import { MdOutlineFastfood } from "react-icons/md";

const logo = (
  <div className={styles.logo}>
    <Link
      to="/"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
    >
      <span>
        <MdOutlineFastfood
          size="25"
          color="white"
          style={{ marginRight: "4px" }}
        />
      </span>
      <h2 style={{ display: "inline-block" }}>
        <span>Ba</span>zak
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [scrollPage, setScrollPage] = useState(false);

  const cartTotalQuantity = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY);
  }, []);

  // const navBarColor = () => {
  //   if (window.scrollY > 420) {
  //     setScrollPage(true);
  //     console.log("50px");
  //     console.log(scrollPage);
  //     console.log(window.scrollY);
  //   }
  //   setScrollPage(false);
  //   console.log(window.scrollY);
  // };

  // window.addEventListener("scroll", navBarColor);

  useEffect(() => {
    const navBarColor = () => {
      if (window.scrollY > 430) {
        setScrollPage(true);
      }
      if (window.scrollY < 420) {
        setScrollPage(false);
      }
    };

    window.addEventListener("scroll", navBarColor);
  }, [scrollPage]);

  //track the current signin user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName == null) {
          //getting the username from the email
          const u1 = user.email.slice(0, -10);

          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setDisplayName(uName);
        } else {
          setDisplayName(user.displayName);
        }

        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName ? displayName : displayName,
            userID: user.uid,
          })
        );
      } else {
        dispatch(REMOVE_ACTIVE_USER());
        setDisplayName("");
      }
    });
  }, [dispatch, displayName]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        // toast.success("Logout successfully");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">
        Cart
        <FaShoppingCart size={20} />
        <p>{cartTotalQuantity}</p>
      </Link>
    </span>
  );

  return (
    <header className={scrollPage ? styles.fixedBackground : styles.fixed}>
      <div className={scrollPage ? styles.background : styles.header}>
        {logo}

        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
          }
        >
          <div
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={hideMenu}
          ></div>

          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={22} color="#fff" onClick={hideMenu} />
            </li>
            <AdminOnlyLink>
              <Link to="/admin/home">
                <button
                  // className="--btn --btn-primary"
                  className={styles["button-85"]}
                >
                  Admin
                </button>
              </Link>
            </AdminOnlyLink>
            <li>
              <NavLink
                to="/"
                className={activeLink}
                end
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={activeLink}>
                Contact Us
              </NavLink>
            </li>
          </ul>
          <div className={styles["header-right"]} onClick={hideMenu}>
            <span className={styles.links}>
              <ShowOnLogin>
                <a href="#home" style={{ color: "#ff7722" }}>
                  <FaUserCircle size={16} />
                  Hi, {displayName}
                </a>
              </ShowOnLogin>
              <ShowOnLogout>
                <NavLink className={activeLink} to="/login">
                  Login
                </NavLink>
              </ShowOnLogout>
              <ShowOnLogin>
                <NavLink className={activeLink} to="/order-history">
                  My Orders
                </NavLink>
              </ShowOnLogin>

              <ShowOnLogin>
                <NavLink
                  className={activeLink}
                  to="/logout"
                  onClick={logoutUser}
                  end
                >
                  Logout
                </NavLink>
              </ShowOnLogin>
            </span>
            {cart}
          </div>
        </nav>

        <div className={styles["menu-icon"]}>
          {cart}

          <RiMenu4Line
            size={28}
            onClick={toggleMenu}
            style={{ backgroundColor: "transparent" }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
