
import React, { useState, useEffect } from "react";
import "./profile.css";
import ClientDetails from "../Kontragent/Kontragent";

const Profile = () => {
  const [debtors, setDebtors] = useState([]);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // useEffect(() => {
  //   const fetchDebtors = async () => {
  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/debtors`);

  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setDebtors(data.response.Clients);
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //       setError(error.message);
  //     }
  //   };

  //   fetchDebtors();
  // }, []);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/debtors`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        // Собираем всех клиентов со всех филиалов в один массив
        const allClients = data.response.flatMap(branch => branch.Clients || []);
        setDebtors(allClients);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      }
    };

    fetchDebtors();
  }, []);


  const handleRowClick = (debtor) => {
    setSelectedDebtor(debtor);
  };

  const closeModal = () => {
    setSelectedDebtor(null);
  };

  const filteredDebtors = debtors.filter((debtor) =>
    `${debtor.first_name} ${debtor.last_name} ${debtor.pinfl}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDebtors.length / itemsPerPage);
  const paginatedDebtors = filteredDebtors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // const totalDebt = allDebtors.reduce((sum, d) => sum + (d.contracts?.[0]?.debt || 0), 0);

  return (
    <div className="profile-container">
      <div className="Display-flex">
        <h2 className="title">Debtors List</h2>

        <input
          type="text"
          placeholder="Search by name or PINFL..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
        />
      </div>


      {error && <p className="error">{error}</p>}

      <div className="table-wrapper">
        <table className="debtors-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th className="last-name">Last Name</th>
              <th>PINFL</th>
              <th>Debt</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDebtors.map((debtor, index) => (
              <tr className="table-row" key={index} onClick={() => handleRowClick(debtor)}>
                <td>{debtor.first_name}</td>
                <td>{debtor.last_name}</td>
                <td>{debtor.pinfl}</td>
                <td className="debt-red">
                  {debtor.contracts?.[0]?.debt?.toLocaleString("ru-RU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < totalPages ? prev + 1 : prev
            )
          }
          disabled={currentPage === totalPages}
        >

          Next
        </button>
      </div>

      {selectedDebtor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              {selectedDebtor.first_name} {selectedDebtor.last_name}
            </h3>
            <p>PINFL: {selectedDebtor.pinfl}</p>
            <p>Passport: {selectedDebtor.passport_seria} {selectedDebtor.passport_number}</p>
            <p>Phone: {selectedDebtor.phone}</p>
            <h4>Contracts:</h4>
            <ClientDetails debtor={selectedDebtor} onClose={closeModal} />
            <button onClick={closeModal} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
