// MyComponent.stories.js

import React from 'react';
import Ellipse61 from '../assets/Ellipse61.png';
import Ellipse62 from '../assets/Ellipse62.png';
import Ellipse63 from '../assets/Ellipse63.png';
import Ellipse64 from '../assets/Ellipse64.png';
import Ellipse65 from '../assets/Ellipse65.png';
import Ellipse66 from '../assets/Ellipse66.png';
import Ellipse67 from '../assets/Ellipse67.png';
import Ellipse68 from '../assets/Ellipse68.png';
import Button from "./Button";



const TableListing = () => (
    <div className="table-responsive">
      <table className="users-list-view">
        <thead>
          <tr>
            <th></th>
            <th>Full Name</th>
            <th>Alias</th>
            <th>App</th>
            <th>Relationship</th>
            <th>Source</th>
            <th>Data Connected</th>
            <th>Latest Interaction</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><img src={Ellipse61} className="listingUserProfileImage" /></td>
            <td>Eric Chaney</td>
            <td>erCh</td>
            <td><a href="#" className="listing-app__type-facebook">Facebook</a></td>
            <td>Friend</td>
            <td>EricChaney@gmail.com</td>
            <td>March 19,2020</td>
            <td>April 19,2020</td>
            <td><a href="#" className="listing-app__view-facebook">View in Facebook</a></td>
          </tr>
          <tr>
            <td><img src={Ellipse62} className="listingUserProfileImage" /></td>
            <td>Janer Doe</td>
            <td>N/A</td>
            <td><a href="#" className="listing-app__type-youtube">Youtube</a></td>
            <td>Follower</td>
            <td>N/A</td>
            <td>March 14,2020</td>
            <td>April 14,2020</td>
            <td><a href="#" className="listing-app__view-youtube">View in Youtube</a></td>
          </tr>
          <tr>
            <td><img src={Ellipse63} className="listingUserProfileImage" /></td>
            <td>Diana Redding</td>
            <td>d.red</td>
            <td><a href="#" className="listing-app__type-linkedin">LinkedIn</a></td>
            <td>Connection</td>
            <td>N/A</td>
            <td>March 12,2020</td>
            <td>April 19,2020</td>
            <td><a href="#" className="listing-app__view-linkedin">View in LinkedIn</a></td>
          </tr>
          <tr>
            <td><img src={Ellipse64} className="listingUserProfileImage" /></td>
            <td>Eric Chaney</td>
            <td>N/A</td>
            <td><a href="#" className="listing-app__type-twitter">Twitter</a></td>
            <td>Follower</td>
            <td>N/A</td>
            <td>March 09,2020</td>
            <td>April 14,2020</td>
            <td><a href="#" className="listing-app__view-twitter">View in Twitter</a></td>
          </tr>
          <tr>
            <td><img src={Ellipse65} className="listingUserProfileImage" /></td>
            <td>James Rob</td>
            <td>JRob</td>
            <td><a href="#" className="listing-app__type-facebook">Facebook</a></td>
            <td>Friend</td>
            <td>JamesRob@gmail.com</td>
            <td>March 07,2020</td>
            <td>April 19,2020</td>
            <td><a href="#" className="listing-app__view-facebook">View in Facebook</a></td>
          </tr>
          <tr>
            <td><img src={Ellipse66} className="listingUserProfileImage" /></td>
            <td>Derek Coule</td>
            <td>N/A</td>
            <td><a href="#" className="listing-app__type-facebook">Facebook</a></td>
            <td>Follower</td>
            <td>N/A</td>
            <td>March 04,2020</td>
            <td>April 14,2020</td>
            <td><a href="#" className="listing-app__view-facebook">View in Facebook</a></td>
          </tr>
          <tr>
            <td><img src={Ellipse67} className="listingUserProfileImage" /></td>
            <td>Emily Johnson</td>
            <td>erCh</td>
            <td><a href="#" className="listing-app__type-instagram">Instagram</a></td>
            <td>Connection</td>
            <td>N/A</td>
            <td>March 03,2020</td>
            <td>April 19,2020</td>
            <td><a href="#" className="listing-app__view-instagram">View in Instagram</a></td>
          </tr>
          <tr>
            <td><img src={Ellipse68} className="listingUserProfileImage" /></td>
            <td>Greg Rust</td>
            <td>gRust</td>
            <td><a href="#" className="listing-app__type-twitter">Twitter</a></td>
            <td>Follower</td>
            <td>N/A</td>
            <td>March 01,2020</td>
            <td>April 14,2020</td>
            <td><a href="#" className="listing-app__view-twitter">View in Twitter</a></td>
          </tr>
        </tbody>
      </table>
    </div>
);


export default  TableListing;