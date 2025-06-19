import React, { useState } from "react";
import "./kursValyut.css";

const KursValyut = () => {
  const [currency, setCurrency] = useState(null);
  // useState - Reactning bir qismi bo'lib, komponentning ichki holatini saqlash uchun ishlatiladi.


  const handleClick = async (code) => {
    try {
      const res = await fetch("https://cbu.uz/uz/arkhiv-kursov-valyut/json/");
      // fetch - ma'lumotlarni olish uchun ishlatiladi 

      const data = await res.json();
      // json - ma'lumotlarni JSON formatida uchun ishlatiladi

      const selected = data.find((item) => item.Ccy === code);
      // find - ma'lumotlar ichidan kerakli elementni topish uchun ishlatiladi

      setCurrency(selected);
      // setCurrency - holatni yangilash uchun ishlatiladi
    } catch (error) {
      console.error("xato: " + error.message);
    }
  };

  return (
    <div className="KursValyut">
      <h1>Курс Валют</h1>
      
      <div className="buttons">
        <button onClick={() => handleClick("USD")}>USD</button>
        <button onClick={() => handleClick("RUB")}>RUB</button>
        <button onClick={() => handleClick("EUR")}>EUR</button>
        <button onClick={() => handleClick("GBP")}>GBP</button>
        <button onClick={() => handleClick("CNY")}>CNY</button>
      </div>

      {currency && (
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Курс</th>
              <th>Номинал</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
         <tr>
    <td >{currency.CcyNm_RU}</td>
    <td >{currency.Rate}</td>
    <td >{currency.Nominal}</td>
    <td >{currency.Date}</td>
  </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KursValyut;
