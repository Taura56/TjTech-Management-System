import Layout from "../components/Layout";
import "../css/services.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Services(){

    const [services,setServices] = useState(()=>{

        const savedServices =
            localStorage.getItem("services");

        return savedServices
        ? JSON.parse(savedServices)
        : [];

    });
const [payments, setPayments] = useState(()=>{

    const savedPayments =
    localStorage.getItem("payments");

    return savedPayments
    ? JSON.parse(savedPayments)
    : [];

});

useEffect(()=>{

    localStorage.setItem(
        "payments",
        JSON.stringify(payments)
    );

},[payments]);


const [showPaymentForm, setShowPaymentForm] = useState(false);

const [selectedService, setSelectedService] = useState(null);

const [payment, setPayment] = useState({
    amount: "",
    method: "",
    reference: "",
    date: new Date().toLocaleDateString()
});

    const [showForm,setShowForm] = useState(false);

    const [editingService,setEditingService] = useState(null);

    const [searchTerm,setSearchTerm] = useState("");
    const navigate = useNavigate();


   const [newService,setNewService] = useState({
    customer: "",
    phone: "",
    device: "",
    imei: "",
    fault: "",
    technician: "",
    accessories: "",
    sparePartsCost: "",
    laborCost: "",
    total: 0,
    amountPaid: 0,
    balance: 0,
    paymentMethod: "",
    paymentStatus: "Pending",
    serviceStatus: "Pending",
    remarks: "",
    date: new Date().toLocaleDateString(),

});



    useEffect(()=>{

        localStorage.setItem(
            "services",
            JSON.stringify(services)
        );

    },[services]);

    function handlePayment(service){

    setSelectedService(service);

    setPayment({
        amount: "",
        method: "",
        reference: "",
        date: new Date().toLocaleDateString()
    });

    setShowPaymentForm(true);

}

function savePayment(){

    const amount =
    Number(payment.amount);


    if(!amount || amount <= 0){

        alert("Enter valid payment amount");
        return;

    }


if(!payment.method){

    alert("Please select payment method");
    return;

}


// M-PESA validation

if(
    payment.method === "M-PESA" &&
    !payment.reference
){

    alert("Please enter M-PESA transaction code");
    return;

}


// CARD validation

if(
    payment.method === "Card" &&
    !payment.reference
){

    alert("Please enter card transaction reference");
    return;

}


    const oldPaid =
    Number(selectedService.amountPaid) || 0;


    const newPaid =
    oldPaid + amount;


    const total =
    Number(selectedService.total) || 0;


    const balance =
    Math.max(total - newPaid,0);
    if(amount > selectedService.balance){

    alert(
    "Payment cannot be greater than the outstanding balance"
    );

    return;

}



    let paymentStatus = "Pending";


    if(newPaid === 0){

        paymentStatus = "Pending";

    }
    else if(newPaid < total){

        paymentStatus = "Partial";

    }
    else{

        paymentStatus = "Paid";

    }



    // save payment history

    const newPayment = {

        id:
        payments.length > 0
        ? Math.max(...payments.map(p=>p.id))+1
        : 1,

        serviceId:selectedService.id,

        customer:selectedService.customer,

        amount,

        method:payment.method,

        reference:payment.reference,

        date:payment.date

    };


    setPayments([
        ...payments,
        newPayment
    ]);



    // update service

    const updatedServices =
    services.map(service=>{


        if(service.id === selectedService.id){

            return{

                ...service,

                amountPaid:newPaid,

                balance,

                paymentStatus

            };

        }


        return service;


    });



    setServices(updatedServices);



setShowPaymentForm(false);


navigate("/receipt",{

    state:{
        payment:{
            ...newPayment,
            device:selectedService.device
        }
    }

});


}


    function handleAdd(){

        setEditingService(null);

            setNewService({
                    customer: "",
                    phone: "",
                    device: "",
                    imei: "",
                    fault: "",
                    technician: "",
                    accessories: "",
                    sparePartsCost: "",
                    laborCost: "",
                    total: 0,
                    amountPaid: 0,
                    balance: 0,
                    paymentMethod: "",
                    paymentStatus: "Pending",
                    serviceStatus: "Pending",
                    remarks: "",
                    date: new Date().toLocaleDateString(),
        });

        setShowForm(true);

    }

function calculateTotal(){

    const parts =
    Number(newService.sparePartsCost) || 0;


    const labour =
    Number(newService.laborCost) || 0;


    return parts + labour;

}

function printJobCard(service){

navigate(
"/jobcard",
{
state:{
service
}
}
);

}

