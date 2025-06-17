import { useState } from 'react';

const fieldTypes = [
  "text",
  "textarea",
  "number",
  "select",
  "multiselect",
  "checkbox",
  "radio",
  "radiogroup",
  "file",
  "date",
  "nodeselect"
];

const FormFieldEditor = ({ field, allFields, onUpdate, onDelete, onToggleEnabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: field.name,
    placeholder: field.placeholder,
    type: field.type,
    required: field.required,
    order: field.order,
    tooltip: { ...field.tooltip },
    conditional: { ...field.conditional },
    options: [...(field.options || [])]
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdate(field.formFieldId, editData);
    setIsEditing(false);
  };

  const addOption = () => {
    setEditData(prev => ({
      ...prev,
      options: [...prev.options, { optionId: Date.now().toString(), label: `Option ${prev.options.length + 1}` }]
    }));
  };

  const updateOption = (optionId, newLabel) => {
    setEditData(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.optionId === optionId ? { ...opt, label: newLabel } : opt
      )
    }));
  };

  const deleteOption = (optionId) => {
    setEditData(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.optionId !== optionId)
    }));
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${field.enabled ? 'bg-white' : 'bg-gray-100'}`}>
      <div className="p-3 cursor-pointer flex justify-between items-center">
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${field.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="font-medium">{field.name}</span>
          <span className="text-gray-500 text-sm ml-2">({field.type}, Order: {field.order})</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleEnabled(field.formFieldId);
            }}
            className={`px-2 py-1 text-xs rounded ${field.enabled ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
          >
            {field.enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
              setEditData({
                name: field.name,
                placeholder: field.placeholder,
                type: field.type,
                required: field.required,
                order: field.order,
                tooltip: { ...field.tooltip },
                conditional: { ...field.conditional },
                options: [...(field.options || [])]
              });
            }}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.formFieldId);
            }}
            className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="p-3 bg-gray-50 border-t">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={editData.placeholder}
                  onChange={(e) => setEditData({ ...editData, placeholder: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={editData.type}
                  onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {fieldTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={editData.order}
                  onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`required-${field.formFieldId}`}
                  checked={editData.required}
                  onChange={(e) => setEditData({ ...editData, required: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor={`required-${field.formFieldId}`} className="text-sm font-medium text-gray-700">Required</label>
              </div>
            </div>

            {/* Tooltip Settings */}
            <div className="border p-3 rounded-lg">
              <h4 className="font-medium mb-2">Tooltip Settings</h4>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`tooltip-status-${field.formFieldId}`}
                  checked={editData.tooltip.status}
                  onChange={(e) => setEditData({
                    ...editData,
                    tooltip: { ...editData.tooltip, status: e.target.checked }
                  })}
                  className="mr-2"
                />
                <label htmlFor={`tooltip-status-${field.formFieldId}`} className="text-sm font-medium text-gray-700">Enable Tooltip</label>
              </div>
              {editData.tooltip.status && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip Message</label>
                  <textarea
                    value={editData.tooltip.message || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      tooltip: { ...editData.tooltip, message: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    rows="2"
                  />
                </div>
              )}
            </div>

            {/* Conditional Logic */}
            <div className="border p-3 rounded-lg">
              <h4 className="font-medium mb-2">Conditional Logic</h4>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`conditional-status-${field.formFieldId}`}
                  checked={editData.conditional.status}
                  onChange={(e) => setEditData({
                    ...editData,
                    conditional: { ...editData.conditional, status: e.target.checked }
                  })}
                  className="mr-2"
                />
                <label htmlFor={`conditional-status-${field.formFieldId}`} className="text-sm font-medium text-gray-700">Enable Conditional</label>
              </div>
              {editData.conditional.status && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Depends On</label>
                    <select
                      value={editData.conditional.dependsOn || ''}
                      onChange={(e) => setEditData({
                        ...editData,
                        conditional: { ...editData.conditional, dependsOn: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select a field</option>
                      {allFields
                        .filter(f => f.formFieldId !== field.formFieldId)
                        .map(f => (
                          <option key={f.formFieldId} value={f.formFieldId}>{f.name}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Value</label>
                    <input
                      type="text"
                      value={editData.conditional.triggerValue || ''}
                      onChange={(e) => setEditData({
                        ...editData,
                        conditional: { ...editData.conditional, triggerValue: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Options for select/multiselect/radio */}
            {(editData.type === 'select' || editData.type === 'multiselect' || editData.type === 'radio') && (
              <div className="border p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Options</h4>
                  <button
                    type="button"
                    onClick={addOption}
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                  >
                    Add Option
                  </button>
                </div>
                {editData.options.length === 0 ? (
                  <p className="text-gray-500 text-sm">No options added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {editData.options.map(option => (
                      <div key={option.optionId} className="flex items-center">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => updateOption(option.optionId, e.target.value)}
                          className="flex-1 p-2 border rounded mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => deleteOption(option.optionId)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FormFieldEditor;