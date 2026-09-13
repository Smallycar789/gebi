import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import {
  getAssignments,
  getCleaningAreas,
  saveAssignments,
  roommates,
} from '../data/cleaningStore'
import './CleaningAdjust.css'
import './FeaturePage.css'

function cloneAssignments(source) {
  const next = {}
  for (const rm of roommates) {
    next[rm.name] = [...(source[rm.name] || [])]
  }
  return next
}

export default function CleaningAdjust() {
  const navigate = useNavigate()
  const allAreas = getCleaningAreas()
  const [assignments, setAssignments] = useState(() => cloneAssignments(getAssignments()))
  const [dragArea, setDragArea] = useState(null)
  const [error, setError] = useState('')

  const unassigned = useMemo(() => {
    const used = new Set(roommates.flatMap((rm) => assignments[rm.name] || []))
    return allAreas.filter((area) => !used.has(area))
  }, [assignments, allAreas])

  function removeFromAll(area) {
    const next = cloneAssignments(assignments)
    for (const rm of roommates) {
      next[rm.name] = next[rm.name].filter((a) => a !== area)
    }
    return next
  }

  function assignArea(area, person) {
    setAssignments((prev) => {
      const next = removeFromAll(area)
      if (person) {
        next[person] = [...next[person], area]
      }
      return next
    })
  }

  function handleDropOnColumn(person) {
    if (!dragArea) return
    assignArea(dragArea, person)
    setDragArea(null)
  }

  function handleDropOnPool() {
    if (!dragArea) return
    setAssignments((prev) => removeFromAll(dragArea))
    setDragArea(null)
  }

  function handleConfirm() {
    setError('')
    const result = saveAssignments(assignments)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate('/cleaning', { state: { scheduleUpdated: true } })
  }

  return (
    <div className="feature-page cleaning-adjust">
      <BackLink to="/cleaning" />
      <PageHeader
        icon="📅"
        title="调整排班"
        subtitle="将清洁区域拖动到对应室友列，确认后更新本周值日排班表。"
      />

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="adjust-pool">
        <h2>待分配区域</h2>
        <p className="adjust-hint">拖动下方区域滑块到室友列；也可拖回此处取消分配。</p>
        <div
          className="adjust-drop-zone adjust-drop-zone--pool"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnPool}
        >
          {unassigned.length === 0 ? (
            <span className="adjust-empty">已全部分配</span>
          ) : (
            unassigned.map((area) => (
              <span
                key={area}
                className="area-slider"
                draggable
                onDragStart={() => setDragArea(area)}
                onDragEnd={() => setDragArea(null)}
              >
                {area}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="adjust-table-wrap">
        <table className="adjust-table">
          <thead>
            <tr>
              {roommates.map((rm) => (
                <th key={rm.id}>{rm.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {roommates.map((rm) => (
                <td key={rm.id}>
                  <div
                    className="adjust-drop-zone adjust-drop-zone--column"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOnColumn(rm.name)}
                  >
                    {(assignments[rm.name] || []).length === 0 ? (
                      <span className="adjust-empty">拖入区域</span>
                    ) : (
                      (assignments[rm.name] || []).map((area) => (
                        <span
                          key={area}
                          className="area-slider"
                          draggable
                          onDragStart={() => setDragArea(area)}
                          onDragEnd={() => setDragArea(null)}
                        >
                          {area}
                        </span>
                      ))
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="form-actions adjust-actions">
        <Button type="button" onClick={handleConfirm}>确认排班</Button>
        <Button as="Link" to="/cleaning" variant="ghost">取消</Button>
      </div>
    </div>
  )
}
