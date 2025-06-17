import { useState } from 'react'
import { v4 } from 'uuid'

function App() {
  const [fieldName, setFieldName] = useState("")
  const [formId, setFormId] = useState("")
  const [moduleId, setModuleId] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [tooltip, setTooltip] = useState("")
  const [type, setType] = useState("")

  const genSchema = {
    "formFieldId": v4(),
    "formId": formId,
    "name": fieldName,
    "enabled": true,
    "order": 2,
    "placeholder": placeholder,
    "required": true,
    "type": type,
    "conditional": {
      "status": false
    },
    "tooltip": {
      "status": !!tooltip,
      "message": tooltip
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1>GRC Schema Generator</h1>
      <div className='flex flex-col gap-3'>
        <h2>Form Field schema generator</h2>
        <input type='text' value={formId} onChange={(e) => setFormId(e.target.value)} placeholder='Form ID' />
        <input type='text' value={moduleId} onChange={(e) => setModuleId(e.target.value)} placeholder='Module ID' />
        <input type='text' value={type} onChange={(e) => setType(e.target.value)} placeholder='Type' />
        <input type='text' value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder='Field name' />
        <input type='text' value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder='Placeholder' />
        <input type='text' value={tooltip} onChange={(e) => setTooltip(e.target.value)} placeholder='Tooltip' />
        <textarea className="w-full h-40 font-mono" value={JSON.stringify(genSchema)} />
      </div>
    </div >
  )
}

export default App;
