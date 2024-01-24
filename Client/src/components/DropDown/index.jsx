import React, { useState } from "react";
import { serviceDropdown } from "../NavItems/index";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

function Dropdown() {
    const [dropdown, setDropdown] = useState(false);

    return (
        <div className="dropdown-container">
            <ul
                className={dropdown ? `${styles["services-submenu clicked"]}` : `${styles["services-submenu"]}`}
                onClick={() => setDropdown(!dropdown)}
            >
                {serviceDropdown.map((item) => {
                    return (
                        <div key={item.id}>
                            <Link
                                //   to={`products/${item.path}`}
                                to={item.path}
                                className={item.cName}
                                onClick={() => setDropdown(false)}
                            >
                                {item.title}
                            </Link>
                        </div>
                    );
                })}
            </ul>
        </div>
    );
}


export default Dropdown;
