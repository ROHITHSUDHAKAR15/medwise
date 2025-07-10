import React from 'react';
import { useStore } from '../store';
import { 
  AlertCircle, 
  Plus, 
  Calendar, 
  ThermometerSun,
  Search,
  Filter,
  TrendingUp,
  Clock,
  MapPin,
  Thermometer,
  Activity,
  Heart,
  Brain,
  Eye,
  Ear,
  Zap,
  ChevronDown,
  Edit,
  Trash2,
  BarChart3
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import AccessibleModal from '../components/AccessibleModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Symptom } from '../types';

function Symptoms() {
  const symptoms = useStore((state) => state.symptoms);
  const addSymptom = useStore((state) => state.addSymptom);
  const { success, info, error } = useToast();
  
  const [showAddSymptom, setShowAddSymptom] = React.useState(false);
  const [showEditSymptom, setShowEditSymptom] = React.useState(false);
  const [editingSymptom, setEditingSymptom] = React.useState<Symptom | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [severityFilter, setSeverityFilter] = React.useState<string>('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = React.useState<string>('');
  
  const [newSymptom, setNewSymptom] = React.useState<Partial<Symptom>>({
    name: '',
    severity: 'mild',
    description: '',
    bodyPart: '',
    duration: '',
    triggers: '',
    location: '',
  });

  const commonSymptoms = [
    { name: 'Headache', icon: Brain, category: 'neurological' },
    { name: 'Fever', icon: Thermometer, category: 'general' },
    { name: 'Cough', icon: Activity, category: 'respiratory' },
    { name: 'Fatigue', icon: Zap, category: 'general' },
    { name: 'Nausea', icon: Heart, category: 'digestive' },
    { name: 'Dizziness', icon: Brain, category: 'neurological' },
    { name: 'Chest Pain', icon: Heart, category: 'cardiovascular' },
    { name: 'Shortness of Breath', icon: Activity, category: 'respiratory' },
    { name: 'Stomach Pain', icon: Heart, category: 'digestive' },
    { name: 'Back Pain', icon: Activity, category: 'musculoskeletal' },
    { name: 'Sore Throat', icon: Activity, category: 'respiratory' },
    { name: 'Joint Pain', icon: Activity, category: 'musculoskeletal' },
  ];

  const bodyParts = [
    'Head', 'Neck', 'Chest', 'Abdomen', 'Back', 'Arms', 'Legs', 'Hands', 'Feet', 'Other'
  ];

  const severityLevels = [
    { value: 'mild', label: 'Mild', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    { value: 'moderate', label: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 'severe', label: 'Severe', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  ];

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSymptom.name) {
      error('Validation Error', 'Please enter a symptom name');
      return;
    }

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: newSymptom.name,
      severity: newSymptom.severity!,
      date: new Date(),
      description: newSymptom.description,
      bodyPart: newSymptom.bodyPart,
      duration: newSymptom.duration,
      triggers: newSymptom.triggers,
      location: newSymptom.location,
    };

    addSymptom(symptom);
    setShowAddSymptom(false);
    resetForm();
    success('Symptom Added', `${symptom.name} has been recorded`);
    
    // Provide helpful suggestions based on severity
    if (symptom.severity === 'severe') {
      info('Medical Attention', 'Consider consulting a healthcare provider for severe symptoms');
    }
  };

  const handleEditSymptom = (symptom: Symptom) => {
    setEditingSymptom(symptom);
    setNewSymptom({
      name: symptom.name,
      severity: symptom.severity,
      description: symptom.description,
      bodyPart: (symptom as any).bodyPart || '',
      duration: (symptom as any).duration || '',
      triggers: (symptom as any).triggers || '',
      location: (symptom as any).location || '',
    });
    setShowEditSymptom(true);
  };

  const handleUpdateSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSymptom) return;

    // In a real app, you'd update the symptom in the store
    setShowEditSymptom(false);
    setEditingSymptom(null);
    resetForm();
    success('Symptom Updated', 'Your symptom has been updated successfully');
  };

  const handleDeleteSymptom = (symptomId: string, symptomName: string) => {
    if (window.confirm(`Are you sure you want to delete "${symptomName}"?`)) {
      // In a real app, you'd remove from store
      success('Symptom Deleted', `${symptomName} has been removed`);
    }
  };

  const resetForm = () => {
    setNewSymptom({
      name: '',
      severity: 'mild',
      description: '',
      bodyPart: '',
      duration: '',
      triggers: '',
      location: '',
    });
  };

  const getSeverityColor = (severity: string) => {
    const level = severityLevels.find(s => s.value === severity);
    return level ? `${level.bgColor} ${level.color}` : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const filteredSymptoms = symptoms.filter(symptom => {
    const matchesSearch = symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         symptom.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || symptom.severity === severityFilter;
    const matchesBodyPart = !selectedBodyPart || (symptom as any).bodyPart === selectedBodyPart;
    
    return matchesSearch && matchesSeverity && matchesBodyPart;
  });

  const getSymptomTrends = () => {
    const last30Days = symptoms.filter(symptom => {
      const daysDiff = (new Date().getTime() - symptom.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    });

    const severityCount = {
      mild: last30Days.filter(s => s.severity === 'mild').length,
      moderate: last30Days.filter(s => s.severity === 'moderate').length,
      severe: last30Days.filter(s => s.severity === 'severe').length,
    };

    return [
      { severity: 'Mild', count: severityCount.mild, color: '#10B981' },
      { severity: 'Moderate', count: severityCount.moderate, color: '#F59E0B' },
      { severity: 'Severe', count: severityCount.severe, color: '#EF4444' },
    ];
  };

  const getSymptomFrequency = () => {
    const frequency: { [key: string]: number } = {};
    symptoms.forEach(symptom => {
      frequency[symptom.name] = (frequency[symptom.name] || 0) + 1;
    });

    return Object.entries(frequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const symptomTrends = getSymptomTrends();
  const symptomFrequency = getSymptomFrequency();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Symptom Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor and track your symptoms over time
          </p>
        </div>
        <button
          onClick={() => setShowAddSymptom(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Symptom
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-enhanced pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Severity</label>
                      <select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className="select-enhanced"
                      >
                        <option value="all">All Severities</option>
                        {severityLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Body Part</label>
                      <select
                        value={selectedBodyPart}
                        onChange={(e) => setSelectedBodyPart(e.target.value)}
                        className="select-enhanced"
                      >
                        <option value="">All Body Parts</option>
                        {bodyParts.map((part) => (
                          <option key={part} value={part}>
                            {part}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setSeverityFilter('all');
                        setSelectedBodyPart('');
                        setShowFilters(false);
                      }}
                      className="btn-secondary w-full"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {symptoms.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Severity Distribution (Last 30 Days)
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={symptomTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="severity" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Common Symptoms */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Most Common Symptoms
            </h3>
            {symptomFrequency.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No symptom data available
              </p>
            ) : (
              <div className="space-y-3">
                {symptomFrequency.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {item.count} time{item.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Add Common Symptoms */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Add Common Symptoms
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {commonSymptoms.map((symptom) => {
            const Icon = symptom.icon;
            return (
              <button
                key={symptom.name}
                onClick={() => {
                  setNewSymptom({ ...newSymptom, name: symptom.name });
                  setShowAddSymptom(true);
                }}
                className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {symptom.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Symptoms List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recorded Symptoms ({filteredSymptoms.length})
          </h2>
          {symptoms.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total: {symptoms.length} symptoms
            </div>
          )}
        </div>
        
        {filteredSymptoms.length === 0 ? (
          <div className="text-center py-12">
            <ThermometerSun className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || severityFilter !== 'all' || selectedBodyPart 
                ? 'No symptoms match your filters' 
                : 'No symptoms recorded yet'
              }
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || severityFilter !== 'all' || selectedBodyPart
                ? 'Try adjusting your search terms or filters'
                : 'Start tracking your symptoms to monitor your health'
              }
            </p>
            {!searchTerm && severityFilter === 'all' && !selectedBodyPart && (
              <button onClick={() => setShowAddSymptom(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Symptom
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSymptoms
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((symptom) => (
                <div
                  key={symptom.id}
                  className="card-enhanced p-6 hover-lift"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {symptom.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                          {symptom.severity}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {symptom.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {symptom.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {(symptom as any).bodyPart && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {(symptom as any).bodyPart}
                          </div>
                        )}
                      </div>
                      
                      {symptom.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {symptom.description}
                        </p>
                      )}
                      
                      {((symptom as any).duration || (symptom as any).triggers) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {(symptom as any).duration && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Duration: </span>
                              <span className="text-gray-600 dark:text-gray-400">{(symptom as any).duration}</span>
                            </div>
                          )}
                          {(symptom as any).triggers && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Triggers: </span>
                              <span className="text-gray-600 dark:text-gray-400">{(symptom as any).triggers}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditSymptom(symptom)}
                        className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Edit symptom"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSymptom(symptom.id, symptom.name)}
                        className="btn-icon text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                        title="Delete symptom"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add Symptom Modal */}
      <AccessibleModal
        isOpen={showAddSymptom}
        onClose={() => setShowAddSymptom(false)}
        title="Add New Symptom"
        size="lg"
      >
        <form onSubmit={handleAddSymptom} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Symptom Name *</label>
              <input
                type="text"
                value={newSymptom.name}
                onChange={(e) => setNewSymptom({ ...newSymptom, name: e.target.value })}
                className="input-enhanced"
                placeholder="Enter symptom name"
                list="common-symptom-names"
                required
              />
              <datalist id="common-symptom-names">
                {commonSymptoms.map((symptom) => (
                  <option key={symptom.name} value={symptom.name} />
                ))}
              </datalist>
            </div>
            
            <div className="form-group">
              <label className="form-label">Severity *</label>
              <select
                value={newSymptom.severity}
                onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value as any })}
                className="select-enhanced"
                required
              >
                {severityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Body Part</label>
              <select
                value={newSymptom.bodyPart}
                onChange={(e) => setNewSymptom({ ...newSymptom, bodyPart: e.target.value })}
                className="select-enhanced"
              >
                <option value="">Select body part</option>
                {bodyParts.map((part) => (
                  <option key={part} value={part}>
                    {part}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                value={newSymptom.duration}
                onChange={(e) => setNewSymptom({ ...newSymptom, duration: e.target.value })}
                className="input-enhanced"
                placeholder="e.g., 2 hours, 3 days"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={newSymptom.description}
              onChange={(e) => setNewSymptom({ ...newSymptom, description: e.target.value })}
              className="textarea-enhanced"
              rows={3}
              placeholder="Describe your symptoms in detail..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Possible Triggers</label>
            <input
              type="text"
              value={newSymptom.triggers}
              onChange={(e) => setNewSymptom({ ...newSymptom, triggers: e.target.value })}
              className="input-enhanced"
              placeholder="e.g., stress, certain foods, weather"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowAddSymptom(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Symptom
            </button>
          </div>
        </form>
      </AccessibleModal>

      {/* Edit Symptom Modal */}
      <AccessibleModal
        isOpen={showEditSymptom}
        onClose={() => setShowEditSymptom(false)}
        title="Edit Symptom"
        size="lg"
      >
        <form onSubmit={handleUpdateSymptom} className="space-y-6">
          {/* Same form fields as add modal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Symptom Name *</label>
              <input
                type="text"
                value={newSymptom.name}
                onChange={(e) => setNewSymptom({ ...newSymptom, name: e.target.value })}
                className="input-enhanced"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Severity *</label>
              <select
                value={newSymptom.severity}
                onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value as any })}
                className="select-enhanced"
                required
              >
                {severityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={newSymptom.description}
              onChange={(e) => setNewSymptom({ ...newSymptom, description: e.target.value })}
              className="textarea-enhanced"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowEditSymptom(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Symptom
            </button>
          </div>
        </form>
      </AccessibleModal>

      {/* Emergency Warning */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">When to Seek Immediate Medical Attention</h3>
            <ul className="space-y-1 text-red-600 dark:text-red-300 text-sm">
              <li>• Severe or persistent chest pain</li>
              <li>• Difficulty breathing or shortness of breath</li>
              <li>• Sudden severe headache</li>
              <li>• High fever that doesn't respond to medication</li>
              <li>• Signs of stroke (face drooping, arm weakness, speech difficulty)</li>
              <li>• Severe allergic reactions</li>
            </ul>
            <button 
              onClick={() => {
                window.open('tel:112', '_self');
                info('Emergency Call', 'Calling emergency services...');
              }}
              className="mt-4 btn-danger"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Call Emergency Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Symptoms;