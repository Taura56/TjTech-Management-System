import { useLocation } from "react-router-dom";
import "../css/receipt.css";


function Receipt(){

    const {state} = useLocation();

    const receipt = state?.payment;


    if(!receipt){

        return <h2>No receipt information found</h2>;

    }


    function printReceipt(){

        window.print();

    }


    return(

        <div className="receipt-page">


            <button
            className="print-btn"
            onClick={printReceipt}
            >
                Print Receipt
            </button>


            <div className="receipt">


                <h1>
                    TJ TECH
                </h1>

                <h2>
                    PAYMENT RECEIPT
                </h2>


                <hr/>


                <p>
                    <b>Receipt No:</b> {receipt.id}
                </p>


                <p>
                    <b>Date:</b> {receipt.date}
                </p>


                <p>
                    <b>Customer:</b> {receipt.customer}
                </p>


                <p>
                    <b>Device:</b> {receipt.device}
                </p>


                <hr/>


                <p>
                    <b>Amount Paid:</b>
                    KSh {receipt.amount}
                </p>


                <p>
                    <b>Payment Method:</b>
                    {receipt.method}
                </p>


                <p>
                    <b>Reference:</b>
                    {receipt.reference}
                </p>


                <hr/>


                <h3>
                    Thank you for choosing TJ Tech
                </h3>


            </div>


        </div>

    );

}


export default Receipt;