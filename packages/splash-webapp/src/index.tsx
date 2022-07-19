import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainId, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import account from './state/slices/account';
import application from './state/slices/application';
import project from './state/slices/project';
import projects, { setProjects } from './state/slices/projects';
import { ApolloProvider, useQuery } from '@apollo/client';
import { clientFactory, projectsQuery } from './wrappers/subgraph';
import { useEffect } from 'react';
import config, { CHAIN_ID, createNetworkHttpUrl } from './config';
import dotenv from 'dotenv';
import { useAppDispatch, useAppSelector } from './hooks';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, createStore, combineReducers, PreloadedState } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { MoralisProvider } from "react-moralis";

dotenv.config();

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    project,
    projects
  });

export default function configureStore(preloadedState: PreloadedState<any>) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Mumbai]: createNetworkHttpUrl('mumbai'),
    [ChainId.Rinkeby]: createNetworkHttpUrl('rinkeby'),
    [ChainId.Mainnet]: createNetworkHttpUrl('mainnet'),
    [ChainId.Hardhat]: 'http://localhost:8545',
  },
};

const client = clientFactory(config.app.subgraphApiUri);

const Updaters = () => {
  return (
    <>
    </>
  );
};

const ChainSubscriber: React.FC = () => {
  // const dispatch = useAppDispatch();

  // const loadState = async () => {
  //   const wsProvider = new WebSocketProvider(config.app.wsRpcUri);
  //   const splashProjectContract = SplashProjectFactory.connect(
  //     config.addresses.splashProject,
  //     wsProvider,
  //   );

  //   const projectFilter = splashProjectContract.filters.ProjectCreated(null, null, null, null);
  //   const constituentFilter = splashProjectContract.filters.ConstituentAdded(null, null);
  //   const processProjectFilter = async (
  //     queenId: BigNumberish,
  //     sender: string,
  //     value: BigNumberish,
  //     event: any,
  //   ) => {
  //     const timestamp = (await event.getBlock()).timestamp;
  //     const transactionHash = event.transactionHash;
  //     // dispatch( );
  //   };
  // };
  // loadState();

  return <></>;
};

const Projects: React.FC = () => {
  const account = useAppSelector(state => state.account);
  const { data } = useQuery(projectsQuery(account.activeAccount));
  const dispatch = useAppDispatch();

  useEffect(() => {
    data && dispatch(setProjects({ data }));
  }, [data, account, dispatch]);

  return <></>;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ChainSubscriber />
      <React.StrictMode>
        <Web3ReactProvider
          getLibrary={
            provider => new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
          }
        >
          <ApolloProvider client={client}>
            <DAppProvider config={useDappConfig}>
                <Projects />
                <MoralisProvider serverUrl="https://1pwccqwdxtwq.usemoralis.com:2053/server" appId="rAiqr5wWWnZwl8tVdgylIyoqLq26htRDEqpMCCMI">
                <App />
                </MoralisProvider>
                <Updaters />
            </DAppProvider>
          </ApolloProvider> 
        </Web3ReactProvider>
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
