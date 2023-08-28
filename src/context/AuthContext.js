import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": //! 1- So we return a new state right here where the user is the action payload and therefore we're updating state
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true }; //! Now inside that we set the user to be whatever user firebase sent back to us,

    default:
      return state; //* that's if when we call this function using a dispatch, if the action type that we pass through doesn't match any of the cases we'll create later, it just defaults to this and returns the state.
  }
};

export const AuthContextProvider = ({ children }) => {
  //! 2- Now when we update the state, the component is re evaluated, it runs again and therefore we log that new user to the console.
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    //! this function to find out whether we're logged in or not. We fire this function where the user is either null or the user logged in.
    //*  for every authentication change in the future, once we unsubscribe, it no longer fires
    const unsub = projectAuth.onAuthStateChanged((user) => {
      //! when this useEffect function fires, we reach out to Firebase and say, Look, give us the initial value of the user.
      dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);
  // console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
