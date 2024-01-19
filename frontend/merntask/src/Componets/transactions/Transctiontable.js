import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import "./transactiontable.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/esm/Button";
import Loder from "../loder/Loder";
import { Bar } from "react-chartjs-2";
import BarChartComponent from "../BarChartComponent/BarChartComponent";

function Transctionstable() {
  const [getAllData, setGetAllData] = useState([]);
  const monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [selectedMonth, setSelectedMonth] = useState(monthArray[2]);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(2022);
  const [statistics, setStatistics] = useState([]);
  const [chartData, setChartData] = useState({});

  const getQueryData = async () => {
    try {
      setLoading(true);
      const formattedSearch = typeof search === "number" ? search.toString() : search;

      const payload = {
        page: pageNo,
        perPage: perPage,
        search: search,
      };
      //const url = `http://localhost:5000/api/transactions/quryresult?page=${pageNo}&perPage=${perPage}&search=${encodeURIComponent(formattedSearch)}`;
      const url = "http://localhost:5000/api/transactions/quryresult";
      const getData = await axios.post(url, payload); //here use both url is working but post is good for accurate result
      setGetAllData(getData.data.transactions);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    getQueryData();
  };
  const handleNextClick = () => {
    setPageNo(pageNo + 1);
  };
  const getStatisticsResult = async () => {
    try {
      setLoading(true);
      const getData = await axios.get(
        `http://localhost:5000/api/statistics/${selectedMonth}`
      );
      setStatistics(getData.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/getPriceRangesChart/${selectedMonth}`
      );
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    getQueryData();
  };
  useEffect(() => {
    getQueryData();
    getStatisticsResult();
    fetchData();
  }, [pageNo, perPage, selectedMonth]);
  return (
    <>
      <div>
        {loading ? <Loder /> : ""}
        <div className="box">
          <div className="heading searchBox">
            <div className="">
              <input
                type="search"
                placeholder="Search transaction"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />{" "}
              <Button variant="secondary" onClick={() => handleSearch()}>
                Search
              </Button>
            </div>
            <div className="text-end">
              <DropdownButton
                id="dropdown-item-button"
                title={selectedMonth}
                variant="warning"
              >
                {monthArray.map((itm) => (
                  <Dropdown.Item
                    key={itm}
                    as="button"
                    onClick={() => handleMonthChange(itm)}
                  >
                    {itm}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          </div>
        </div>
        <div className="table mt-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title </th>
                <th>Description </th>
                <th>Price</th>
                <th>Catagory</th>
                <th>Sold</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {getAllData &&
                getAllData.map((row) => (
                  <tr>
                    <td>{row.id}</td>
                    <td>{row.title}</td>
                    <td>{row.description}</td>
                    <td>{row.price}</td>
                    <td>{row.category}</td>
                    <td>{row.sold == true ? "true" : "false"}</td>
                    <td>
                      {
                        <img
                          src={row.image}
                          style={{ height: "100px", width: "100px" }}
                        />
                      }
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        <div className="heading searchBox">
          <div>
            <span>Page No</span> : {pageNo}
          </div>
          <div>
            <Button variant="secondary" onClick={() => handleNextClick()}>
              Next
            </Button>{" "}
            -{" "}
            <Button
              variant="secondary"
              onClick={() => setPageNo(pageNo == 0 ? 0 : pageNo - 1)}
            >
              Previous
            </Button>{" "}
          </div>
          <div>
            <span>Per Page</span> : {perPage}
          </div>
        </div>
        <div>
          <h1 className="text-center mt-5">Statistics - {selectedMonth}</h1>
          <div className="text-center mt-5">
            <h6>Total Sale : {statistics?.totalSoldItemsPrice}</h6>
            <h6>Total Sold Item : {statistics?.totalSoldItemsCount}</h6>
            <h6>Total Not Sold Item : {statistics?.totalUnsoldItemsCount}</h6>
          </div>
        </div>
        <div className="text-center mt-5">
          <BarChartComponent data={chartData} />
        </div>
      </div>
    </>
  );
}

export default Transctionstable;
