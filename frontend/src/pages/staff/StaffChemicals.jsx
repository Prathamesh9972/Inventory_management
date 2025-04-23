import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Table, Badge, Modal, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import StaffHeader from "../../components/StaffHeader";

const StaffChemicalsMgmt = () => {
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    batchNumber: "",
    quantity: 0,
    intakeDate: "",
    expirationDate: "",
    addedBy: "admin",
  });
  const [editChemicalId, setEditChemicalId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteChemicalId, setDeleteChemicalId] = useState(null);

  // Fetch chemicals on component mount
  useEffect(() => {
    fetchChemicals();
  }, []);

  // Function to fetch all chemicals from the backend
  const fetchChemicals = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/chemicals");
      setChemicals(response.data);
    } catch (error) {
      console.error("Error fetching chemicals:", error.response?.data);
      toast.error("Failed to load chemicals data");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle adding a new chemical
  const handleAddChemical = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chemicals",
        formData
      );
      setChemicals([...chemicals, response.data]);
      resetForm();
      toast.success("Chemical added successfully");
    } catch (error) {
      console.error("Error adding chemical:", error.response?.data);
      toast.error("Failed to add chemical");
    }
  };

  // Handle editing a chemical (populate form with existing data)
  const handleEditChemical = (chemical) => {
    setFormData({
        id: chemical.id,
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

  // Handle updating a chemical
  const handleUpdateChemical = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/chemicals/${editChemicalId}`,
        formData
      );
      const updatedChemicals = chemicals.map((chemical) =>
        chemical._id === editChemicalId ? response.data : chemical
      );
      setChemicals(updatedChemicals);
      resetForm();
      toast.success("Chemical updated successfully");
    } catch (error) {
      console.error("Error updating chemical:", error.response?.data);
      toast.error("Failed to update chemical");
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setDeleteChemicalId(id);
    setShowDeleteModal(true);
  };

  // Handle deleting a chemical
  const handleDeleteChemical = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/chemicals/${deleteChemicalId}`);
      setChemicals(chemicals.filter((chemical) => chemical._id !== deleteChemicalId));
      setShowDeleteModal(false);
      toast.success("Chemical deleted successfully");
    } catch (error) {
      console.error("Error deleting chemical:", error.response?.data);
      toast.error("Failed to delete chemical");
    }
  };

  // Reset form after submission
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

  // Check if expiration date is near (within 30 days)
  const isExpirationNear = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // Check if chemical is expired
  const isExpired = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    return expDate < today;
  };

  return (
    <div className="chemicals-management">
      <StaffHeader />
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className=" font-bold page-title">
              Chemicals Management
            </h2>
          </Col>
        </Row>

        {/* Chemical Form Card */}
        <Row className="mb-5">
          <Col lg={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  {editChemicalId ? "Edit Chemical" : "Add New Chemical"}
                </h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={editChemicalId ? handleUpdateChemical : handleAddChemical}>
                  <Row>
                  
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Chemical Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter chemical name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Batch Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="batchNumber"
                          value={formData.batchNumber}
                          onChange={handleInputChange}
                          placeholder="Enter batch number"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Intake Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="intakeDate"
                          value={formData.intakeDate}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expiration Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="expirationDate"
                          value={formData.expirationDate}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex mt-2">
                    <Button type="submit" variant="primary" className="me-2">
                      {editChemicalId ? "Update Chemical" : "Add Chemical"}
                    </Button>
                    {editChemicalId && (
                      <Button variant="secondary" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Chemicals Table Card */}
        <Row>
          <Col lg={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Chemical Inventory</h5>
                <Button variant="outline-primary" size="sm" onClick={fetchChemicals}>
                  <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                </Button>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" variant="primary" />
                    <p className="mt-2">Loading chemicals data...</p>
                  </div>
                ) : chemicals.length === 0 ? (
                  <div className="text-center py-4">
                    <p>No chemicals found. Add your first chemical above.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ChemicalId</th>
                          <th>Name</th>
                          <th>Batch Number</th>
                          <th>Quantity</th>
                          <th>Intake Date</th>
                          <th>Expiration Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chemicals.map((chemical) => (
                          <tr key={chemical._id}>
                            <td>{chemical._id}</td>
                            <td>{chemical.name}</td>
                            <td>{chemical.batchNumber}</td>
                            <td>
                              <Badge bg={chemical.quantity > 0 ? "success" : "danger"} pill>
                                {chemical.quantity}
                              </Badge>
                            </td>
                            <td>{chemical.intakeDate.split("T")[0]}</td>
                            <td>
                              {isExpired(chemical.expirationDate) ? (
                                <Badge bg="danger">Expired</Badge>
                              ) : isExpirationNear(chemical.expirationDate) ? (
                                <Badge bg="warning">Expiring Soon</Badge>
                              ) : (
                                <Badge bg="success">Valid</Badge>
                              )}
                              <span className="ms-2 text-muted small">
                                {chemical.expirationDate.split("T")[0]}
                              </span>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEditChemical(chemical)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => confirmDelete(chemical._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this chemical? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteChemical}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StaffChemicalsMgmt;