import Layout from "../components/Layout";
import "../css/payments.css";
import { useState, useEffect } from "react";
import { fetchSales, updateSale } from "../Services/api";

function Payments() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const loadPayments = async () => {
            try {
                const sales = await fetchSales();
                setPayments(sales);
                localStorage.setItem("sales", JSON.stringify(sales));
            } catch (error) {
                const savedSales = JSON.parse(localStorage.getItem("sales")) || [];
                setPayments(savedSales);
            }
        };

        loadPayments();
    }, []);

    async function confirmPayment(id) {
        const payment = payments.find((item) => (item._id || item.id) === id);
        if (!payment) {
            return;
        }

        try {
            const updatedPayment = await updateSale(payment._id || payment.id, {
                ...payment,
                paymentstatus: "Paid",
            });

            const updatedPayments = payments.map((item) => ((item._id || item.id) === id ? updatedPayment : item));
            setPayments(updatedPayments);
            localStorage.setItem("sales", JSON.stringify(updatedPayments));
        } catch (error) {
            alert(error.message || "Unable to confirm payment");
        }
    }

    const totalPayments = payments.length;
    const paidPayments = payments.filter((payment) => payment.paymentstatus === "Paid").length;
    const pendingPayments = payments.filter((payment) => payment.paymentstatus === "Pending").length;
    const totalAmount = payments.reduce((total, payment) => total + Number(payment.total || 0), 0);

    return (
        <Layout title="Payments">
            <div className="payments-page">
                <h2>Payment Management</h2>

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
                        <p>KSh {totalAmount}</p>
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
                            {payments.map((payment) => (
                                <tr key={payment._id || payment.id}>
                                    <td>{payment.id}</td>
                                    <td>{payment.customer}</td>
                                    <td>{payment.payment}</td>
                                    <td>KSh {payment.total}</td>
                                    <td>{payment.paymentstatus}</td>
                                    <td>{payment.transactionCode || payment.phone}</td>
                                    <td>{payment.date}</td>
                                    <td>
                                        {payment.paymentstatus === "Pending" && (
                                            <button onClick={() => confirmPayment(payment._id || payment.id)}>
                                                Confirm
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}

export default Payments;
