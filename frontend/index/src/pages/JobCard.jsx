import { useLocation } from "react-router-dom";
import "../css/jobcard.css";

function JobCard(){

    const { state } = useLocation();

    const service = state?.service;


    if(!service){
        return <h2>No service selected</h2>;
    }


    function printCard(){

        window.print();

    }


    return(

        <div className="job-card">


            <button 
            className="print-btn"
            onClick={printCard}
            >
                Print Job Card
            </button>


            <div className="card-content">


            <h1>
                TJ TECH
            </h1>

            <h2>
                REPAIR JOB CARD
            </h2>


            <hr/>


            <p>
                <b>Job No:</b> {service.id}
            </p>


            <p>
                <b>Date Received:</b> {service.date}
            </p>


            <h3>
                Customer Information
            </h3>


            <p>
                Name: {service.customer}
            </p>

            <p>
                Phone: {service.phone}
            </p>



            <h3>
                Device Information
            </h3>


            <p>
                Device: {service.device}
            </p>


            <p>
                IMEI: {service.imei}
            </p>


            <p>
                Fault: {service.fault}
            </p>



            <h3>
                Repair Details
            </h3>


            <p>
                Technician: {service.technician}
            </p>


            <p>
                Accessories:
                {service.accessories}
            </p>


            <p>
                Remarks:
                {service.remarks}
            </p>


            <h3>
                Status
            </h3>


            <p>
                {service.serviceStatus}
            </p>


            <br/>

            <p>
            Customer Signature:
            __________________
            </p>


            </div>


        </div>

    );

}


export default JobCard;