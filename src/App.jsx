import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Expenses from './pages/Expenses'
import ExpenseNew from './pages/ExpenseNew'
import ExpenseDetail from './pages/ExpenseDetail'
import ExpenseCustomSplit from './pages/ExpenseCustomSplit'
import Cleaning from './pages/Cleaning'
import CleaningCheckin from './pages/CleaningCheckin'
import CleaningAdjust from './pages/CleaningAdjust'
import Items from './pages/Items'
import ItemNew from './pages/ItemNew'
import ItemConsume from './pages/ItemConsume'
import ItemDetail from './pages/ItemDetail'
import Agreement from './pages/Agreement'
import AgreementRuleNew from './pages/AgreementRuleNew'
import AgreementRuleEdit from './pages/AgreementRuleEdit'
import AgreementVote from './pages/AgreementVote'
import AgreementSign from './pages/AgreementSign'
import RoomSettings from './pages/RoomSettings'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/new" element={<ExpenseNew />} />
        <Route path="expenses/split" element={<ExpenseCustomSplit />} />
        <Route path="expenses/split/:id" element={<ExpenseCustomSplit />} />
        <Route path="expenses/:id" element={<ExpenseDetail />} />
        <Route path="cleaning" element={<Cleaning />} />
        <Route path="cleaning/adjust" element={<CleaningAdjust />} />
        <Route path="cleaning/checkin" element={<CleaningCheckin />} />
        <Route path="items" element={<Items />} />
        <Route path="items/new" element={<ItemNew />} />
        <Route path="items/consume" element={<ItemConsume />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route path="agreement" element={<Agreement />} />
        <Route path="agreement/new" element={<AgreementRuleNew />} />
        <Route path="agreement/edit" element={<AgreementRuleEdit />} />
        <Route path="agreement/vote" element={<AgreementVote />} />
        <Route path="agreement/sign" element={<AgreementSign />} />
        <Route path="room/settings" element={<RoomSettings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
