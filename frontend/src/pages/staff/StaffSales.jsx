import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffHeader from '../../components/StaffHeader';

const StaffSales = () => {
  const [sales, setSales] = useState([]);
  const [chemicalOptions, setChemicalOptions] = useState([]);
  const [form, setForm] = useState({
    chemical: '',
    quantity: '',
    customerName: '',
    customerContact: '',
    saleDate: '',
    paymentAmount: '',
    transactionId: '',
    paymentStatus: 'Pending',
    paidBy: ''
  });
  const [editingSale, setEditingSale] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const user1 = JSON.parse(localStorage.getItem('user')); // Retrieve user from localStorage
  
  console.log(user1);
  const userId=user1.id;
 console.log("UserID: ",userId);

 const fetchSales = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/sales');
    setSales(response.data);
  } catch (error) {
    console.error('Error fetching sales:', error);
  }
};
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sales');
        setSales(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

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

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/sales', {
        ...form,
        soldBy: userId,
      });
      setSales([...sales, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  const handleUpdateSale = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/sales/${editingSale._id}`, {
        ...form,
        soldBy: editingSale.soldBy,
      });
      const updatedSales = sales.map((sale) =>
        sale._id === editingSale._id ? response.data : sale
      );
      setSales(updatedSales);
      resetForm();
    } catch (error) {
      console.error('Error updating sale:', error);
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await axios.delete(`http://localhost:5000/api/sales/${saleId}`);
        setSales(sales.filter((sale) => sale._id !== saleId));
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setForm({
      chemical: sale.chemical._id,
      quantity: sale.quantity,
      customerName: sale.customerName,
      customerContact: sale.customerContact,
      saleDate: sale.saleDate ? sale.saleDate.substring(0, 10) : '',
      paymentAmount: sale.paymentAmount,
      transactionId: sale.transactionId || '',
      paymentStatus: sale.paymentStatus,
      paidBy: sale.paidBy
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setEditingSale(null);
    setForm({
      chemical: '',
      quantity: '',
      customerName: '',
      customerContact: '',
      saleDate: '',
      paymentAmount: '',
      transactionId: '',
      paymentStatus: 'Pending',
      paidBy: ''
    });
    setShowForm(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-success text-white';
      case 'Pending':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid">
      <StaffHeader />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="font-bold">Chemical Sales Management</h1>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <i className="bi bi-plus-circle me-2"></i>Add New Sale
            </button>
          )}
        </div>

        {/* Sale Form */}
        {showForm && (
          <div className="card shadow mb-4">
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
                    <label className="form-label">Customer Contact</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerContact"
                      value={form.customerContact}
                      onChange={handleFormChange}
                      placeholder="Customer Contact"
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
                    <label className="form-label">Paid By</label>
                    <select
                      name="paidBy"
                      value={form.paidBy}
                      onChange={handleFormChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank">Bank</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Payment Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      name="paymentAmount"
                      value={form.paymentAmount}
                      onChange={handleFormChange}
                      placeholder="Payment Amount"
                      required
                    />
                  </div>
                  <div className="col-md-6">
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
                  <div className="col-md-6">
                    <label className="form-label">Payment Status</label>
                    <select
                      className="form-select"
                      name="paymentStatus"
                      value={form.paymentStatus}
                      onChange={handleFormChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    {editingSale ? 'Update Sale' : 'Save Sale'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
       

        {/* Sales Table */}
        <div className="card shadow p-3">
          <div className="d-flex justify-content-between card-header bg-light">
            <h2 className="h5 mb-0">Sales List</h2>

            <button variant="outline-primary" size="sm" onClick={fetchSales}>
                  <i className="bi bi-arrow-clockwise me-1"></i> Refresh
           </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
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
                      <td>{sale.customerContact}</td>
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
                    <td colSpan="8" className="text-center py-3">
                      No sales found. Create your first sale!
                    </td>
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

export default StaffSales;