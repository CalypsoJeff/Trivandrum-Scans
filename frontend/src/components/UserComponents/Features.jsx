/* eslint-disable react/prop-types */
import React from "react";

export const Features = (props) => {
  return (
    <div id="features" className="text-center py-12 bg-gray-50">
      <div className="container mx-auto">
        <div className="section-title mb-8">
          <h2 className="text-3xl font-bold">Our Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {props.data
            ? props.data.map((d, i) => (
                <div
                  key={i}
                  className="feature-item bg-white shadow-md p-6 rounded-lg"
                >
                  <div className="text-5xl text-blue-600 mb-4">{d.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{d.title}</h3>
                  <p className="text-gray-600">{d.text}</p>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
