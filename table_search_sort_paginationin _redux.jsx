import React, { useEffect, useState } from "react";
import Dashboard from "../../../layouts/Dashboard";
import data from "./Mock_Data.json";
//import Pagination from "../../seller/Pagination";
import ReactPaginate from "react-paginate";
import { Col, Row } from "react-bootstrap";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { Link } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Switch from "react-switch";
import {
  fileExtension,
  fileType,
} from "../../../services/Redux/Store/Constants";
import {
  loadProducts,
  getAllSellers,
  updateSeller,
  getApprovedSellersbyAdmin,
} from "../../../services/Redux/Action/Admin_actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useUrlState from "@ahooksjs/use-url-state";

const Approved_Seller = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const history = useHistory();
  const [result, setResult] = useState();
  const [updateSellerstatus, setUpdateSellerstatus] = useState(false);
  const [showPerPage, setShowPerPage] = useState(5);
  const [status, setStatus] = useState(true);
  const [totalPages, setTotalPages] = useState();

  const [queryParams, setQueryParams] = useUrlState({
    query: "",
    limit: 10,
    page: 1,
  });
  const [editData, setEditData] = useState({
    _id: "",
    status: "",
    personalInfo: {
      sellerName: "",
    },
  });
  let limit = 5;

  console.log(editData);

  // const [pagination, setpagination] = useState({
  //   start: 0,
  //   end: showPerPage,
  // });

  // const onPageChange = (start, end) => {
  //   setpagination({ start: start, end: end });
  // };

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(getAllSellers());
    dispatch(getApprovedSellersbyAdmin(queryParams));
  }, []);

  //console.log(selector.seller.allSellers, "approvedSellers")
  console.log(totalPages + "totel page");
  useEffect(() => {
    setResult(selector.ReducerFunctions.approvedSellers);
    let len = Math.ceil(
      selector.ReducerFunctions.approvedSellers &&
        selector.ReducerFunctions.approvedSellers.length / parseInt(queryParams.limit)
    );
    setTotalPages(len);
  }, [selector]);
  useEffect(() => {
    dispatch(getApprovedSellersbyAdmin(queryParams));
    setResult(selector.ReducerFunctions.approvedSellers);
    let len = Math.ceil(
      selector.ReducerFunctions.approvedSellers &&
        selector.ReducerFunctions.approvedSellers.length / parseInt(queryParams.limit)
    );
    setTotalPages(len);
  }, [queryParams]);

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(getApprovedSellersbyAdmin(queryParams));
  }, [updateSellerstatus]);

  useEffect(() => {
    // console.log(selector.seller.allSellers, "selector");
    // const result = selector.seller.allSellers?.filter(
    //   (item, index) => item.status.toLowerCase() === "approved"
    // );
    // setResult(result);
    // console.log("filter ", result);
  }, [selector]);
  console.log(queryParams.page);

  const searchyShop = (e) => {
    let { value } = e.target;
    let filterdata = data.data.filter((i) => {
      return i.shopName.toLowerCase().includes(value.toLowerCase());
    });
    if (value == "") {
      setResult(result);
    } else if (filterdata) {
      setResult(filterdata);
    }
  };
  const searchyOwner = (e) => {
    let { value } = e.target;
    let filterdata = data.data.filter((i) => {
      return i.firstName.toLowerCase().includes(value.toLowerCase());
    });
    if (value == "") {
      setResult(result);
    } else if (filterdata) {
      setResult(filterdata);
    }
  };

  const [sort, setSort] = useState(false);
  const [sort1, setSort1] = useState(false);

  const sortbyName = () => {
    const sortData = result
      .sort((a, b) => (a.shopName > b.shopName ? 1 : -1))
      .map((item, i) => item);
    setResult(sortData);
  };
  const sortbyName1 = () => {
    const sortData = result
      .sort((a, b) => (a.shopName < b.shopName ? 1 : -1))
      .map((item, i) => item);
    setResult(sortData);
  };

  const sortbyOwner = () => {
    const sortData = result
      .sort((a, b) => (a.firstName > b.firstName ? 1 : -1))
      .map((item, i) => item);
    setResult(sortData);
  };

  const sortbyOwner1 = () => {
    const sortData = result
      .sort((a, b) => (a.firstName < b.firstName ? 1 : -1))
      .map((item, i) => item);
    setResult(sortData);
  };

  const exportToExcel = () => {
    let xls = result.map((row) => {
      console.log("row", row);
      return {
        ID: row.id,
        status: row.status == 1 ? "active" : "Inactive",
        voucher_name: row.voucher_name,
        voucher_code: row.voucher_code,
        remaining_voucher: row.remaining_voucher,
        used_voucher: row.used_voucher,
      };
    });
    const ws = XLSX.utils.json_to_sheet(xls);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Vouchers List" + fileExtension);
  };

  // const handlePageClick = async (data) => {
  //   let currentpage = data.selected + 1;

  //   console.log(currentpage);
  // };

  return (
    <Dashboard title="Approved Sellers">
      <div
        class="modal fade "
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Edit Details
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div className="iq-card">
                <div className="iq-card-body">
                  <label>Status</label>
                  <Switch
                    checked={status}
                    onChange={(e) => {
                      setStatus((pre) => !pre);

                      setEditData({ ...editData, status: !status });
                    }}
                  />
                  {/* <input 
                  name="status"
                id="toggle-trigger" 
                type="checkbox" 
                checked={editData.status}
                data-toggle="toggle"
                onChange={(e) => {
                      setStatus((pre) => !pre);
                      // console.log("Active ", active)
                      setEditData({ ...editData, [e.target.name]: 'Dicline' });
                    }} /> */}

                  <br />
                  <br />

                  <label>SellerName</label>
                  <input
                    placeholder="SellerName"
                    name="personalInfo.sellerName"
                    value={editData.personalInfo.sellerName}
                    className="w-75 form-control float-right"
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        personalInfo: {
                          ...editData.personalInfo,
                          ["sellerName"]: e.target.value,
                        },
                      })
                    }
                  />
                  <br />
                  <br />
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                data-dismiss="modal"
                class="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* /////////////////////////////////////////////////////////////// */}
      <div className="iq-card">
        <div className="iq-card-body">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="iq-search-bar w-100 mt-2 p-0">
                <form action="#">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 br-1 d-flex">
                      <div className="searchbox w-100 ">
                        <input
                          type="text"
                          className="text search-input"
                          placeholder="Shop Name"
                          onChange={searchyShop}
                        />
                        <a className="search-link" href="#">
                          <i className="ri-search-line"></i>
                        </a>
                      </div>
                      <div className="searchbox w-100 ml-3">
                        <input
                          type="text"
                          className="text search-input"
                          placeholder="Owner Name"
                          onChange={searchyOwner}
                        />
                        <a className="search-link" href="#">
                          <i className="ri-search-line"></i>
                        </a>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 text-end">
                      <button className="btn btn-info ">Refresh</button>
                      <button
                        className="btn btn-success ml-2"
                        disabled={data.length == 0}
                        onClick={(e) => {
                          e.preventDefault();
                          exportToExcel();
                        }}
                      >
                        Export
                      </button>

                      <Link
                        to="/admin/seller/approved_seller_add"
                        className="btn btn-primary justify-content-end ml-2"
                      >
                        <i className="las la-plus"></i>
                        New Seller
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id="content-page" className="container-fluid">
          <div classNameName="row content-body">
            <div classNameName="col-lg-12">
              <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                <div className="iq-card-body">
                  <div className="mb-3">
                    Show &nbsp;
                    <select
                      selected={queryParams.limit}
                      value={queryParams.limit}
                      onChange={(e) => {
                        setQueryParams({
                          ...queryParams,
                          ["limit"]: e.target.value,
                        });
                      }}
                    >
                      <option value="2">2</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                    </select>
                    &nbsp;entries
                  </div>
                  <div className="table-responsive">
                    <table className="table mb-0 table-borderless tbl-server-info">
                      <thead>
                        <tr>
                          <th
                            onClick={() => {
                              setSort((pre) => !pre);
                              {
                                sort ? sortbyName() : sortbyName1();
                              }
                            }}
                          >
                            Seller Name
                            {sort ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                          </th>
                          {/* <th
                            onClick={() => {
                              setSort1(pre => !pre);
                              {
                                sort1 ? sortbyOwner() : sortbyOwner1();
                              }
                            }}
                          >
                            Owner
                            {sort1 ? (
                              <ArrowUpwardIcon />
                            ) : (
                              <ArrowDownwardIcon />
                            )}
                          </th> */}
                          <th>Status</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {result &&
                          result.map((li, id) => {
                            {/* if (id < queryParams.limit) { */}
                              return (
                                <tr key={id + 1}>
                                  <td>
                                    {li.personalInfo &&
                                      li.personalInfo.sellerName
                                        .charAt(0)
                                        .toUpperCase() +
                                        li.personalInfo.sellerName.slice(1)}
                                  </td>
                                  <td>{li.status}</td>
                                  <td>
                                    <Link
                                      to="/admin/seller/approved_seller_voucher"
                                      title="Vouchers List"
                                      className="ri-profile-line ml-2"
                                    ></Link>

                                    <Link
                                      title="edit"
                                      className="ri-edit-line ml-2"
                                      data-toggle="modal"
                                      data-target="#exampleModal"
                                      onClick={() => {
                                        setEditData(li);
                                      }}
                                    ></Link>

                                    <Link
                                      title="move to pending"
                                      className="ri-restart-line ml-2"
                                      onClick={() => {
                                        setUpdateSellerstatus(true);
                                        dispatch(
                                          updateSeller(li._id, "Pending")
                                        );
                                      }}
                                    ></Link>

                                    <Link
                                      title="decline"
                                      className="ri-forbid-line ml-2"
                                      onClick={() => {
                                        setUpdateSellerstatus(true);
                                        dispatch(
                                          updateSeller(li._id, "Decline")
                                        );
                                      }}
                                    ></Link>
                                  </td>
                                </tr>
                              );
                          })}
                            {/* } */}
                      </tbody>
                    </table>

                    {result && result.length == 0 && (
                      <div
                        style={{
                          width: "50%",
                          margin: "auto",
                          textAlign: "center",
                        }}
                      >
                        No Pending Seller Available
                      </div>
                    )}

                    <div className="d-flex justify-content-end">
                      <Pagination
                        onChange={(e, value) => {
                          setQueryParams({ ...queryParams, ["page"]: value });
                        }}
                        count={totalPages}
                        color="primary"
                        // variant="outlined"
                        shape="rounded"
                      />
                      {/* <Pagination 
                count={totalPages}
                 page={queryParams.page}
                /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Approved_Seller;
