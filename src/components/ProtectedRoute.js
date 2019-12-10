import React, { useState, useEffect } from "react";
import { Redirect, Route } from 'react-router-dom';
import { useHistory } from "react-router-dom";



export default ({ component: Component, ...rest }) => (
  // TO-DO: useEffect add middleware to redirect to login if the spotify token is expired

  <Route {...rest} render={props => (
    localStorage.getItem('token') !== null ? (
      <Component {...props} />
    ) : (
      <Redirect to='/login'
      />
    )
  )} />
);
