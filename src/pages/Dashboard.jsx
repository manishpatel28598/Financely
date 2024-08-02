import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddExpense from "../components/Modals/AddExpense";
import AddIncome from "../components/Modals/AddIncome";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Transaction,
} from "firebase/firestore";
import TransactionTable from "../components/TransactonTable";
import ChartComponent from "../components/Charts/rindex";
import NoTransaction from "../components/NoTransactions";
function Dashboard() {
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setToatalBalance] = useState(0);
  const [user] = useAuthState(auth);
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      let newArr = Transaction;
      newArr.push(transaction);
      setTransaction(newArr);
      console.log(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    //get all docs from a collection
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transaction]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transaction.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setToatalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    // setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransaction(transactionsArray);
      console.log(transactionsArray);
      // toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  let sortedTransactions = transaction.sort((a, b) => {
    
      return new Date(a.date) - new Date(b.date);
    
})
  return (
    <div>
      <Header />

      {loading ? (
        <p>Loading....</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showIncomeModal={showIncomeModal}
            showExpenseModal={showExpenseModal}
          />

          {transaction && transaction.length !=0 ? (<ChartComponent sortedTransactions={sortedTransactions}/>):(<NoTransaction/>)}


          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable
            transaction={transaction}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
