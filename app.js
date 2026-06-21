/* ==========================
   CLIPTAB BILLING PRO
========================== */

let invoices = JSON.parse(
localStorage.getItem("cliptabInvoices")
) || [];

updateDashboard();
renderHistory();

/* DARK MODE */

const themeBtn =
document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{

document.documentElement.classList.toggle("dark");

localStorage.setItem(
"theme",
document.documentElement.classList.contains("dark")
);

});

if(localStorage.getItem("theme")==="true"){
document.documentElement.classList.add("dark");
}

/* GENERATE INVOICE */

function generateInvoice(){

let clientName =
document.getElementById("clientName").value.trim();

let clientEmail =
document.getElementById("clientEmail").value.trim();

let clientPhone =
document.getElementById("clientPhone").value.trim();

let service =
document.getElementById("service").value;

let amount =
document.getElementById("amount").value;

let status =
document.getElementById("status").value;

let description =
document.getElementById("description").value.trim();

if(
!clientName ||
!clientEmail ||
!clientPhone ||
!amount
){
alert("Please fill all fields");
return;
}

/* Invoice Number */

const invoiceNo =
"CT-" +
new Date().getFullYear() +
"-" +
Date.now().toString().slice(-5);

const invoiceDate =
new Date().toLocaleDateString(
"en-IN"
);

/* Preview */

document.getElementById("invoiceNo").innerText =
invoiceNo;

document.getElementById("invoiceDate").innerText =
invoiceDate;

document.getElementById("previewName").innerText =
clientName;

document.getElementById("previewEmail").innerText =
clientEmail;

document.getElementById("previewPhone").innerText =
clientPhone;

document.getElementById("previewService").innerText =
service;

document.getElementById("previewDescription").innerText =
description;

document.getElementById("previewAmount").innerText =
"₹" + amount;

document.getElementById("previewTotal").innerText =
Number(amount).toLocaleString();

document.getElementById("previewStatus").innerText =
status;

/* Show Invoice */

document.getElementById(
"invoicePreview"
).style.display = "block";

/* Save */

const invoice = {
invoiceNo,
invoiceDate,
clientName,
clientEmail,
clientPhone,
service,
description,
amount,
status
};

invoices.unshift(invoice);

localStorage.setItem(
"cliptabInvoices",
JSON.stringify(invoices)
);

updateDashboard();
renderHistory();

window.scrollTo({
top:document.body.scrollHeight,
behavior:"smooth"
});

}

/* DASHBOARD */

function updateDashboard(){

const total =
invoices.length;

const paid =
invoices.filter(
i => i.status === "Paid"
).length;

const pending =
invoices.filter(
i => i.status === "Pending"
).length;

document.getElementById(
"invoiceCount"
).innerText = total;

document.getElementById(
"paidCount"
).innerText = paid;

document.getElementById(
"pendingCount"
).innerText = pending;

}

/* HISTORY */

function renderHistory(){

const history =
document.getElementById(
"historyList"
);

if(invoices.length===0){

history.innerHTML =
"No invoices yet.";

return;

}

history.innerHTML = "";

invoices.forEach((invoice,index)=>{

history.innerHTML += `
<div class="history-item">

<h4>${invoice.invoiceNo}</h4>

<p>
<strong>Client:</strong>
${invoice.clientName}
</p>

<p>
<strong>Service:</strong>
${invoice.service}
</p>

<p>
<strong>Amount:</strong>
₹${invoice.amount}
</p>

<p>
<strong>Status:</strong>
${invoice.status}
</p>

<button
onclick="loadInvoice(${index})"
style="
margin-top:10px;
padding:8px 15px;
border:none;
background:#e11d48;
color:white;
border-radius:8px;
cursor:pointer;
">
View
</button>

</div>
`;

});

}

/* LOAD OLD INVOICE */

function loadInvoice(index){

const i = invoices[index];

document.getElementById(
"invoicePreview"
).style.display = "block";

document.getElementById(
"invoiceNo"
).innerText = i.invoiceNo;

document.getElementById(
"invoiceDate"
).innerText = i.invoiceDate;

document.getElementById(
"previewName"
).innerText = i.clientName;

document.getElementById(
"previewEmail"
).innerText = i.clientEmail;

document.getElementById(
"previewPhone"
).innerText = i.clientPhone;

document.getElementById(
"previewService"
).innerText = i.service;

document.getElementById(
"previewDescription"
).innerText = i.description;

document.getElementById(
"previewAmount"
).innerText = "₹" + i.amount;

document.getElementById(
"previewTotal"
).innerText = i.amount;

document.getElementById(
"previewStatus"
).innerText = i.status;

window.scrollTo({
top:800,
behavior:"smooth"
});

}

/* PDF DOWNLOAD */

function downloadPDF(){

const invoice =
document.querySelector(
".invoice-box"
);

const options = {

margin:0.4,

filename:
"Cliptab-Invoice.pdf",

image:{
type:'jpeg',
quality:1
},

html2canvas:{
scale:2
},

jsPDF:{
unit:'in',
format:'a4',
orientation:'portrait'
}

};

html2pdf()
.set(options)
.from(invoice)
.save();

}

/* WHATSAPP SHARE */

function shareWhatsApp(){

const invoiceNo =
document.getElementById(
"invoiceNo"
).innerText;

const client =
document.getElementById(
"previewName"
).innerText;

const total =
document.getElementById(
"previewTotal"
).innerText;

const status =
document.getElementById(
"previewStatus"
).innerText;

const text =

`*CLIPTAB INVOICE*

Invoice: ${invoiceNo}

Client: ${client}

Amount: ₹${total}

Status: ${status}

Thank you for choosing Cliptab`;

window.open(
"https://wa.me/?text=" +
encodeURIComponent(text)
);

}

/* CLEAR ALL DATA */

function clearInvoices(){

if(
confirm(
"Delete all invoices?"
)
){

localStorage.removeItem(
"cliptabInvoices"
);

invoices = [];

updateDashboard();

renderHistory();

location.reload();

}

}

/* EXPORT JSON */

function exportData(){

const data =
JSON.stringify(
invoices,
null,
2
);

const blob =
new Blob(
[data],
{
type:
"application/json"
}
);

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"cliptab-invoices.json";

a.click();

}

/* IMPORT JSON */

function importData(event){

const file =
event.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(e){

try{

const data =
JSON.parse(
e.target.result
);

invoices = data;

localStorage.setItem(
"cliptabInvoices",
JSON.stringify(data)
);

updateDashboard();

renderHistory();

alert(
"Invoices imported successfully"
);

}catch{

alert(
"Invalid file"
);

}

};

reader.readAsText(file);

}
