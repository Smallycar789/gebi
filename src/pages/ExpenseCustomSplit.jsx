import { Navigate, useParams } from 'react-router-dom'

/** 自定义分摊已合并至新增/编辑账单，旧链接自动跳转 */
export default function ExpenseCustomSplit() {
  const { id } = useParams()
  if (id) {
    return <Navigate to={`/expenses/${id}`} replace state={{ edit: true }} />
  }
  return <Navigate to="/expenses/new" replace />
}
