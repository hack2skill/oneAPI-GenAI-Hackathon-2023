import React, { useState, useEffect } from "react";
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
      // let person = JSON.stringify(row);
      // axios(`/mem_card?pat_id=${row.Id}`).then((res) => {
      //   console.log(res.data);
      //   let personobj = JSON.parse(res.data[0].replace(/\\/g, ""));
      //   console.log(personobj);
      //   setIndex((index + 1) % 3);
      //   setPerson(personobj);
      //   let tab11 = JSON.parse(res.data[1].replace(/\\/g, ""));
      //   setTab1(tab11);
      //   let tab22 = JSON.parse(res.data[2].replace(/\\/g, ""));
      //   setTab2(tab22);
      //   console.log(tab22);
      // });
      // axios(`/mem_risk_score?pat_id=${row.Id}`).then((res) => {
      //   setRisk(res.data[0]);
      // });
      // axios(`/mem_health_score?pat_id=${row.Id}`).then((res) => {
      //   setHealth(res.data[0]);
      // });
      // axios(`/mem_risk_profile?pat_id=${row.Id}`).then((res) => {
      //   setRiskProfile(res.data.data.replace(/\n/g, "<br>"));
      // });
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