function calculateBalance(){

    const total = calculateTotal();
    const paid = total - (Number(newService.amountPaid) || 0);

    return Math.max(total-paid, 0);}


    function handleSave(){


        if(
            !newService.customer ||
            !newService.phone||
            !newService.device ||
            !newService.imei ||
            !newService.fault ||
            !newService.technician ||
            !newService.accessories ||
            !newService.sparePartsCost ||
            !newService.laborCost ||
            newService.amountPaid === "" ||
            newService.paymentMethod === "" ||
            newService.paymentStatus === "" ||
            !newService.serviceStatus ||
            !newService.remarks
        ){

            alert("Please fill all fields");
            return;

        }



        if(editingService){


            const updatedServices =
            services.map((service)=>{


                if(service.id === editingService.id){

                    return{

                        ...service,
                        ...newService,
                        sparePartsCost:Number(newService.sparePartsCost),
                        laborCost:Number(newService.laborCost),
                        total:calculateTotal(),
                        balance:calculateBalance(),

                    };

                }


                return service;


            });


            setServices(updatedServices);


        }else{
const total = calculateTotal();
const balance = calculateBalance();
const amountPaid = Number(newService.amountPaid) || 0;

let paymentStatus = "Pending";

if (amountPaid === 0) {
    paymentStatus = "Pending";
} else if (amountPaid < total) {
    paymentStatus = "Partial";
} else {
    paymentStatus = "Paid";
}

const service={

id:
services.length > 0
? Math.max(...services.map(s=>s.id))+1
:1,

...newService,

sparePartsCost:Number(newService.sparePartsCost),

laborCost:Number(newService.laborCost),

total,
balance,
paymentStatus,
    
};

            setServices([
                ...services,
                service
            ]);


        }


        setShowForm(false);


    }




    function handleEdit(service){

        setEditingService(service);

        setNewService(service);

        setShowForm(true);

    }



    function handleDelete(id){


        const confirmDelete =
        window.confirm(
            "Delete this service?"
        );


        if(confirmDelete){

            setServices(
                services.filter(
                    service=>service.id!==id
                )
            );

        }

    }

const filteredServices = services.filter((service)=>

service.customer.toLowerCase()
.includes(searchTerm.toLowerCase())

||

service.phone.includes(searchTerm)

||

service.device.toLowerCase()
.includes(searchTerm.toLowerCase())

||

service.imei.includes(searchTerm)

);


