import React from 'react'
import PropTypes from 'prop-types'

const QualitiesCard = ({ qualities }) => {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex flex-column justify-content-center text-center">
        <h5 className="card-title">
          <span>Qualities</span>
        </h5>
        <div className="card-text">
          {qualities.map((item) => (
            <h4
              key={item._id}
              className={'badge bg-' + item.color}
              style={{ fontSize: '16px', margin: '5px 5px 10px 0' }}
            >
              {item.name}
            </h4>
          ))}
        </div>
      </div>
    </div>
  )
}

QualitiesCard.propTypes = {
  qualities: PropTypes.array
}

export default QualitiesCard
