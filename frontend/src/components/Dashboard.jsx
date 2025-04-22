// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

// function Dashboard({ user }) {
//   const navigate = useNavigate()
//   const [chemicals, setChemicals] = useState([])
//   const [form, setForm] = useState({
//     name: '',
//     batchNumber: '',
//     quantity: '',
//     intakeDate: '',
//     expirationDate: ''
//   })

//   useEffect(() => {
//     if (!user) {
//       navigate('/')
//     } else {
//       fetchChemicals()
//     }
//   }, [user])

//   const fetchChemicals = async () => {
//     const res = await axios.get('http://localhost:5000/api/chemicals')
//     setChemicals(res.data)
//   }

//   const handleAddChemical = async () => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/chemicals', {
//         ...form,
//         addedBy: user.name,
//         role: user.role
//       })
//       alert('Chemical added')
//       fetchChemicals()
//     } catch (err) {
//       alert('Failed to add chemical')
//     }
//   }

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Welcome, {user?.role}</h2>

//       {(user.role === 'admin' || user.role === 'staff') && (
//         <>
//           <h3>Add Chemical</h3>
//           <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} /><br />
//           <input placeholder="Batch Number" onChange={e => setForm({ ...form, batchNumber: e.target.value })} /><br />
//           <input type="number" placeholder="Quantity" onChange={e => setForm({ ...form, quantity: e.target.value })} /><br />
//           <input type="date" placeholder="Intake Date" onChange={e => setForm({ ...form, intakeDate: e.target.value })} /><br />
//           <input type="date" placeholder="Expiration Date" onChange={e => setForm({ ...form, expirationDate: e.target.value })} /><br />
//           <button onClick={handleAddChemical}>Add</button>
//         </>
//       )}

//       <h3>Chemicals List</h3>
//       <ul>
//         {chemicals.map((chem) => (
//           <li key={chem._id}>
//             {chem.name} - {chem.quantity} units (Added by: {chem.addedBy})
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default Dashboard
