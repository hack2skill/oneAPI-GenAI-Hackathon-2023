import React from "react";
import {NavLink} from "react-router-dom"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Form } from "react-bootstrap";

function Registers() {
  return (
    <>
    <Container className="my-5 mt-5 gradient-form">
  <Row>
    <Col className="text-center mx-auto" style={{ maxWidth: "400px" }}>
      <div className="d-flex flex-column ms-5">
      <div className="text-center">
             <p>Powered by</p> 
              <img width="300px" style={{marginLeft:"10px"}} src="https://www.intel.com/content/dam/develop/public/us/en/images/thumbnails/tool-thumbnail-beta-oneapi-logo.jpg"/>
              <h4 className="mt-1 mb-3 mt-5 pb-1 h3">Register</h4>
            </div>

        <Form.Group className="mb-4" controlId="form1">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <Form.Group className="mb-4" controlId="form1">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" />
        </Form.Group>

        <Form.Group className="mb-4" controlId="form2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <div className="text-center pt-1 mb-3 pb-1">
          <Button className="mb-4 w-100 gradient-custom-2">Sign in</Button>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4 mt-0 pt-0">
          <p className="mb-0">Already have an account?</p>
          <NavLink to="/admin/login">
          <Button variant="outline-primary" className="btm-primary mx-2">
            Login
          </Button>
          </NavLink>
        </div>
      </div>
    </Col>
  </Row>
</Container>

    </>
  );
}

export default Registers;
