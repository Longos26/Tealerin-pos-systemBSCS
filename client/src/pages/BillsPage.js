import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";  
import axios from "axios";
import { Modal, Button, Table } from "antd";
import "../styles/InvoiceStyles.css";

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [salesData, setSalesData] = useState({});

  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
      updateSalesData(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  const updateSalesData = (bills) => {
    const sales = {};
    bills.forEach((bill) => {
      const date = bill.date.toString().substring(0, 10);
      if (!sales[date]) {
        sales[date] = 0;
      }
      sales[date] += bill.totalAmount;
    });
    setSalesData(sales);
  };

  useEffect(() => {
    getAllBills();
    // eslint-disable-next-line
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
    removeAfterPrint: true
  });

  const columns = [
    { title: "ID ", dataIndex: "_id" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Contact No", dataIndex: "customerNumber" },
    { title: "Subtotal", dataIndex: "subTotal" },
    { title: "Tax", dataIndex: "tax" },
    { title: "Total Amount", dataIndex: "totalAmount" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (_id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Invoice list</h1>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {popupModal && (
        <Modal
          width={400}
          pagination={false}
          title="Invoice Details"
          visible={popupModal}
          onCancel={() => setPopupModal(false)}
          footer={false}
        >
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="logo" />
              <div className="info">
                <h2>TeaLerin</h2>
                <p> Contact : 0927-368-5006 | Block 10 Lot 23 Long Road</p>
              </div>
            </center>
            <div id="mid">
              <div className="mt-2">
                <p>
                  Customer Name: <b>{selectedBill.customerName}</b>
                  <br />
                  Phone No: <b>{selectedBill.customerNumber}</b>
                  <br />
                  Date: <b>{selectedBill.date.toString().substring(0, 10)}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item"><h2>Item</h2></td>
                      <td className="Hours"><h2>Qty</h2></td>
                      <td className="Rate"><h2>Price</ h2></td>
                      <td className="Rate"><h2>Total</h2></td>
                    </tr>
                    {selectedBill.cartItems.map((item) => (
                      <tr className="service" key={item.name}>
                        <td className="tableitem"><p className="itemtext">{item.name}</p></td>
                        <td className="tableitem"><p className="itemtext">{item.quantity}</p></td>
                        <td className="tableitem"><p className="itemtext">{item.price}</p></td>
                        <td className="tableitem"><p className="itemtext">{item.quantity * item.price}</p></td>
                      </tr >
                    ))}
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate"><h2>Tax</h2></td>
                      <td className="payment"><h2>₱{selectedBill.tax}</h2></td>
                    </tr>
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate"><h2>Grand Total</h2></td>
                      <td className="payment"><h2><b>₱{selectedBill.totalAmount}</b></h2></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div id="legalcopy">
                <p className="legal">
                  <strong>Thank you for your order!</strong> 10% GST application on total amount.
                  Please note that this is a non-refundable amount. For any assistance, please email <b>paolonavarrosa@gmail.com</b>.
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>Print</Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};


export default BillsPage;