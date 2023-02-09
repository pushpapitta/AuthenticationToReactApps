import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';
import classes from './AuthForm.module.css';

const AuthForm = () => {

  const [isLogin, setIsLogin] = useState(true);

  //for showing proper feedback to user,using this to only show the button if we re not loading
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  //if user is in signup mode,account shd be created on firebase
  //if user is in login mode,user shd be able to login
  const submitHandler = (event) => {
    event.preventDefault();

    //either use useState n sotre of every keystroke or
    //use useRef and save data 
    const enteredEmail = emailInputRef.current.value;
    const enteredpassword = passwordInputRef.current.value;

    //set to true,if u re starting to send a request,right before making into if block
    setIsLoading(true);
    let url;
    //to check if the mode is currently ..login or signup
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCY4fk4HhY6_-yfybZV7MbqGhNws-kEUBM'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCY4fk4HhY6_-yfybZV7MbqGhNws-kEUBM'
    }
    //login/signup
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredpassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-type': 'application.json'
        }
      }
    )
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication failed!';
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // console.log(data);
        const expirationTime = new Date((new Date().getTime() + (+date.expiresIn * 1000)));
        authCtx.login(data.idToken, expirationTime.toISOString());
        //redirects the user to a diff page 
        history.replace('/')
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
