import React, { useState } from "react";
import {NavLink,useHistory} from 'react-router-dom';
import { Button, Form, Container, Row, Col } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("intelapi", email);
    history.push("/admin/dashboard");
  };

  return (
    <Container className="my-5 mt-5 gradient-form">
      <Row>
        <Col className="text-center mx-auto" style={{ maxWidth: "400px" }}>
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
             <p>Powered by</p> 
              <img width="300px" style={{marginLeft:"10px"}} src="https://www.intel.com/content/dam/develop/public/us/en/images/thumbnails/tool-thumbnail-beta-oneapi-logo.jpg"/>
              <h4 className="mt-1 mb-3 mt-5 pb-1 h3">Login</h4>
            </div>

            <Form onSubmit={handleFormSubmit}>
              <Form.Group className="mb-4" controlId="form1">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="form2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <div className="text-center pt-1 mb-3 pb-1">
                <Button type="submit" className="mb-4 w-100 gradient-custom-2">
                  Sign in
                </Button>
              </div>
            </Form>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4 mt-0 pt-0">
              <p className="mb-0">Don't have an account?</p>
              <NavLink to="/admin/register">
                <Button variant="outline-primary" className="btm-primary mx-2">
                  Sign Up
                </Button>
              </NavLink>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
