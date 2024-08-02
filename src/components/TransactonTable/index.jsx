import { Table, Select, Radio } from "antd";
import { React, useState } from "react";
import "./style.css";
import searchImg from "../../assets/search.svg"
import { unparse, parse } from "papaparse";

function TransactionTable({ transaction, addTransaction, fetchTransactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { Option } = Select;
  const [sortKey, setSortKey] = useState("");
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "Tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "Type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];
  let filteredTransaction = transaction.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  const sortedTransactions = [...filteredTransaction].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  // function exportCSV(){
  //   var csv = unparse({
  //     "fields": ["name", "type", "tag", "type"],
  //     transaction,
  //   });
  //   var data = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  //   var csvURL = window.URL.createObjectURL(data);
  //   tempLink = document.createElement('a');
  //   tempLink.href = csvURL;
  //   tempLink.setAttribute('download', 'transaction.csv');
  //   tempLink.click();
  // }

  function exportToCsv() {
    const csv = unparse({
      fields: ["name", "type", "date", "amount", "tag"],
      transaction,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            console.log("Results: ", results);
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      // toast.error(e.message);
    }
  }

  return (
    // <>
    //     <div className="input-flex">
    //       <img src={searchImg} width="16" />
    //       <input
    //         placeholder="Search by Name"
    //         onChange={(e) => setSearch(e.target.value)}
    //       />
    //     </div>
    //       <Select
    //         className="select-input"
    //         onChange={(value) => setTypeFilter(value)}
    //         value={typeFilter}
    //         placeholder="Filter"
    //         allowClear
    //       >
    //         <Option value="">All</Option>
    //         <Option value="income">Income</Option>
    //         <Option value="expense">Expense</Option>
    //       </Select>
        
        
    //       <Radio.Group
    //         className="input-radio"
    //         onChange={(e) => setSortKey(e.target.value)}
    //         value={sortKey}
    //       >
    //         <Radio.Button value="">No Sort</Radio.Button>
    //         <Radio.Button value="date">Sort by Date</Radio.Button>
    //         <Radio.Button value="amount">Sort by Amount</Radio.Button>
    //       </Radio.Group>
    //   <Table dataSource={sortedTransactions} columns={columns} />
    // </>

    <>
     <div className="table"
      style={{
        width: "95%",
        padding: "0rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} width="16" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportToCsv}>
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue"  >
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table columns={columns} dataSource={sortedTransactions} />
      </div>
    </div>
    </>
  );
}

export default TransactionTable;
