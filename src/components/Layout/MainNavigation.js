import { Link } from 'react-router-dom';
import { useContext } from 'react';
import classes from './MainNavigation.module.css';
import AuthContext from '../../store/auth-context';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  //we get whether the used is loged in or not by below line of code
  const isLoggedIn = authCtx.isLoggedIn;//we use this to conditionally render nav bar

  const logoutHandler = () => {
    authCtx.logout();
  };
  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn &&
            (<li>
              <Link to='/auth'>Login</Link>
            </li>)}
          {isLoggedIn &&
            (<li>
              <Link to='/profile'>Profile</Link>
            </li>)}
          {isLoggedIn &&
            (<li>
              <button onClick={logoutHandler}>Logout</button>
            </li>)}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
