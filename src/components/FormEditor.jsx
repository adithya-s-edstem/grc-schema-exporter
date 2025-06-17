import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormFieldEditor from './FormFieldEditor';

const FormEditor = ({
  form,
  isActive,
  onSelect,
  onUpdate,
  onDelete,
  onToggleEnabled
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: form.title,
    description: form.description,
    order: form.order
  });

  const addFormField = () => {
    const newFormField = {
      formFieldId: uuidv4(),
      formId: form.formId,
      name: `field_${form.formFields.length + 1}`,
      placeholder: `Enter ${form.formFields.length + 1}`,
      type: "text",
      required: true,
      enabled: true,
      order: form.formFields.length,
      tooltip: {
        status: false,
        message: ""
      },
      conditional: {
        status: false,
        dependsOn: "",
        triggerValue: ""
      },
      options: []
    };
    onUpdate(form.formId, {
      formFields: [...form.formFields, newFormField]
    });
  };

  const updateFormField = (formFieldId, updatedData) => {
    onUpdate(form.formId, {
      formFields: form.formFields.map(field =>
        field.formFieldId === formFieldId ? { ...field, ...updatedData } : field
      )
    });
  };

  const deleteFormField = (formFieldId) => {
    onUpdate(form.formId, {
      formFields: form.formFields.filter(field => field.formFieldId !== formFieldId)
    });
  };

  const toggleFormFieldEnabled = (formFieldId) => {
    onUpdate(form.formId, {
      formFields: form.formFields.map(field =>
        field.formFieldId === formFieldId ? { ...field, enabled: !field.enabled } : field
      )
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdate(form.formId, editData);
    setIsEditing(false);
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${isActive ? 'border-blue-500' : 'border-gray-200'}`}>
      <div
        className={`p-3 cursor-pointer flex justify-between items-center ${form.enabled ? 'bg-white' : 'bg-gray-100'}`}
        onClick={onSelect}
      >
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${form.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="font-medium">{form.title}</span>
          <span className="text-gray-500 text-sm ml-2">(Order: {form.order})</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleEnabled(form.formId);
            }}
            className={`px-2 py-1 text-xs rounded ${form.enabled ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
          >
            {form.enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
              setEditData({
                title: form.title,
                description: form.description,
                order: form.order
              });
            }}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(form.formId);
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
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="3"
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
                <h4 className="font-medium">Form Fields</h4>
                <button
                  onClick={addFormField}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                >
                  Add Field
                </button>
              </div>

              {form.formFields.length === 0 ? (
                <p className="text-gray-500 text-sm">No fields added yet.</p>
              ) : (
                <div className="space-y-2">
                  {form.formFields
                    .sort((a, b) => a.order - b.order)
                    .map(field => (
                      <FormFieldEditor
                        key={field.formFieldId}
                        field={field}
                        allFields={form.formFields}
                        onUpdate={updateFormField}
                        onDelete={deleteFormField}
                        onToggleEnabled={toggleFormFieldEnabled}
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

export default FormEditor;