import { useState } from 'react'

function App() {
  const [fieldName, setFieldName] = useState("")
  const [formId, setFormId] = useState("")
  const [moduleId, setModuleId] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [tooltip, setTooltip] = useState("")

  const genSchema = {
    "formFieldId": "b8478f18-478b-4fc0-a4ba-36efbeb949ee",
    "formId": "e2bacd72-2cc5-4c8c-b2be-ab28631a4a0a",
    "name": "Event Description/Summary",
    "enabled": true,
    "order": 2,
    "placeholder": "What happened, Where did the event occur, Who are the parties involved, How the event happened",
    "required": true,
    "type": "textarea",
    "conditional": {
      "status": false
    },
    "tooltip": {
      "status": true,
      "message": "Please enter background, issue description, root cause, high level financial and customer/client impact and discovery source"
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1>GRC Schema Generator</h1>
      <div className='flex flex-col gap-3'>
        <h2>Form Field schema generator</h2>
        <input type='text' value={formId} onChange={(e) => setFormId(e.target.value)} placeholder='Form ID' />
        <input type='text' value={moduleId} onChange={(e) => setModuleId(e.target.value)} placeholder='Module ID' />
        <input type='text' value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder='Field name' />
        <input type='text' value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder='Placeholder' />
        <input type='text' value={tooltip} onChange={(e) => setTooltip(e.target.value)} placeholder='Tooltip' />
        <textarea className="w-full h-40" value={JSON.stringify(genSchema)} />
      </div>
    </div >
  )
}

export default App;
