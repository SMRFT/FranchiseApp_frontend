import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color:white;
    color:white;
  }

button {
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  color : white;
  font-family: 'Pacifico', cursive;
  border: none;
  border-radius: 15px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
  margin-top: 20px;
}

button:hover {
  background: linear-gradient(135deg,rgb(85, 156, 175),rgb(38, 136, 158)); /* Slightly darker on hover */
}


label{
  display: block;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  font-size: 0.95rem;
  text-transform: capitalize;
  }

  h3 {
    font-family: 'Pacifico', cursive;
    color:white;
    font-size: 30px;
    margin: 0;
    text-align: center;
  }

    h4 {
      display: block;
      color: #4B9EB0;
      margin-bottom: 8px;
      font-size: 0.95rem;
      font-family: 'Pacifico', cursive;
  }

   h5 {
    color: white;
    font-size: 1.3rem;
    font-weight: 600;
    font-family: 'Pacifico', cursive;
    margin: 30px 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #ecf0f1;
    display: flex;
    align-items: center;
    position: relative;
  }


  table {
  background-color: white;
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

th {
  color: #4B9EB0;
  font-weight: bold;
  padding: 12px 16px;
  text-align: left;
  background-color: #f0f8fa;
}

td {
  color: black; /* Text color for table data cells */
  padding: 12px 16px;
  border-top: 1px solid #ddd; /* Optional: row separator */
}
strong{
color:black;
}

`;

export default GlobalStyle;