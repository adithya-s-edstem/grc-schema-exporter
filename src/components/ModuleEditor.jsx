import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormEditor from './FormEditor';

const ModuleEditor = ({
  module,
  isActive,
  onSelect,
  onUpdate,
  onDelete,
  onToggleEnabled,
  setActiveFormId,
  activeFormId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: module.name,
    order: module.order
  });

  const addForm = () => {
    const newForm = {
      formId: uuidv4(),
      moduleId: module.moduleId,
      title: `New Form ${module.forms.length + 1}`,
      description: '',
      order: module.forms.length,
      enabled: true,
      formFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onUpdate(module.moduleId, {
      forms: [...module.forms, newForm]
    });
    setActiveFormId(newForm.formId);
  };

  const updateForm = (formId, updatedData) => {
    onUpdate(module.moduleId, {
      forms: module.forms.map(form =>
        form.formId === formId ? { ...form, ...updatedData, updatedAt: new Date().toISOString() } : form
      )
    });
  };

  const deleteForm = (formId) => {
    onUpdate(module.moduleId, {
      forms: module.forms.filter(form => form.formId !== formId)
    });
    if (activeFormId === formId) {
      setActiveFormId(null);
    }
  };

  const toggleFormEnabled = (formId) => {
    onUpdate(module.moduleId, {
      forms: module.forms.map(form =>
        form.formId === formId ? { ...form, enabled: !form.enabled, updatedAt: new Date().toISOString() } : form
      )
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdate(module.moduleId, editData);
    setIsEditing(false);
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${isActive ? 'border-blue-500' : 'border-gray-200'}`}>
      <div
        className={`p-3 cursor-pointer flex justify-between items-center ${module.enabled ? 'bg-white' : 'bg-gray-100'}`}
        onClick={onSelect}
      >
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${module.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="font-medium">{module.name}</span>
          <span className="text-gray-500 text-sm ml-2">(Order: {module.order})</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleEnabled(module.moduleId);
            }}
            className={`px-2 py-1 text-xs rounded ${module.enabled ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
          >
            {module.enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
              setEditData({
                name: module.name,
                order: module.order
              });
            }}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(module.moduleId);
            }}
            className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {isActive && (
        <div className="p-3 bg-gray-50 border-t">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={editData.order}
                    onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
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
          ) : (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Forms</h4>
                <button
                  onClick={addForm}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                >
                  Add Form
                </button>
              </div>

              {module.forms.length === 0 ? (
                <p className="text-gray-500 text-sm">No forms added yet.</p>
              ) : (
                <div className="space-y-2">
                  {module.forms
                    .sort((a, b) => a.order - b.order)
                    .map(form => (
                      <FormEditor
                        key={form.formId}
                        form={form}
                        isActive={form.formId === activeFormId}
                        onSelect={() => setActiveFormId(form.formId)}
                        onUpdate={updateForm}
                        onDelete={deleteForm}
                        onToggleEnabled={toggleFormEnabled}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleEditor;