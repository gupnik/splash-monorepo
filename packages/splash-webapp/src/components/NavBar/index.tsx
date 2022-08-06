import { useAppSelector } from '../../hooks';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/Splash.png';
import { useState } from 'react';
import { useEthers } from '@usedapp/core';
import WalletConnectModal from '../WalletConnectModal';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import clsx from 'clsx';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();

  const [showConnectModal, setShowConnectModal] = useState(false);

  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const connectedContent = (
    <>
      <Nav.Item>
        <Nav.Link className={clsx(classes.nounsNavLink, classes.addressNavLink)} disabled>
          <span className={classes.greenStatusCircle} />
          <span>{activeAccount && <ShortAddress address={activeAccount} avatar={true} />}</span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          className={clsx(classes.nounsNavLink, classes.disconnectBtn)}
          onClick={() => {
            setShowConnectModal(false);
            deactivate();
            setShowConnectModal(false);
          }}
        >
          DISCONNECT
        </Nav.Link>
      </Nav.Item>
    </>
  );

  const disconnectedContent = (
    <>
      <Nav.Link
        className={clsx(classes.nounsNavLink, classes.connectBtn)}
        onClick={showModalHandler}
      >
        CONNECT WALLET
      </Nav.Link>
    </>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <Navbar expand="lg" className={classes.nav}>
        <Container>
          <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
            <img
              src={logo}
              width="85"
              className="d-inline-block align-middle"
              alt="Nouns DAO logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className={classes.navToggle} />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link
              href={`/profile/${activeAccount}`}
              className={classes.nounsNavLink}
              rel="noreferrer"
            >
              PROFILE
            </Nav.Link>
            <Nav.Link
              href={"https://testnets.opensea.io/collection/splash-projects"}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              OPENSEA
            </Nav.Link>
            <Nav.Link
              href={"https://thegraph.com/hosted-service/subgraph/gupnik/splash"}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              SUBGRAPH
            </Nav.Link>
            <Nav.Link
              href={"https://drive.google.com/file/d/1AqgGKbx834Rw5lfv_PFnPa5-CIMtfW8L/view?usp=sharing"}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              PITCH DECK
            </Nav.Link>
            {/*<Nav.Link as={Link} to="/playground" className={classes.nounsNavLink}>
              PLAYGROUND
            </Nav.Link> */}
            {activeAccount ? connectedContent : disconnectedContent}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
