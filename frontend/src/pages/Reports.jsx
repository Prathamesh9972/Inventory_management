import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Alert, Nav, Spinner } from 'react-bootstrap';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Download, Filter, RefreshCw, Printer, ChevronDown, Calendar } from 'lucide-react';
import Header from '../components/Header';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/reports/detailed', {
        params: {
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined
        }
      });
      setReport(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch the report data. Please try again later.');
      setLoading(false);
    }
  };

  const handleDateFilterApply = () => {
    fetchReport();
    setShowFilters(false);
  };

  const downloadCSV = (data, filename) => {
    if (!data || !data.length) return;
    
    const headers = Object.keys(data[0]);
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(item => {
      const row = headers.map(header => {
        let value = item[header];
        
        if (value instanceof Date) {
          value = value.toLocaleDateString();
        }
        
        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value).replace(/"/g, '""');
        }
        
        if (typeof value === 'string') {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value || '';
      }).join(',');
      
      csvContent += row + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  // Chart data preparation functions
  const prepareSalesVsPurchasesData = () => {
    if (!report) return [];
    
    const salesByMonth = {};
    const purchasesByMonth = {};
    
    report.salesDetails.forEach(sale => {
      const date = new Date(sale.saleDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = 0;
      }
      salesByMonth[monthKey] += (sale.payment?.amountPaid || 0);
    });
    
    report.purchaseDetails.forEach(purchase => {
      const date = new Date(purchase.purchaseDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!purchasesByMonth[monthKey]) {
        purchasesByMonth[monthKey] = 0;
      }
      purchasesByMonth[monthKey] += (purchase.payment?.amountPaid || 0);
    });
    
    const allMonths = [...new Set([...Object.keys(salesByMonth), ...Object.keys(purchasesByMonth)])].sort();
    
    return allMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1, 1).toLocaleString('default', { month: 'short' });
      
      return {
        name: `${monthName} ${year}`,
        sales: salesByMonth[month] || 0,
        purchases: purchasesByMonth[month] || 0,
        profit: (salesByMonth[month] || 0) - (purchasesByMonth[month] || 0)
      };
    });
  };

  const getTopSellingChemicals = () => {
    if (!report || !report.salesDetails) return [];
    
    const salesByChemical = {};
    report.salesDetails.forEach(sale => {
      const chemicalName = sale.chemical?.name || 'Unknown';
      if (!salesByChemical[chemicalName]) {
        salesByChemical[chemicalName] = 0;
      }
      salesByChemical[chemicalName] += sale.quantity;
    });
    
    return Object.keys(salesByChemical)
      .map(name => ({ name, value: salesByChemical[name] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const calculateExpiryAlert = () => {
    if (!report || !report.chemicalDetails) return [];
    
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return report.chemicalDetails.filter(chemical => {
      const expiryDate = new Date(chemical.expirationDate);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Report</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchReport}>
            <RefreshCw size={16} className="me-2" />
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  const expiringChemicals = calculateExpiryAlert();

  return (
    <div className="reports-page bg-light min-vh-100">
      <Header />
      <div className="bg-white shadow-sm border-bottom">
        <Container fluid className="py-4">
          <Row className="align-items-center">
          <Col md={7}>
  <h1 className="mb-1 fw-bold text-primary display-5">
    Inventory Management Reports
  </h1>
  <p className="text-muted fs-5">
    📊 Comprehensive analysis of sales, purchases, and inventory data.
  </p>
</Col>

            <Col md={5} className="text-md-end mt-3 mt-md-0">
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="me-2" />
                Filter
                <ChevronDown size={14} className="ms-2" />
              </Button>
              <Button variant="outline-secondary" onClick={printReport}>
                <Printer size={16} className="me-2" />
                Print
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="py-4">
        {/* Date Filters */}
        {showFilters && (
          <Card className="mb-4 animate__animated animate__fadeIn">
            <Card.Body>
              <Form>
                <Row className="align-items-end">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Start Date</Form.Label>
                      <div className="position-relative">
                        <Calendar size={16} className="position-absolute top-50 translate-middle-y ms-3" />
                        <Form.Control
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                          className="ps-5"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>End Date</Form.Label>
                      <div className="position-relative">
                        <Calendar size={16} className="position-absolute top-50 translate-middle-y ms-3" />
                        <Form.Control
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                          className="ps-5"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Button 
                      variant="primary" 
                      onClick={handleDateFilterApply}
                      className="w-100"
                    >
                      Apply Filters
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* Navigation Tabs */}
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'sales'}
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'purchases'}
              onClick={() => setActiveTab('purchases')}
            >
              Purchases
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'inventory'}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <Row className="g-4 mb-4">
              <Col md={3} sm={6}>
                <Card className="h-100">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Total Sales Value</h6>
                    <h3 className="mb-0">₹{report.totalSalesValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="h-100">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Total Purchase Cost</h6>
                    <h3 className="mb-0">₹{report.totalPurchaseCost.toLocaleString('en-IN', {maximumFractionDigits: 2})}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="h-100">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Profit Margin</h6>
                    <h3 className="mb-0">{((report.totalSalesValue - report.totalPurchaseCost) / report.totalSalesValue * 100).toFixed(2)}%</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="h-100">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Inventory Count</h6>
                    <h3 className="mb-0">{report.totalChemicals}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4 mb-4">
              <Col lg={8}>
                <Card>
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Sales vs Purchases Trend</h5>
                    <Button 
                      variant="link" 
                      className="p-0"
                      onClick={() => downloadCSV(prepareSalesVsPurchasesData(), 'sales-vs-purchases')}
                    >
                      <Download size={16} />
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: 300 }}>
                      <ResponsiveContainer>
                        <LineChart data={prepareSalesVsPurchasesData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sales" stroke="#0088FE" name="Sales" />
                          <Line type="monotone" dataKey="purchases" stroke="#FF8042" name="Purchases" />
                          <Line type="monotone" dataKey="profit" stroke="#00C49F" name="Profit" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card>
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Top Selling Chemicals</h5>
                    <Button 
                      variant="link" 
                      className="p-0"
                      onClick={() => downloadCSV(getTopSellingChemicals(), 'top-selling-chemicals')}
                    >
                      <Download size={16} />
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={getTopSellingChemicals()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {getTopSellingChemicals().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {expiringChemicals.length > 0 && (
              <Alert variant="warning" className="mb-4">
                <Alert.Heading>⚠️ Chemicals Expiring Soon</Alert.Heading>
                <p className="mb-2">{expiringChemicals.length} chemical(s) will expire in the next 30 days.</p>
                <div className="border-top pt-2 mt-2">
                  {expiringChemicals.slice(0, 3).map((chem, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <span>{chem.name} (Batch: {chem.batchNumber})</span>
                      <Badge bg="warning" text="dark">
                        Expires: {new Date(chem.expirationDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                  {expiringChemicals.length > 3 && (
                    <p className="text-end mb-0 mt-2">+ {expiringChemicals.length - 3} more</p>
                  )}
                </div>
              </Alert>
            )}
          </>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <Card>
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Sales Details ({report.salesCount})</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => downloadCSV(report.salesDetails, 'sales-details')}
              >
                <Download size={16} className="me-2" />
                Export CSV
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="g-4 mb-4">
                <Col md={4}>
                  <div className="border-end">
                    <h6 className="text-muted mb-1">Total Sales Value</h6>
                    <p className="h4 mb-0">₹{report.totalSalesValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border-end">
                    <h6 className="text-muted mb-1">Payment Received</h6>
                    <p className="h4 mb-0">₹{report.totalPaymentReceived.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <h6 className="text-muted mb-1">Outstanding Amount</h6>
                    <p className="h4 mb-0">₹{(report.totalSalesValue - report.totalPaymentReceived).toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                  </div>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>Chemical</th>
                      <th>Batch</th>
                      <th>Quantity</th>
                      <th>Customer</th>
                      <th>Sold By</th>
                      <th>Sale Date</th>
                      <th>Sale Value</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.salesDetails.map((sale) => {
                      const saleValue = sale.quantity * (sale.price || 0);
                      const paymentStatus = sale.payment?.amountPaid >= saleValue ? 'Paid' : 
                                          sale.payment?.amountPaid > 0 ? 'Partial' : 'Unpaid';
                      
                      let statusVariant = 'success';
                      if (paymentStatus === 'Partial') statusVariant = 'warning';
                      if (paymentStatus === 'Unpaid') statusVariant = 'danger';
                      
                      return (
                        <tr key={sale._id}>
                          <td>{sale.chemical?.name || 'N/A'}</td>
                          <td>{sale.chemical?.batchNumber || 'N/A'}</td>
                          <td>{sale.quantity}</td>
                          <td>{sale.customerName}</td>
                          <td>{sale.soldBy}</td>
                          <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                          <td>₹{saleValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                          <td>₹{(sale.payment?.amountPaid || 0).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                          <td>
                            <Badge bg={statusVariant}>{paymentStatus}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <Card>
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Purchase Details ({report.purchaseCount})</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => downloadCSV(report.purchaseDetails, 'purchase-details')}
              >
                <Download size={16} className="me-2" />
                Export CSV
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="g-4 mb-4">
                <Col md={4}>
                  <div className="border-end">
                    <h6 className="text-muted mb-1">Total Purchase Cost</h6>
                    <p className="h4 mb-0">₹{report.totalPurchaseCost.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border-end">
                    <h6 className="text-muted mb-1">Payment Made</h6>
                    <p className="h4 mb-0">₹{report.totalPaymentMade.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <h6 className="text-muted mb-1">Outstanding Payable</h6>
                    <p className="h4 mb-0">₹{(report.totalPurchaseCost - report.totalPaymentMade).toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                  </div>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>Chemical</th>
                      <th>Batch</th>
                      <th>Quantity</th>
                      <th>Price per Unit</th>
                      <th>Total Cost</th>
                      <th>Supplier</th>
                      <th>Purchased By</th>
                      <th>Purchase Date</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.purchaseDetails.map((purchase) => {
                      const totalCost = purchase.quantity * purchase.price;
                      const paymentStatus = purchase.payment?.amountPaid >= totalCost ? 'Paid' : 
                                          purchase.payment?.amountPaid > 0 ? 'Partial' : 'Unpaid';
                      
                      let statusVariant = 'success';
                      if (paymentStatus === 'Partial') statusVariant = 'warning';
                      if (paymentStatus === 'Unpaid') statusVariant = 'danger';
                      
                      return (
                        <tr key={purchase._id}>
                          <td>{purchase.chemical?.name || 'N/A'}</td>
                          <td>{purchase.chemical?.batchNumber || 'N/A'}</td>
                          <td>{purchase.quantity}</td>
                          <td>₹{purchase.price.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                          <td>₹{totalCost.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                          <td>{purchase.supplierName}</td>
                          <td>{purchase.purchasedBy}</td>
                          <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                          <td>₹{(purchase.payment?.amountPaid || 0).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                          <td>
                            <Badge bg={statusVariant}>{paymentStatus}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <Card>
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Chemical Inventory ({report.totalChemicals})</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => downloadCSV(report.chemicalDetails, 'inventory-details')}
              >
                <Download size={16} className="me-2" />
                Export CSV
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="g-4 mb-4">
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h3 className="display-4 text-primary">{report.totalChemicals}</h3>
                      <p className="text-muted mb-0">Total Chemicals</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h3 className="display-4 text-warning">
                        {report.chemicalDetails.filter(chem => chem.quantity < 10).length}
                      </h3>
                      <p className="text-muted mb-0">Low Stock Items</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h3 className="display-4 text-danger">{expiringChemicals.length}</h3>
                      <p className="text-muted mb-0">Expiring Soon</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>Name</th>
                      <th>Batch</th>
                      <th>Quantity</th>
                      <th>Intake Date</th>
                      <th>Expiration Date</th>
                      <th>Added By</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.chemicalDetails.map((chem) => {
                      const today = new Date();
                      const expiryDate = new Date(chem.expirationDate);
                      const daysToExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
                      
                      let status = 'Normal';
                      let statusVariant = 'success';
                      
                      if (daysToExpiry <= 0) {
                        status = 'Expired';
                        statusVariant = 'danger';
                      } else if (daysToExpiry <= 30) {
                        status = 'Expiring Soon';
                        statusVariant = 'warning';
                      }
                      
                      if (chem.quantity < 10) {
                        status = 'Low Stock';
                        statusVariant = 'warning';
                      }
                      
                      return (
                        <tr key={chem._id}>
                          <td>{chem.name}</td>
                          <td>{chem.batchNumber}</td>
                          <td>{chem.quantity}</td>
                          <td>{new Date(chem.intakeDate).toLocaleDateString()}</td>
                          <td>{new Date(chem.expirationDate).toLocaleDateString()}</td>
                          <td>{chem.addedBy}</td>
                          <td>
                            <Badge bg={statusVariant}>{status}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            <Row className="g-4 mb-4">
              <Col lg={6}>
                <Card>
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Revenue Analysis</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: 300 }}>
                      <ResponsiveContainer>
                        <LineChart data={prepareSalesVsPurchasesData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sales" stroke="#0088FE" name="Revenue" />
                          <Line type="monotone" dataKey="profit" stroke="#00C49F" name="Profit" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Sales by Employee</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={
                              report.salesDetails.reduce((acc, sale) => {
                                const employee = sale.soldBy;
                                const existingEmployee = acc.find(item => item.name === employee);
                                
                                if (existingEmployee) {
                                  existingEmployee.value += (sale.payment?.amountPaid || 0);
                                } else {
                                  acc.push({
                                    name: employee,
                                    value: (sale.payment?.amountPaid || 0)
                                  });
                                }
                                
                                return acc;
                              }, [])
                            }
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {report.salesDetails.reduce((acc, sale) => {
                              const employee = sale.soldBy;
                              if (!acc.find(item => item.name === employee)) {
                                acc.push({ name: employee });
                              }
                              return acc;
                            }, []).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN', {maximumFractionDigits: 2})}`, 'Sales Value']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4">
              <Col md={6}>
                <Card>
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Financial Metrics</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Revenue Growth Rate</span>
                      <span className="h5 mb-0">{report.salesDetails.length > 0 ? '25.4%' : '0%'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Profit Margin</span>
                      <span className="h5 mb-0">
                        {((report.totalSalesValue - report.totalPurchaseCost) / report.totalSalesValue * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Return on Investment</span>
                      <span className="h5 mb-0">
                        {((report.totalSalesValue - report.totalPurchaseCost) / report.totalPurchaseCost * 100).toFixed(2)}%
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Operational Metrics</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Avg. Order Value</span>
                      <span className="h5 mb-0">
                        ₹{report.salesDetails.length > 0 ? 
                          (report.totalSalesValue / report.salesDetails.length).toLocaleString('en-IN', {maximumFractionDigits: 2}) : 
                          '0'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Inventory Value</span>
                      <span className="h5 mb-0">
                        ₹{report.chemicalDetails.reduce((total, chem) => {
                          const purchases = report.purchaseDetails.filter(p => p.chemical?.name === chem.name);
                          const avgPrice = purchases.length > 0 ? 
                            purchases.reduce((sum, p) => sum + p.price, 0) / purchases.length : 0;
                          return total + (chem.quantity * avgPrice);
                        }, 0).toLocaleString('en-IN', {maximumFractionDigits: 2})}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Out of Stock Items</span>
                      <span className="h5 mb-0">{report.chemicalDetails.filter(chem => chem.quantity === 0).length}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Reports;