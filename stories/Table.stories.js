// MyComponent.stories.js

import React from 'react';

export default {
  title: 'Table View',
};


export const TableInformation = () => (
    <div>
      <h5>Information</h5>
      <table className="app-statistics-information">
        <tbody>
          <tr>
            <th>Developer</th>
            <td>Prifina</td>
          </tr>
          <tr>
            <th>Last Updated</th>
            <td>03/05/2020</td>
          </tr>
          <tr>
            <th>Category</th>
            <td>Data</td>
          </tr>
          <tr>
            <th>Approximate Size</th>
            <td>TBD</td>
          </tr>
          <tr>
            <th>Language support</th>
            <td>English (U.S.)</td>
          </tr>
          <tr>
            <th>Age</th>
            <td>18+</td>
          </tr>
          <tr>
            <th>Compatibility</th>
            <td>Win 10, MacOS</td>
          </tr>
          <tr>
            <th>Installation</th>
            <td>Download this app while signed into your Prifina account</td>
          </tr>
        </tbody>
      </table>
    </div>
);


