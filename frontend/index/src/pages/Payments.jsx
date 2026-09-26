import Layout from "../components/Layout";
import "../css/payments.css";
import { useState, useEffect } from "react";


function Payments(){

    const [payments,setPayments] = useState([]);


    useEffect(()=>{

        const savedSales =
            JSON.parse(localStorage.getItem("sales")) || [];


        setPayments(savedSales);

    },[]);



    function confirmPayment(id){

        const updatedPayments = payments.map((payment)=>{

            if(payment.id === id){

                return{
                    ...payment,
                    paymentstatus:"Paid"
                };

            }

            return payment;

        });


        setPayments(updatedPayments);


        localStorage.setItem(
            "sales",
            JSON.stringify(updatedPayments)
        );

    }



    const totalPayments = payments.length;


    const paidPayments =
        payments.filter(
            payment=>payment.paymentstatus==="Paid"
        ).length;


    const pendingPayments =
        payments.filter(
            payment=>payment.paymentstatus==="Pending"
        ).length;


    const totalAmount =
        payments.reduce(
            (total,payment)=>total + payment.total,
            0
        );



    return(

        <Layout title="Payments">


            <div className="payments-page">


                <h2>
                    Payment Management
                </h2>


                <div className="payment-summary">


                    <div className="payment-card">
                        <h3>Total Payments</h3>
                        <p>{totalPayments}</p>
                    </div>


                    <div className="payment-card">
                        <h3>Paid</h3>
                        <p>{paidPayments}</p>
                    </div>


                    <div className="payment-card">
                        <h3>Pending</h3>
                        <p>{pendingPayments}</p>
                    </div>


                    <div className="payment-card">
                        <h3>Total Amount</h3>
                        <p>
                            KSh {totalAmount}
                        </p>
                    </div>


                </div>



                <div className="payments-table">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Customer</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Reference</th>
                                <th>Date</th>
                                <th>Action</th>

                            </tr>

                        </thead>


                        <tbody>


                        {
                            payments.map((payment)=>(

                                <tr key={payment.id}>


                                    <td>
                                        {payment.id}
                                    </td>


                                    <td>
                                        {payment.customer}
                                    </td>


                                    <td>
                                        {payment.payment}
                                    </td>


                                    <td>
                                        KSh {payment.total}
                                    </td>


                                    <td>
                                        {payment.paymentstatus}
                                    </td>


                                    <td>
                                        {
                                        payment.transactionCode ||
                                        payment.phone
                                        }
                                    </td>


                                    <td>
                                        {payment.date}
                                    </td>


                                    <td>


                                    {
                                    payment.paymentstatus==="Pending" &&

                                    <button
                                    onClick={()=>
                                    confirmPayment(payment.id)
                                    }
                                    >
                                    Confirm
                                    </button>

                                    }


                                    </td>


                                </tr>

                            ))
                        }


                        </tbody>


                    </table>


                </div>



            </div>


        </Layout>

    );

}


export default Payments;