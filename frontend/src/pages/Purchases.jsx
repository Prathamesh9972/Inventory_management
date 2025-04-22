import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table, Card, Badge, InputGroup } from 'react-bootstrap';
import Header from '../components/Header';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    chemical: '',
    supplierName: '',
    supplierContact: '',
    quantity: '',
    price: '',
    purchasedBy: '',
    paymentStatus: ''
  });

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/purchases');
      setPurchases(res.data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPurchase = {
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
      };
      await axios.post('http://localhost:5000/api/purchases', newPurchase);
      setFormData({
        chemical: '',
        supplierName: '',
        supplierContact: '',
        quantity: '',
        price: '',
        purchasedBy: '',
        paymentStatus: ''
      });
      fetchPurchases();
    } catch (err) {
      console.error('Error adding purchase:', err);
    }
  };

  const totalAmount = purchases.reduce((acc, p) => acc + Number(p.price || 0), 0);

  return (
    <>
      <Header />
      <Container fluid className="py-4 px-4">
        {/* Add New Purchase Form */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-bottom py-3">
                <h5 className="mb-0 fw-semibold">Record New Purchase</h5>
              </Card.Header>
              <Card.Body className="py-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Chemical ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="chemical"
                          value={formData.chemical}
                          onChange={handleChange}
                          placeholder="Enter chemical identifier"
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Supplier Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="supplierName"
                          value={formData.supplierName}
                          onChange={handleChange}
                          placeholder="Enter supplier name"
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Supplier Contact</Form.Label>
                        <Form.Control
                          type="text"
                          name="supplierContact"
                          value={formData.supplierContact}
                          onChange={handleChange}
                          placeholder="Enter supplier contact"
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="Enter quantity"
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Price</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>₹</InputGroup.Text>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            required
                            className="py-2"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Purchased By</Form.Label>
                        <Form.Control
                          type="text"
                          name="purchasedBy"
                          value={formData.purchasedBy}
                          onChange={handleChange}
                          placeholder="Enter employee name"
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Payment Status</Form.Label>
                        <Form.Select
                          name="paymentStatus"
                          value={formData.paymentStatus}
                          onChange={handleChange}
                          required
                          className="py-2"
                        >
                          <option value="">Select Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end mt-3">
                    <Button type="reset" variant="light" className="me-2 px-4">
                      Clear
                    </Button>
                    <Button type="submit" variant="primary" className="px-4">
                      Add Purchase
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Display Purchase Table */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Purchase Records</h5>
                <div>
                  <Badge bg="secondary" className="me-2">{purchases.length} records</Badge>
                  <Badge bg="primary">Total: ₹{totalAmount.toFixed(2)}</Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading purchase records...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr className="bg-light">
                          <th className="px-4 py-3">Chemical</th>
                          <th className="px-3 py-3">Supplier</th>
                          <th className="px-3 py-3">Contact</th>
                          <th className="px-3 py-3">Quantity</th>
                          <th className="px-3 py-3">Price</th>
                          <th className="px-3 py-3">Purchased By</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.length > 0 ? (
                          purchases.map(p => (
                            <tr key={p._id}>
                              <td className="px-4 py-3">{p.chemical?.name || p.chemical}</td>
                              <td className="px-3 py-3">{p.supplierName}</td>
                              <td className="px-3 py-3">{p.supplierContact}</td>
                              <td className="px-3 py-3">{p.quantity}</td>
                              <td className="px-3 py-3">₹{p.price}</td>
                              <td className="px-3 py-3">{p.purchasedBy}</td>
                              <td className="px-3 py-3">
                                <Badge bg={p.paymentStatus === 'Paid' ? 'success' : 'warning'} pill>
                                  {p.paymentStatus}
                                </Badge>
                              </td>
                              <td className="px-3 py-3">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              <p className="mb-0 text-muted">No purchase records found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="border-top">
                        <tr className="bg-light fw-bold">
                          <td colSpan="4" className="px-4 py-3 text-end">Total Amount</td>
                          <td colSpan="4" className="px-3 py-3">₹{totalAmount.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Purchases;
