import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../../Components/context/BookingContext';
import { services } from './ServiceData';

const SelectService = () => {
  const { selectedPet, setSelectedServices } = useContext(BookingContext);
  const [selectedServiceList, setSelectedServiceList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedPet) {
      navigate('/book/select-pet');
    }
  }, [selectedPet, navigate]);

  const handleServiceChange = (serviceName) => {
    const service = services.find((s) => s.name === serviceName);
    setSelectedServiceList((prevServices) =>
      prevServices.some((s) => s.name === serviceName)
        ? prevServices.filter((s) => s.name !== serviceName)
        : [...prevServices, service]
    );
  };

  const handleNext = () => {
    setSelectedServices(selectedServiceList);
    navigate('/book/select-datetime');
  };

  const isServiceSelected = (serviceName) => {
    return selectedServiceList.some((s) => s.name === serviceName);
  };

  if (!selectedPet) {
    return (
      <div className="service-selection">
        <h1>No pet selected. Please go back and select a pet.</h1>
        <button onClick={() => navigate('/book/select-pet')}>Go Back</button>
      </div>
    );
  }

  return (
<div className="service-selection">
      <h1>Select Services for <span className='service-pet-name'>{selectedPet.name}</span></h1>
      <div className="service-list">
        {services.map((service) => (
          <div 
            key={service.name} 
            className={`service-item ${isServiceSelected(service.name) ? 'checked' : ''}`} 
            onClick={() => handleServiceChange(service.name)}
          >
            <h2>{service.name}</h2>
            <p className='service-description'>{service.description}</p>
            <img style={{marginRight: "auto", width: "150px", marginBottom: "20px", marginTop: "20px"}} src={service.image} alt={service.name} />
            <p className='service-price'>VND ${service.price}.00 Per Session</p>
            <input
              type="checkbox"
              id={service.name}
              value={service.name}
              checked={isServiceSelected(service.name)}
              readOnly
            />
            {/* <span className="checkbox-label">Select</span> */}
          </div>
        ))}
      </div>
      <button disabled={selectedServiceList.length === 0} className='button-service' onClick={handleNext}>Next</button>
    </div>
  );
};

export default SelectService;
