import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {  Switch } from "react-router-dom";
import { AboutPage } from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalog";
import { ProductDetails } from "../../features/catalog/ProductDetails";
import { ContactPage } from "../../features/contact/ContactPage";
import { HomePage } from "../../features/home/HomePage";
import 'react-toastify/dist/ReactToastify.css';
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import Header from "./Header";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import LoadingComponent from "./LoadingComponent";
import PrivateRoute from "./PrivateRoute";
import Orders from "../../features/orders/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";

function App() {

  const dispatch = useAppDispatch();


  const [loading,setLoading] = useState(true);

  const initApp = useCallback(async () =>{
    try {
      await dispatch(fetchCurrentUser());

      await dispatch(fetchBasketAsync());
    } catch (error) {
      
      console.log(error)
      
    }
  },[dispatch])
  useEffect(()=>{
    initApp().then(()=>setLoading(false));
  },[initApp]);
  
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  if (loading) return <LoadingComponent message="Initialising app..." />
  return (
    <ThemeProvider theme={theme} >
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header isDarkMode={darkMode} setDarkMode={() => setDarkMode(!darkMode)} />
      <Route path={'/'} exact component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <Container sx={{ mt: 4 }}>
          <Switch>
            <Route path={'/catalog'} exact component={Catalog} />
            <Route path={'/catalog/:id'} component={ProductDetails} />
            <Route path={'/about'} component={AboutPage} />
            <Route path={'/contact'} component={ContactPage} />
            <Route path={'/server-error'} component={ServerError} />
            <Route path={'/basket'} component={BasketPage} />
            <PrivateRoute path={'/checkout'} component={CheckoutWrapper} />
            <PrivateRoute path={'/orders'} component={Orders} />
            <Route path={'/login'} component={Login} />
            <Route path={'/register'} component={Register} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      )} />

    </ThemeProvider>
  );
}

export default App;

