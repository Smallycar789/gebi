import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Expenses from './pages/Expenses'
import Cleaning from './pages/Cleaning'
import Items from './pages/Items'
import Agreement from './pages/Agreement'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="cleaning" element={<Cleaning />} />
        <Route path="items" element={<Items />} />
        <Route path="agreement" element={<Agreement />} />
      </Route>
    </Routes>
  )
}
