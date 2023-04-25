import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";

import classes from "./navbar.module.css";

function AppNavbar() {
  return (
    <Navbar bg="dark" expand="lg" className={classes.navbar}>
      <Container>
        <Navbar.Brand href="/">
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            {/* <Nav.Link>RPG Search</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;