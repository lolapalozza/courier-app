import React, {useEffect, useState} from 'react';
import {Box, Grid} from '@mui/material';

import {DropsList} from "./List.jsx";
import {authorization} from "./authorization.js";
import {useNavigate} from "react-router-dom";
import {fetchCities, fetchCouriers, fetchProducts, getUser} from "./api.js";

const App = () => {

  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState({})

  useEffect(() => {
    if(process.env.REACT_APP_ENV === 'local'){
      setIsAuth(true)
    }else{
      authorization.init().then((data) => {
        if(data.result){
          setIsAuth(true)
        }
      })
    }

  }, [])

  useEffect(() => {
    if(isAuth){
      getUser().then((user) => {
        setUser(user)
      }).catch((error) => console.error(error))
    }
  }, [isAuth]);

  const goAddRoute = () => {
    navigate("/add")
  }

  const goMain = () => {
    navigate("/")
  }

  return (
    <Box component="form" sx={{ maxWidth: 600, margin: 'auto', padding: 2, bgColor: "fff" }}>
      <Grid container spacing={2}>

        <div className="greet-container">
          <div style={{backgroundColor: user.isCourier ? "darkseagreen" : "coral"}} className="text">
            <div>Hello, {user.full_name}</div>
            <div className="courier-text">{user.isCourier ? "You can add drops" : "You can't add drops"}</div>
          </div>
        </div>

        <div>
          <button type="button" onClick={goMain}>Список моих кладов</button>
          <button type="button" onClick={goAddRoute}>Добавить клад</button>
        </div>

        <div style={{width: "100%"}}>
          <DropsList user={user} />
        </div>

      </Grid>
    </Box>
  );
};

export default App;

