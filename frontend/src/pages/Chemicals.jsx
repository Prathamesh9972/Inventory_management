import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "../components/Header";
import "react-toastify/dist/ReactToastify.css";
import "./chemical.css"

const ChemicalsManagement = () => {
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    batchNumber: "",
    quantity: 0,
    intakeDate: "",
    expirationDate: "",
    addedBy: "admin", // ideally set from token context
  });
  const [editChemicalId, setEditChemicalId] = useState(null);

  useEffect(() => {
    fetchChemicals();
  }, []);

  const fetchChemicals = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/chemicals");
      setChemicals(response.data);
    } catch (error) {
      toast.error("Failed to load chemicals");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChemical = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/chemicals", formData);
      setChemicals([...chemicals, response.data]);
      resetForm();
      toast.success("Chemical added");
    } catch (error) {
      toast.error("Add failed");
    }
  };

  const handleEditChemical = (chemical) => {
    setFormData({
      name: chemical.name,
      batchNumber: chemical.batchNumber,
      quantity: chemical.quantity,
      intakeDate: chemical.intakeDate.split("T")[0],
      expirationDate: chemical.expirationDate.split("T")[0],
      addedBy: chemical.addedBy,
    });
    setEditChemicalId(chemical._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateChemical = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/chemicals/${editChemicalId}`, formData);
      setChemicals(
        chemicals.map((chem) => (chem._id === editChemicalId ? response.data : chem))
      );
      resetForm();
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteChemical = async (id) => {
    if (!window.confirm("Delete this chemical permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/chemicals/${id}`);
      setChemicals(chemicals.filter((chem) => chem._id !== id));
      toast.success("Deleted");
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      batchNumber: "",
      quantity: 0,
      intakeDate: "",
      expirationDate: "",
      addedBy: "admin",
    });
    setEditChemicalId(null);
  };

  const isExpired = (date) => new Date(date) < new Date();
  const isExpiringSoon = (date) => {
    const daysLeft = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return daysLeft <= 30 && daysLeft > 0;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
    <Header />
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Chemicals Management</h2>

      {/* Form */}
      <form
        onSubmit={editChemicalId ? handleUpdateChemical : handleAddChemical}
        className="bg-white shadow-lg rounded-lg p-6 mb-10 border border-gray-200 max-w-4xl mx-auto"
       >
       <h3 className="text-xl font-bold mb-4 text-blue-600 text-center">{editChemicalId ? "Edit" : "Add"} Chemical</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chemical Name Input */}
          <input
            name="name"
            type="text"
            required
            placeholder="Chemical Name"
            className="input p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={formData.name}
            onChange={handleInputChange}
          />

          {/* Batch Number Input */}
          <input
            name="batchNumber"
            type="text"
            required
            placeholder="Batch Number"
            className="input p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={formData.batchNumber}
            onChange={handleInputChange}
          />

          {/* Quantity Input */}
          <input
            name="quantity"
            type="number"
            min="0"
            required
            placeholder="Quantity"
            className="input p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={formData.quantity}
            onChange={handleInputChange}
          />

          {/* Intake Date */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <span className="text-sm text-gray-700">Intake Date</span>
            <input
              name="intakeDate"
              type="date"
              required
              className="input p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-2 sm:mt-0"
              value={formData.intakeDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <span className="text-sm text-gray-700">Expiration Date</span>
            <input
              name="expirationDate"
              type="date"
              required
              className="input p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-2 sm:mt-0"
              value={formData.expirationDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="submit"
            className="btn-primary px-6 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition duration-300"
          >
            {editChemicalId ? "Update" : "Add"}
          </button>
          {editChemicalId && (
            <button
              type="button"
              className="btn-secondary px-6 py-2 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-200 focus:ring-2 focus:ring-blue-300 transition duration-300"
              onClick={resetForm}
            >
              Cancel
            </button>
    )}
  </div>
</form>


      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <div className="flex justify-between p-4 border-b">
          <h3 className="font-bold text-blue-600">Chemical Inventory</h3>
          <button onClick={fetchChemicals} className="text-sm text-blue-600 hover:underline focus:outline-none">
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="p-6 text-center">Loading chemicals...</div>
        ) : chemicals.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No chemicals found.</div>
        ) : (
          <table className="table-auto w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Batch</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Intake</th>
                <th className="p-2">Expiration</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chemicals.map((chem) => (
                <tr key={chem._id} className="border-t">
                  <td className="p-2">{chem.name}</td>
                  <td className="p-2">{chem.batchNumber}</td>
                  <td className="p-2">{chem.quantity}</td>
                  <td className="p-2">{chem.intakeDate.split("T")[0]}</td>
                  <td className="p-2">{chem.expirationDate.split("T")[0]}</td>
                  <td className="p-2">
                    {isExpired(chem.expirationDate) ? (
                      <span className="text-red-600 font-semibold">Expired</span>
                    ) : isExpiringSoon(chem.expirationDate) ? (
                      <span className="text-yellow-500 font-medium">Expiring Soon</span>
                    ) : (
                      <span className="text-green-600">Valid</span>
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleEditChemical(chem)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 roundedtext-blue-600 hover:underline text-sm rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteChemical(chem._id)} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white hover:underline px-3 py-2 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
  );
};

export default ChemicalsManagement;