return(

<Layout title="Services">


<div className="services-page">


<div className="services-header">

<input
className="service-search"
    type="text"
    placeholder="Search customer, phone, device..."
    value={searchTerm}
    onChange={(e)=>setSearchTerm(e.target.value)}
/>

<button
className="add-service-btn"
onClick={handleAdd}
>
+ Add Service
</button>


</div>


<div className="services-table-container">
<table >


<thead>

<tr>

<th>ID</th>
<th>Customer Name</th>
<th>Phone Number</th>
<th>Device</th>
<th>IMEI</th>
<th>Fault</th>
<th>Technician</th>
<th>Accessories</th>
<th>Spare Parts Cost</th>
<th>Labor Cost</th>
<th>Total Cost</th>
<th>Amount Paid</th>
<th>Balance</th>
<th>Payment Method</th>
<th>Payment Status</th>
<th>Service Status</th>
<th>Remarks</th>
<th>Actions</th>
</tr>

</thead>


<tbody>


{
    filteredServices.length === 0 ? (

        <tr>
        <td colSpan="18" style={{ textAlign: "center" }}>
        No services found.
        </td>
        </tr>
) : (                   
                filteredServices.map((service)=>(

                <tr key={service.id}>


                <td>{service.id}</td>

                <td>{service.customer}</td>

                <td>{service.phone}</td>

                <td>{service.device}</td>

                <td>{service.imei}</td>

                <td>{service.fault}</td>

                <td>{service.technician}</td>

                <td>{service.accessories}</td>

                <td>
                KSh {service.sparePartsCost}
                </td>

                <td>
                KSh {service.laborCost}
                </td>

                <td>
                KSh {service.total}
                </td>

                <td>
                KSh {service.amountPaid}
                </td>


                <td>
                KSh {service.balance}
                </td>

                <td>
                {service.paymentMethod}
                </td>

                <td>
                {service.paymentStatus}
                </td>

                <td>
                {service.serviceStatus}
                </td>

                <td>
                {service.remarks}
                </td>


                <td>


                <button
                className="edit-btn"
                onClick={()=>handleEdit(service)}
                >
                Edit
                </button>

                <button
                className="payment-btn"
                onClick={() => handlePayment(service)}
                >
                Receive Payment
                </button>

                <button
                className="print-btn"
                onClick={()=>printJobCard(service)

                }
                >
                Print
                </button>


                <button
                className="delete-btn"
                onClick={()=>handleDelete(service.id)}
                >
                Delete
                </button>


                </td>


                </tr>

                ))
        )}



</tbody>


</table>
</div>



{
showForm &&

<div className="modal-overlay">


<div className="service-modal">


<h2>

{
editingService
?"Edit Service"
:"Add Service"
}

</h2>


<input
placeholder="Customer Name"
value={newService.customer}
onChange={(e)=>
setNewService({
...newService,
customer:e.target.value
})
}
/>


<input
placeholder="Phone Number"
value={newService.phone}
onChange={(e)=>
setNewService({
...newService,
phone:e.target.value
})
}
/>
<input
placeholder="Device"
value={newService.device}
onChange={(e)=>
setNewService({
...newService,
device:e.target.value
})
}
/>
<input 
placeholder="Imei"
value={newService.imei}
onChange={(e)=>
setNewService({
...newService,
imei:e.target.value
})
}
/>

<input
placeholder="Fault"
value={newService.fault}
onChange={(e)=> 
setNewService({
...newService,
fault:e.target.value
})
}
/>

<input
placeholder="Served By"
value={newService.technician}
onChange={(e)=>
setNewService({
...newService,
technician:e.target.value
})
}
/>
<input
placeholder="Accessories"
value={newService.accessories}
onChange={(e)=>
setNewService({
...newService,
accessories:e.target.value
})
}
/>
<input 
type="number" 
min="0"
placeholder="Spare Parts Cost"
value={newService.sparePartsCost}
onChange={(e)=>
setNewService({
...newService,
sparePartsCost:Math.max(0, Number(e.target.value))
})
}
/>


<input
type="number"
min="0"
placeholder="Labor Cost"
value={newService.laborCost}
onChange={(e)=>
setNewService({
...newService,
laborCost:Math.max(0, Number(e.target.value))
})
}
/>
<h3>
Total Amount: KSh {calculateTotal()}
</h3>
<label htmlFor="Amount Paid">Amount Paid:</label>
<input
name="Amount Paid"
placeholder="Amount Paid"
type="number"
min="0"
value={newService.amountPaid}
onChange={(e)=>
setNewService({
...newService,
amountPaid:Math.max(0, Number(e.target.value))
})
}
/>
<h3>
Balance: KSh {calculateBalance()}
</h3>



<select
value={newService.paymentMethod}
onChange={(e)=>
setNewService({
...newService,
paymentMethod:e.target.value
})
}
>
<option value="select Payment Method">
select Payment Method
</option>

<option value="CASH">
    CASH
</option>

<option value="M-PESA">
    M-PESA
</option>

<option value="CARD">
    CARD
</option>

</select>

<select
value={newService.serviceStatus}
onChange={(e)=>
setNewService({
...newService,
serviceStatus:e.target.value
})
}
>
<option value="select service status">
    select service status
</option>
<option value="PENDING">
    PENDING
</option>

<option value="IN PROGRESS">
IN PROGRESS
</option>

<option value="COMPLETED">
COMPLETED
</option>
<option value="COLLECTED">
COLLECTED
</option>

</select>
<textarea
placeholder="Remarks"
value={newService.remarks}
onChange={(e)=>
setNewService({
...newService,
remarks:e.target.value
})
}
/>
<button
onClick={handleSave}
>
Save
</button>


<button
onClick={()=>setShowForm(false)}
>
Cancel
</button>



</div>


</div>

}

{
showPaymentForm &&

<div className="modal-overlay">


<div className="service-modal">


<h2>
Receive Payment
</h2>


<h3>
Customer:
{selectedService.customer}
</h3>


<p>
Device:
{selectedService.device}
</p>


<p>
Balance:
KSh {selectedService.balance}
</p>


<input
type="number"
min="0"
placeholder="Amount Paying"
value={payment.amount}

onChange={(e)=>

setPayment({
...payment,
amount:Math.max(0, Number(e.target.value))
})

}
/>


<select

value={payment.method}

onChange={(e)=>

setPayment({
...payment,
method:e.target.value
})

}

>

<option value="">
Select Payment Method
</option>


<option value="Cash">
Cash
</option>


<option value="M-PESA">
M-PESA
</option>


<option value="Card">
Card
</option>


</select>



<input

placeholder= {
payment.method === "M-PESA"
? "M-PESA Transaction Code"
: payment.method === "Card"
? "Card Transaction Reference"
: "Reference (Optional)"
}

value={payment.reference}

onChange={(e)=>

setPayment({

...payment,

reference:e.target.value

})

}

/>


<button onClick={savePayment}>
Save Payment
</button>


<button
onClick={()=>setShowPaymentForm(false)}
>
Cancel
</button>


</div>


</div>

}

</div>


</Layout>

);


}


export default Services;