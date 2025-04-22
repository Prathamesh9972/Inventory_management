import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sales = () => {
  // State for CRUD operations
  const [sales, setSales] = useState([]);
  const [chemicalOptions, setChemicalOptions] = useState([]);
  const [form, setForm] = useState({
    chemical: '',
    quantity: '',
    customerName: '',
    saleDate: '',
    soldBy: '',
    paymentAmount: '',
    transactionId: '',
    paymentStatus: 'Pending',
    paidBy: ''
  });
  const [editingSale, setEditingSale] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all sales
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sales');
        setSales(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    // Fetch chemicals for the dropdown
    const fetchChemicals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chemicals');
        setChemicalOptions(response.data);
      } catch (error) {
        console.error('Error fetching chemicals:', error);
      }
    };

    fetchSales();
    fetchChemicals();
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add a new sale
  const handleAddSale = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/sales', form);
      setSales([...sales, response.data]); // Add new sale to state
      setForm({
        chemical: '',
        quantity: '',
        customerName: '',
        saleDate: '',
        soldBy: '',
        paymentAmount: '',
        transactionId: '',
        paymentStatus: 'Pending',
        paidBy: ''
      }); // Reset form
      setShowForm(false);
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  // Update an existing sale
  const handleUpdateSale = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/api/sales/${editingSale._id}`, form);
      const updatedSales = sales.map((sale) =>
        sale._id === editingSale._id ? response.data : sale
      );
      setSales(updatedSales); // Update sale in state
      setEditingSale(null); // Reset edit mode
      setForm({
        chemical: '',
        quantity: '',
        customerName: '',
        saleDate: '',
        soldBy: '',
        paymentAmount: '',
        transactionId: '',
        paymentStatus: 'Pending',
        paidBy: ''
      }); // Reset form
      setShowForm(false);
    } catch (error) {
      console.error('Error updating sale:', error);
    }
  };

  // Delete a sale
  const handleDeleteSale = async (saleId) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await axios.delete(`http://localhost:5000/api/sales/${saleId}`);
        setSales(sales.filter((sale) => sale._id !== saleId)); // Remove sale from state
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  // Set up edit mode
  const handleEdit = (sale) => {
    setEditingSale(sale);
    setForm({
      chemical: sale.chemical._id,
      quantity: sale.quantity,
      customerName: sale.customerName,
      saleDate: sale.saleDate ? sale.saleDate.substring(0, 10) : '',
      soldBy: sale.soldBy,
      paymentAmount: sale.paymentAmount,
      transactionId: sale.transactionId || '',
      paymentStatus: sale.paymentStatus,
      paidBy: sale.paidBy
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Get payment status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid">
      <Header />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-5">Chemical Sales Management</h1>
          {!showForm && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowForm(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>Add New Sale
            </button>
          )}
        </div>

        {/* Collapsible Sale Form */}
        <div className={`card shadow mb-4 ${showForm ? '' : 'd-none'}`}>
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{editingSale ? 'Update Sale' : 'Add New Sale'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={editingSale ? handleUpdateSale : handleAddSale}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Chemical</label>
                  <select 
                    className="form-select" 
                    name="chemical" 
                    value={form.chemical} 
                    onChange={handleFormChange} 
                    required
                  >
                    <option value="">Select Chemical</option>
                    {chemicalOptions.map((chemical) => (
                      <option key={chemical._id} value={chemical._id}>
                        {chemical.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Quantity</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="quantity" 
                    value={form.quantity} 
                    onChange={handleFormChange} 
                    placeholder="Quantity" 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Customer Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="customerName" 
                    value={form.customerName} 
                    onChange={handleFormChange} 
                    placeholder="Customer Name" 
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Sale Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    name="saleDate" 
                    value={form.saleDate} 
                    onChange={handleFormChange} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Sold By</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="soldBy" 
                    value={form.soldBy} 
                    onChange={handleFormChange} 
                    placeholder="Sold By" 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Payment Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">Rs</span>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="paymentAmount" 
                      value={form.paymentAmount} 
                      onChange={handleFormChange} 
                      placeholder="0.00" 
                      required 
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Transaction ID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="transactionId" 
                    value={form.transactionId} 
                    onChange={handleFormChange} 
                    placeholder="Transaction ID" 
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Payment Status</label>
                  <select 
                    className="form-select" 
                    name="paymentStatus" 
                    value={form.paymentStatus} 
                    onChange={handleFormChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Paid By</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="paidBy" 
                    value={form.paidBy} 
                    onChange={handleFormChange} 
                    placeholder="Paid By" 
                    required 
                  />
                </div>
              </div>
              
              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingSale ? 'Update Sale' : 'Save Sale'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingSale(null);
                    setForm({
                      chemical: '',
                      quantity: '',
                      customerName: '',
                      saleDate: '',
                      soldBy: '',
                      paymentAmount: '',
                      transactionId: '',
                      paymentStatus: 'Pending',
                      paidBy: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sales List */}
        <div className="card shadow">
          <div className="card-header bg-light">
            <h2 className="h5 mb-0">Sales List</h2>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th>Chemical</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <tr key={sale._id}>
                      <td>{sale.customerName}</td>
                      <td>{sale.chemical?.name || 'N/A'}</td>
                      <td>{sale.quantity}</td>
                      <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                      <td>Rs {sale.paymentAmount}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(sale.paymentStatus)}`}>
                          {sale.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary" 
                            onClick={() => handleEdit(sale)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger" 
                            onClick={() => handleDeleteSale(sale._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-3">No sales found. Create your first sale!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;