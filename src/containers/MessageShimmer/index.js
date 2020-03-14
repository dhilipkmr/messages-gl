import React, { Fragment } from 'react';
import './shimmer.css';

function Shimmer({ count = 4 }) {
  return (
    <Fragment>
      {
        Array(count).fill('').map((_, index) => (
          <li key={index} className="callOut shimmer"style={{ height: '175px'}}>
            <section className="contactInfo">
              <div className="shimmerAnimation dib shimmerAvatar">
              </div>
              <div className="dib">
                <div className="shimmerName shimmerAnimation" aria-label="contact-name-loader">
                </div>
                <div className="shimmerTime shimmerAnimation" aria-label="message-received-time-loader">
                </div>
              </div>
            </section>
            <section className="shimmerMessageInfo shimmerAnimation" aria-describedby="message-content-loader">
            </section>
          </li>
        ))
      }
    </Fragment>
  )
}

export default Shimmer
;