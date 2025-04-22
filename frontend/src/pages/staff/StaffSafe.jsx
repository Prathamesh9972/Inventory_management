import React, { useEffect, useState } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import StaffHeader from '../../components/StaffHeader';

const StaffSafety = () => {
  const [safetyList, setSafetyList] = useState([]);
  const [chemicals, setChemicals] = useState([]);
  const [formData, setFormData] = useState({
    chemical: '',
    hazard: '',
    handlingInstructions: '',
    safetyEquipment: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchSafetyData();
    fetchChemicals();
  }, []);

  const fetchSafetyData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/safety');
      setSafetyList(res.data);
    } catch (err) {
      console.error('Failed to fetch safety info:', err);
      alert('Failed to load safety information. Please try again later.');
    }
  };

  const fetchChemicals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chemicals');
      setChemicals(res.data);
    } catch (err) {
      console.error('Failed to fetch chemicals:', err);
      alert('Failed to load chemicals. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error when field is being edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.chemical) {
      errors.chemical = 'Please select a chemical';
    }
    
    if (!formData.hazard.trim()) {
      errors.hazard = 'Hazard information is required';
    }
    
    if (!formData.handlingInstructions.trim()) {
      errors.handlingInstructions = 'Handling instructions are required';
    }
    
    if (!formData.safetyEquipment.trim()) {
      errors.safetyEquipment = 'Safety equipment information is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (editingId) {
        const updatedSafety = await axios.put(`http://localhost:5000/api/safety/${editingId}`, formData);
        setSafetyList(
          safetyList.map((safety) =>
            safety._id === editingId ? updatedSafety.data : safety
          )
        );
        alert('Safety information updated successfully!');
      } else {
        const newSafety = await axios.post('http://localhost:5000/api/safety', formData);
        setSafetyList([...safetyList, newSafety.data]);
        alert('Safety information added successfully!');
      }

      // Reset form
      setFormData({
        chemical: '',
        hazard: '',
        handlingInstructions: '',
        safetyEquipment: ''
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting safety info:', err);
      alert('Failed to save safety information. Please try again.');
    }
  };

  const handleEdit = (safety) => {
    setFormData({
      chemical: safety.chemical?._id || safety.chemical || '',
      hazard: safety.hazard,
      handlingInstructions: safety.handlingInstructions,
      safetyEquipment: safety.safetyEquipment
    });
    setEditingId(safety._id);
    setShowForm(true);
    setValidationErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this safety information?')) {
      try {
        await axios.delete(`http://localhost:5000/api/safety/${id}`);
        setSafetyList(safetyList.filter((safety) => safety._id !== id));
        alert('Safety information deleted successfully.');
      } catch (err) {
        console.error('Failed to delete safety info:', err);
        alert('Failed to delete safety information. Please try again.');
      }
    }
  };

  const getChemicalName = (chemicalField) => {
    if (!chemicalField) return 'Unknown';
    if (typeof chemicalField === 'object' && chemicalField.name) {
      return chemicalField.name;
    }
    const chemical = chemicals.find((chem) => chem._id === chemicalField);
    return chemical ? chemical.name : 'Unknown';
  };

  const resetForm = () => {
    setFormData({
      chemical: '',
      hazard: '',
      handlingInstructions: '',
      safetyEquipment: ''
    });
    setEditingId(null);
    setValidationErrors({});
    setShowForm(false);
  };

  const getHazardBadgeClass = (hazard) => {
    const hazardLower = hazard.toLowerCase();
    if (hazardLower.includes('toxic') || hazardLower.includes('poison')) {
      return 'bg-danger';
    } else if (hazardLower.includes('flammable') || hazardLower.includes('fire')) {
      return 'bg-warning text-dark';
    } else if (hazardLower.includes('corrosive') || hazardLower.includes('acid')) {
      return 'bg-info';
    } else {
      return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid">
      <StaffHeader />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-5">Chemical Safety Information</h1>
          
        </div>

        {/* Collapsible Safety Form */}
        <div className={`card shadow mb-4 ${showForm ? '' : 'd-none'}`}>
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{editingId ? 'Update Safety Information' : 'Add Safety Information'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label">Chemical <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${validationErrors.chemical ? 'is-invalid' : ''}`}
                    name="chemical"
                    value={formData.chemical}
                    onChange={handleChange}
                  >
                    <option value="">Select Chemical</option>
                    {chemicals.map((chem) => (
                      <option key={chem._id} value={chem._id}>
                        {chem.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.chemical && (
                    <div className="invalid-feedback">{validationErrors.chemical}</div>
                  )}
                </div>
                
                <div className="col-md-12">
                  <label className="form-label">Hazard Information <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.hazard ? 'is-invalid' : ''}`}
                    name="hazard"
                    value={formData.hazard}
                    onChange={handleChange}
                    placeholder="e.g., Toxic if inhaled, Flammable, etc."
                  />
                  {validationErrors.hazard && (
                    <div className="invalid-feedback">{validationErrors.hazard}</div>
                  )}
                </div>
                
                <div className="col-md-12">
                  <label className="form-label">Handling Instructions <span className="text-danger">*</span></label>
                  <textarea
                    className={`form-control ${validationErrors.handlingInstructions ? 'is-invalid' : ''}`}
                    name="handlingInstructions"
                    value={formData.handlingInstructions}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Detailed instructions for safe handling of this chemical"
                  ></textarea>
                  {validationErrors.handlingInstructions && (
                    <div className="invalid-feedback">{validationErrors.handlingInstructions}</div>
                  )}
                </div>
                
                <div className="col-md-12">
                  <label className="form-label">Required Safety Equipment <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.safetyEquipment ? 'is-invalid' : ''}`}
                    name="safetyEquipment"
                    value={formData.safetyEquipment}
                    onChange={handleChange}
                    placeholder="e.g., Gloves, Safety goggles, Face shield, etc."
                  />
                  {validationErrors.safetyEquipment && (
                    <div className="invalid-feedback">{validationErrors.safetyEquipment}</div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingId ? 'Update Safety Info' : 'Save Safety Info'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Safety Information List */}
        <div className="card shadow">
          <div className="card-header bg-light">
            <h2 className="h5 mb-0">Safety Information List</h2>
          </div>
          
          {safetyList.length === 0 ? (
            <div className="card-body text-center py-5">
              <p className="text-muted mb-0">No safety information available. Add your first entry!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Chemical</th>
                    <th>Hazard</th>
                    <th>Handling Instructions</th>
                    <th>Safety Equipment</th>
                
                  </tr>
                </thead>
                <tbody>
                  {safetyList.map((safety) => (
                    <tr key={safety._id}>
                      <td className="fw-bold">{getChemicalName(safety.chemical)}</td>
                      <td>
                        <span className={`badge ${getHazardBadgeClass(safety.hazard)}`}>
                          {safety.hazard}
                        </span>
                      </td>
                      <td>{safety.handlingInstructions}</td>
                      <td>{safety.safetyEquipment}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffSafety;