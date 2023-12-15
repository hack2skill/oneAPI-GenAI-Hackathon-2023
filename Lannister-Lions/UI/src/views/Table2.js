import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import filterFactory, { selectFilter, textFilter } from "react-bootstrap-table2-filter";
import "bootstrap/dist/css/bootstrap.css";
import ClipLoader from "react-spinners/ClipLoader";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { data } from "jquery";
import o from  './o'
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#C25608",
};

function Table2() {
  let [category, setCategory] = useState([]);
  let [cat, setCat] = useState([]);
  const [data, setData] = useState(o);
  const [person, setPerson] = useState({});
  const [tab1, setTab1] = useState([]);
  const [tab2, setTab2] = useState([]);
  const [health, setHealth] = useState("");
  const [risk, setRisk] = useState("");
  const [riskProfile, setRiskProfile] = useState("");
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState("black");
  let [index, setIndex] = useState(0);
  const history = useHistory();


  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
  //   axios("/all_mem").then((res) => {
  //     console.log(res.data);
  //     setData(res.data);
  //     var newArray = res.data.map(function (item) {
  //       const { FIRST, LAST, MARITAL, ...rest } = item;
  //       const FULL = `${FIRST} ${LAST}`;
  //       const updated = MARITAL === "" ? "S" : MARITAL;
  //       return { ...rest, FULL, MARITAL: updated };
  //     });
  //     setData(newArray);
      setLoading(false);
  //   });
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
      history.push(`/admin/summary`,{state:row});
    },
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    
  }, []);


  return (
    <>
      <Container fluid>
        {!loading ? (
        <Container fluid>
          <Row>
            <Col md="12">
              <BootstrapTable
                keyField="id"
                data={data}
                columns={columns}
                striped
                hover
                condensed
                pagination={paginationFactory()}
                rowEvents={rowEvents}
                filter={filterFactory()}
              />
            </Col>
          </Row>
        </Container>
      ) : (
        <ClipLoader color={color} loading={loading} cssOverride={override} size={150} aria-label="Loading Spinner" data-testid="loader" />
      )}
       
      </Container>
    </>
  );
}

export default Table2;
