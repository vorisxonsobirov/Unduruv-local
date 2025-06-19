  // components/ClientDetails.jsx

  import React from "react";
  import "./kontragent.css";

  const ClientDetails = ({ debtor, onClose }) => {
    if (!debtor) return null;

    return (
      <div className="client-modal-overlay" onClick={onClose}>
        <div className="client-modal" onClick={(e) => e.stopPropagation()}>
          <h2>
            {debtor.first_name} {debtor.last_name}
          </h2>
          <p><strong>PINFL:</strong> {debtor.pinfl}</p>
          <p><strong>Pasport:</strong> {debtor.passport_seria} {debtor.passport_number}</p>
          <p><strong>Phone:</strong> {debtor.phone}</p>
          <p><strong>Adress:</strong> {debtor.addres}</p>
          <h3>Contracts:</h3>
          {debtor.contracts.map((contract, i) => (
            <div className="client-contract" key={i}>
              <p><strong>Product:</strong> {contract.products}</p>
              <p><strong>Date:</strong> {contract.date}</p>
              <p><strong>Rate:</strong> {contract.tariff}</p>
              <p><strong>Duty:</strong> {contract.debt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p><strong>Contract amount:</strong> {contract.contract_summary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p><strong>Monthly payment:</strong> {contract.mounthly_payment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p><strong>Agent:</strong> {contract.agent}</p>
            </div>
          ))}
          <button className="client-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  export default ClientDetails;
