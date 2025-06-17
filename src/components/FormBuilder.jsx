import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ModuleEditor from './ModuleEditor';

const FormBuilder = () => {
  const [schema, setSchema] = useState({
    modules: [],
    organizationalHierarchy: [],
    riskType: []
  });

  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeFormId, setActiveFormId] = useState(null);

  const addModule = () => {
    const newModule = {
      moduleId: uuidv4(),
      name: `New Module ${schema.modules.length + 1}`,
      order: schema.modules.length,
      enabled: true,
      forms: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSchema(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
    setActiveModuleId(newModule.moduleId);
  };

  const updateModule = (moduleId, updatedData) => {
    setSchema(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.moduleId === moduleId ? { ...module, ...updatedData, updatedAt: new Date().toISOString() } : module
      )
    }));
  };

  const deleteModule = (moduleId) => {
    setSchema(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.moduleId !== moduleId)
    }));
    if (activeModuleId === moduleId) {
      setActiveModuleId(null);
      setActiveFormId(null);
    }
  };

  const toggleModuleEnabled = (moduleId) => {
    setSchema(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.moduleId === moduleId ? { ...module, enabled: !module.enabled, updatedAt: new Date().toISOString() } : module
      )
    }));
  };

  const reorderModules = (newOrder) => {
    setSchema(prev => ({
      ...prev,
      modules: newOrder.map((id, index) => {
        const module = prev.modules.find(m => m.moduleId === id);
        return { ...module, order: index + 1 };
      })
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side - Form Editor */}
      <div className="w-1/2 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">GRC Register Schema Builder</h2>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Modules</h3>
              <button
                onClick={addModule}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Add Module
              </button>
            </div>

            {schema.modules.length === 0 ? (
              <p className="text-gray-500">No modules added yet.</p>
            ) : (
              <div className="space-y-2">
                {schema.modules
                  .sort((a, b) => a.order - b.order)
                  .map(module => (
                    <ModuleEditor
                      key={module.moduleId}
                      module={module}
                      isActive={module.moduleId === activeModuleId}
                      onSelect={() => setActiveModuleId(module.moduleId)}
                      onUpdate={updateModule}
                      onDelete={deleteModule}
                      onToggleEnabled={toggleModuleEnabled}
                      setActiveFormId={setActiveFormId}
                      activeFormId={activeFormId}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - JSON Preview */}
      <div className="w-1/2 p-4 overflow-y-auto bg-gray-800 text-gray-100">
        <div className="sticky top-0 bg-gray-900 p-4 rounded-t-lg">
          <h2 className="text-xl font-bold mb-2">JSON Preview</h2>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(schema, null, 2))}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            Copy to Clipboard
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-xs">
          {JSON.stringify(schema, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FormBuilder;