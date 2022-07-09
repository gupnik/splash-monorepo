import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { setAlertModal } from './state/slices/application';
import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFoundPage from './pages/NotFound';
import { CHAIN_ID } from './config';

function App() {
  const { account, chainId } = useEthers();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  const alertModal = useAppSelector(state => state.application.alertModal);

  return (
    <div className={`${classes.wrapper}`}>
      {/* {Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      {alertModal.show && (
        <AlertModal
          title={alertModal.title}
          content={<p>{alertModal.message}</p>}
          onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
        />
      )} */}
      <BrowserRouter>
        <Switch>
          {/* <Route
            exact
            path="/noun/:id"
            render={props => <ProfilePage queenId={Number(props.match.params.id)} />}
          /> */}
          <Route component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
