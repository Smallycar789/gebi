import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Expenses from './pages/Expenses'
import ExpenseNew from './pages/ExpenseNew'
import ExpenseDetail from './pages/ExpenseDetail'
import Cleaning from './pages/Cleaning'
import CleaningCheckin from './pages/CleaningCheckin'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import Agreement from './pages/Agreement'
import RoomSettings from './pages/RoomSettings'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/new" element={<ExpenseNew />} />
        <Route path="expenses/:id" element={<ExpenseDetail />} />
        <Route path="cleaning" element={<Cleaning />} />
        <Route path="cleaning/checkin" element={<CleaningCheckin />} />
        <Route path="items" element={<Items />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route path="agreement" element={<Agreement />} />
        <Route path="room/settings" element={<RoomSettings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
