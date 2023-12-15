import React, { useState, useEffect } from "react";
import {NavLink} from "react-router-dom"
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import filterFactory, { selectFilter, textFilter } from "react-bootstrap-table2-filter";
import "bootstrap/dist/css/bootstrap.css";
import ClipLoader from "react-spinners/ClipLoader";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { data } from "jquery";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#C25608",
};
import "@fortawesome/fontawesome-free/css/all.css";


function Dashboard() {
  let [category, setCategory] = useState([]);
  let [cat, setCat] = useState([]);
  const [data, setData] = useState([]);
  const [person, setPerson] = useState({});
  const [tab1, setTab1] = useState([]);
  const [tab2, setTab2] = useState([]);
  const [health, setHealth] = useState("");
  const [risk, setRisk] = useState("");
  const [riskProfile, setRiskProfile] = useState("");
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState("black");
  let [index, setIndex] = useState(0);
  const mockData = [
    { Id: 1, Age: 25, FULL: "John Doe", GENDER: "Male", MARITAL: "Single", CITY: "City1", STATE: "State1", COUNTY: "County1" },
    { Id: 2, Age: 30, FULL: "Jane Doe", GENDER: "Female", MARITAL: "Married", CITY: "City2", STATE: "State2", COUNTY: "County2" },
  ];

  useEffect(() => {
    getData();
  }, []);


  const getData = async() => {
  
   };

  const columns = [
    { dataField: "Court that issued the decision", text: "Court that issued the decision", sort: true, filter: textFilter() },
    { dataField: "Report Title", text: "Report Title", sort: true, filter: textFilter() },
    { dataField: "Volume No.", text: "Volume No.", sort: true, filter: textFilter() },
    { dataField: "Page/Section/Paragraph No.", text: "Page/Section/Paragraph No.", sort: true, filter: textFilter() },
    { dataField: "Publication Year", text: "Publication Year", sort: true, filter: textFilter() },
  ];

  const [show, setShow] = useState(false);

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
    },
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    
  }, []);


  return (
    <>
      <Container fluid>
      <Row>
      <Col lg="4" sm="6">
        <NavLink to="/admin/cases/6">
    <Card className="card-stats">
      <Card.Body className="card-primary">
        <Row>
          <Col xs="5">
          <div className="icon-big text-center icon-success">
                  <i className="fas fa-chart-bar text-success"></i>
            </div>

          </Col>
          <Col xs="7">
            <div className="numbers">
              <Card.Title as="h4" style={{fontWeight:"bold"}}>6</Card.Title>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className="text-center">
        <hr></hr>
        <div className="stats text-dark text-center">
         Cases won
        </div>
      </Card.Footer>
    </Card>
    </NavLink>
  </Col>

  <Col lg="4" sm="6">
  <NavLink to="/admin/cases/2">
    <Card className="card-stats">
      
      <Card.Body className="card-primary">
        <Row>
          <Col xs="5">
          <div className="icon-big text-center icon-danger">
                  <i className="fas fa-chart-bar text-danger"></i>
            </div>
          </Col>
          <Col xs="7">
            <div className="numbers">
              <Card.Title  style={{fontWeight:"bold"}} as="h4">2</Card.Title>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className="text-center">
        <hr></hr>
        <div className="stats text-dark text-center">
          Cases Lost
        </div>
      </Card.Footer>
    </Card>
    </NavLink>
  </Col>
  <Col lg="4" sm="6">
  <NavLink to="/admin/cases/3">
    <Card className="card-stats">
      <Card.Body className="card-primary">
        <Row>
          <Col xs="5">
          <div className="icon-big text-center icon-warning">
                  <i className="fas fa-chart-bar text-warning"></i>
            </div>
          </Col>
          <Col xs="7">
            <div className="numbers">
              <Card.Title as="h4"  style={{fontWeight:"bold"}}>3</Card.Title>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className="text-center">
        <hr></hr>
        <div className="stats text-dark text-center">
          Ongoing cases
        </div>
      </Card.Footer>
    </Card>
    </NavLink>
  </Col>
  
</Row>


        <Row>
        <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>

                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>First Name</label>
                        <Form.Control
                          defaultValue="Nikhil"
                          placeholder="Company"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="6">
                      <Form.Group>
                        <label>Last Name</label>
                        <Form.Control
                          defaultValue="Bansal"
                          placeholder="Last Name"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Address</label>
                        <Form.Control
                          defaultValue="Street:  B 18, Veena Beena Apt, Bb Thagre Marg, Sewri (east)"
                          placeholder="Home Address"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>City</label>
                        <Form.Control
                          defaultValue="Mumbai"
                          placeholder="City"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Country</label>
                        <Form.Control
                          defaultValue="India"
                          placeholder="Country"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label>Postal Code</label>
                        <Form.Control
                          placeholder="400015"
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>About Me</label>
                        <Form.Control
                          cols="80"
                          defaultValue=" Are you a legal brief?
                          Because you've presented a compelling case for
                          capturing my interest."
                          placeholder="Here can be your description"
                          rows="4"
                          as="textarea"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Update Profile
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user" style={{height:"94%"}}>
              <div className="card-image">
                <img
                  alt="..."
                  src={"https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                ></img>
              </div>
              <Card.Body>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={"https://media.licdn.com/dms/image/C4E03AQG4qnZsEjVnzQ/profile-displayphoto-shrink_800_800/0/1598050471903?e=1707350400&v=beta&t=vtE--9fwBlxPqpw_lsHx-VluPUogmrG9vGXKi_38k8E"}
                    ></img>
                    <h5 className="title">Nikhil Bansal</h5>
                  </a>
                  <p className="description">nikhil24</p>
                </div>
                <p className="description text-center">
                Are you a legal brief? <br/>
                Because you've presented a compelling case for <br/>
                capturing my interest.
                </p>
              </Card.Body>
              <hr></hr>
              <div className="button-container mr-auto ml-auto">
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-facebook-square"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-google-plus-square"></i>
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
       
      </Container>
    </>
  );
}

export default Dashboard;
