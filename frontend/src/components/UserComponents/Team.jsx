import React from "react";
import PropTypes from "prop-types";

export const Team = ({ data }) => {
  return (
    <div id="team" className="text-center py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="section-title mb-12">
          <h2 className="text-3xl font-bold">Meet the Team</h2>
          <p className="text-gray-500 mt-4">
            Our dedicated team is here to help you achieve your goals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
          {data
            ? data.map((member, index) => (
                <div
                  key={`${member.name}-${index}`}
                  className="team-member bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-40 h-40 object-cover rounded-full mb-4"
                  />
                  <h4 className="text-xl font-semibold">{member.name}</h4>
                  <p className="text-gray-500">{member.job}</p>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};

// Prop validation
Team.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      job: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
    })
  ).isRequired,
};
