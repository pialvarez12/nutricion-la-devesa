import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts';
import { 
  Scale, Calendar, User, Lock, Mail, Activity, AlertCircle, 
  CheckCircle2, ChevronRight, Plus, Trash2, LogOut, ShieldCheck, 
  Heart, Moon, Zap, Smile, BrainCircuit,
  Camera, Image as ImageIcon, Bell
} from 'lucide-react';

// --- LOGO SVG RECREADO DE MANERA FIDEL AL LOGO ADJUNTADO (PATO + HOJA + CRUZ MÉDICA) ---
const DevesaLogo = ({ className = "h-10 w-10" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cruz Verde Médica Base */}
    <path 
      d="M78 20 C78 14.4772 82.4772 10 88 10 H112 C117.523 10 122 14.4772 122 20 V78 H180 C185.523 78 190 82.4772 190 88 V112 C190 117.523 185.523 122 180 122 H122 V180 C122 185.523 117.523 190 112 190 H88 C82.4772 190 78 185.523 78 180 V122 H20 C14.4772 122 10 117.523 10 112 V88 C10 82.4772 14.4772 78 20 78 H78 V20 Z" 
      fill="#0B5D34" 
    />
    
    {/* Hoja Verde Izquierda */}
    <path 
      d="M 12 76 C 12 76, 50 125, 95 137 C 80 100, 35 75, 12 76 Z" 
      fill="#25B863" 
    />
    <path 
      d="M 22 82 C 45 92, 72 110, 92 133" 
      stroke="#0B5D34" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />

    {/* Silueta del Ave / Pato en el Centro y Derecha */}
    <path 
      d="M 95 137 C 120 137, 128 100, 120 82 C 114 69, 95 65, 93 48 C 91 32, 110 28, 125 38 C 135 44, 136 34, 125 28 C 105 18, 80 25, 82 48 C 84 66, 104 70, 108 82 C 113 95, 108 122, 95 137 Z" 
      fill="#25B863" 
    />

    {/* Borde sutil blanco de definición de la figura sobre la cruz */}
    <path 
      d="M 95 137 C 120 137, 128 100, 120 82 C 114 69, 95 65, 93 48 C 91 32, 110 28, 125 38 C 135 44, 136 34, 125 28 C 105 18, 80 25, 82 48 C 84 66, 104 70, 108 82 C 113 95, 108 122, 95 137 Z" 
      stroke="#FFFFFF" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

// Pacientes de demostración iniciales (Se mantendrán en localStorage)
const INITIAL_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Ana María Gómez',
    email: 'ana@ejemplo.com',
    pin: '1234',
    targetWeight: 62.0,
    sex: 'female_cycle',
    startDate: '2026-03-01',
    rgpdAccepted: true,
    logs: [
      { id: 'l1', date: '2026-04-20', weight: 64.2, energy: 4, satiety: 4, adherence: 90, stress: 2, sleep: 4, cycleStatus: 'follicular', isPeriodActive: false, painLevel: 0, cycleSymptoms: ['Energía alta'], photoUrl: null, notes: 'Me he sentido con mucha vitalidad y buena digestión.' },
      { id: 'l2', date: '2026-04-18', weight: 64.6, energy: 3, satiety: 3, adherence: 80, stress: 3, sleep: 3, cycleStatus: 'follicular', isPeriodActive: false, painLevel: 1, cycleSymptoms: [], photoUrl: null, notes: 'Entrenamiento intenso.' },
      { id: 'l3', date: '2026-04-15', weight: 65.1, energy: 2, satiety: 3, adherence: 70, stress: 4, sleep: 2, cycleStatus: 'luteal', isPeriodActive: false, painLevel: 3, cycleSymptoms: ['Hinchazón abdominal', 'Antojos dulce / salado'], photoUrl: null, notes: 'Un poco inflamada por la fase previa a la regla.' }
    ]
  },
  {
    id: 'pat-2',
    name: 'Carmen Lucía Fernández',
    email: 'carmen@ejemplo.com',
    pin: '5678',
    targetWeight: 58.0,
    sex: 'female_no_cycle',
    startDate: '2026-03-15',
    rgpdAccepted: true,
    logs: [
      { id: 'cl1', date: '2026-04-21', weight: 60.1, energy: 4, satiety: 4, adherence: 85, stress: 2, sleep: 4, cycleStatus: 'none', notes: 'Buenas sensaciones generales, menos pesadez.' },
      { id: 'cl2', date: '2026-04-16', weight: 60.4, energy: 3, satiety: 4, adherence: 90, stress: 2, sleep: 4, cycleStatus: 'none', notes: 'Cena ligera muy bien digerida.' }
    ]
  }
];

export default function App() {
  // Estado principal de pacientes guardados persistentemente
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('devesa_patients_v3');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch (e) {
      console.error('Error cargando pacientes:', e);
      return INITIAL_PATIENTS;
    }
  });

  // Guardar permanentemente ante cualquier actualización de datos
  useEffect(() => {
    try {
      localStorage.setItem('devesa_patients_v3', JSON.stringify(patients));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }, [patients]);

  // Estado de paciente logueado
  const [currentPatientId, setCurrentPatientId] = useState(() => {
    return localStorage.getItem('devesa_current_patient_id_v3') || null;
  });

  useEffect(() => {
    if (currentPatientId) {
      localStorage.setItem('devesa_current_patient_id_v3', currentPatientId);
    } else {
      localStorage.removeItem('devesa_current_patient_id_v3');
    }
  }, [currentPatientId]);

  // Estado de Nutricionista
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('devesa_is_admin_v3') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('devesa_is_admin_v3', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Paciente seleccionado en panel de Nutricionista
  const [selectedAdminPatientId, setSelectedAdminPatientId] = useState(() => {
    const savedAdminPat = localStorage.getItem('devesa_selected_admin_patient_v3');
    return savedAdminPat || (INITIAL_PATIENTS[0]?.id || null);
  });

  useEffect(() => {
    if (selectedAdminPatientId) {
      localStorage.setItem('devesa_selected_admin_patient_v3', selectedAdminPatientId);
    }
  }, [selectedAdminPatientId]);

  // Inputs de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Vista actual
  const [viewMode, setViewMode] = useState(() => {
    if (localStorage.getItem('devesa_is_admin_v3') === 'true') return 'admin_dashboard';
    if (localStorage.getItem('devesa_current_patient_id_v3')) return 'patient_dashboard';
    return 'login_patient';
  });

  // Modal Alta Paciente
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    email: '',
    pin: '',
    targetWeight: '',
    sex: 'female_cycle'
  });

  // Formulario Pesaje
  const [weighForm, setWeighForm] = useState({
    weight: '',
    energy: 3,
    satiety: 3,
    adherence: 80,
    stress: 3,
    sleep: 3,
    cycleStatus: 'none',
    isPeriodActive: false,
    painLevel: 0,
    cycleSymptoms: [],
    photoUrl: null,
    notes: ''
  });

  // Obtener paciente actual de manera reactiva
  const currentPatient = useMemo(() => {
    return patients.find(p => p.id === currentPatientId) || null;
  }, [patients, currentPatientId]);

  const selectedAdminPatient = useMemo(() => {
    return patients.find(p => p.id === selectedAdminPatientId) || patients[0] || null;
  }, [patients, selectedAdminPatientId]);

  const [rgpdAccepted, setRgpdAccepted] = useState(() => {
    return currentPatient ? !!currentPatient.rgpdAccepted : false;
  });

  useEffect(() => {
    if (currentPatient) {
      setRgpdAccepted(!!currentPatient.rgpdAccepted);
    }
  }, [currentPatient]);

  const CYCLE_SYMPTOMS_OPTIONS = [
    'Hinchazón abdominal',
    'Retención de líquidos',
    'Antojos dulce / salado',
    'Cramps / Dolor pélvico',
    'Sensibilidad mamaria',
    'Irritabilidad / Cambios de humor',
    'Cansancio extremo',
    'Migraña / Dolor de cabeza',
    'Pesadez digestiva'
  ];

  const handleSymptomToggle = (symptom) => {
    setWeighForm(prev => {
      const exists = prev.cycleSymptoms.includes(symptom);
      return {
        ...prev,
        cycleSymptoms: exists
          ? prev.cycleSymptoms.filter(s => s !== symptom)
          : [...prev.cycleSymptoms, symptom]
      };
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen seleccionada supera los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setWeighForm(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Login de Pacientes
  const handlePatientLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const patient = patients.find(
      p => p.email.toLowerCase() === loginEmail.trim().toLowerCase() && p.pin === loginPin.trim()
    );

    if (patient) {
      setCurrentPatientId(patient.id);
      setIsAdminLoggedIn(false);
      setViewMode('patient_dashboard');
      setLoginEmail('');
      setLoginPin('');
    } else {
      setLoginError('Credenciales incorrectas. Revisa tu correo y tu PIN.');
    }
  };

  // Login de Nutricionista (PIN 2026 Oculto)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (adminPinInput.trim() === '2026') {
      setIsAdminLoggedIn(true);
      setCurrentPatientId(null);
      setViewMode('admin_dashboard');
      if (patients.length > 0 && !selectedAdminPatientId) {
        setSelectedAdminPatientId(patients[0].id);
      }
      setAdminPinInput('');
    } else {
      setLoginError('PIN de acceso incorrecto.');
    }
  };

  const handleLogout = () => {
    setCurrentPatientId(null);
    setIsAdminLoggedIn(false);
    setViewMode('login_patient');
    setLoginError('');
  };

  const handleAcceptRgpd = () => {
    setRgpdAccepted(true);
    setPatients(prev => prev.map(p => {
      if (p.id === currentPatientId) {
        return { ...p, rgpdAccepted: true };
      }
      return p;
    }));
  };

  // Alta de Paciente guardada en localStorage
  const handleCreatePatient = (e) => {
    e.preventDefault();
    if (!newPatientData.name || !newPatientData.email || !newPatientData.pin) return;

    const emailExists = patients.some(p => p.email.toLowerCase() === newPatientData.email.trim().toLowerCase());
    if (emailExists) {
      alert('Ya existe un paciente con este correo electrónico.');
      return;
    }

    const newPatient = {
      id: 'pat-' + Date.now(),
      name: newPatientData.name.trim(),
      email: newPatientData.email.trim().toLowerCase(),
      pin: newPatientData.pin.trim(),
      targetWeight: parseFloat(newPatientData.targetWeight) || 0,
      sex: newPatientData.sex,
      startDate: new Date().toISOString().split('T')[0],
      rgpdAccepted: false,
      logs: []
    };

    setPatients(prev => [newPatient, ...prev]);
    setSelectedAdminPatientId(newPatient.id);
    setNewPatientData({ name: '', email: '', pin: '', targetWeight: '', sex: 'female_cycle' });
    setShowNewPatientModal(false);
  };

  const handleDeletePatient = (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${name}?`)) {
      const updated = patients.filter(p => p.id !== id);
      setPatients(updated);
      if (selectedAdminPatientId === id) {
        setSelectedAdminPatientId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  // Guardar pesaje permanentemente
  const handleAddLog = (e) => {
    e.preventDefault();
    if (!weighForm.weight || !currentPatient) return;

    const newLog = {
      id: 'log-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weighForm.weight),
      energy: Number(weighForm.energy),
      satiety: Number(weighForm.satiety),
      adherence: Number(weighForm.adherence),
      stress: Number(weighForm.stress),
      sleep: Number(weighForm.sleep),
      cycleStatus: currentPatient.sex === 'female_cycle' ? weighForm.cycleStatus : 'none',
      isPeriodActive: currentPatient.sex === 'female_cycle' ? weighForm.isPeriodActive : false,
      painLevel: currentPatient.sex === 'female_cycle' ? Number(weighForm.painLevel) : 0,
      cycleSymptoms: currentPatient.sex === 'female_cycle' ? weighForm.cycleSymptoms : [],
      photoUrl: weighForm.photoUrl,
      notes: weighForm.notes.trim()
    };

    setPatients(prev => prev.map(p => {
      if (p.id === currentPatientId) {
        return {
          ...p,
          logs: [newLog, ...(p.logs || [])]
        };
      }
      return p;
    }));

    setWeighForm({
      weight: '',
      energy: 3,
      satiety: 3,
      adherence: 80,
      stress: 3,
      sleep: 3,
      cycleStatus: 'none',
      isPeriodActive: false,
      painLevel: 0,
      cycleSymptoms: [],
      photoUrl: null,
      notes: ''
    });

    alert('¡Registro guardado y almacenado correctamente!');
  };

  // Métricas para nutricionista
  const getPatientMetrics = (patient) => {
    if (!patient || !patient.logs || patient.logs.length === 0) {
      return {
        weeklyAvg: null,
        monthlyAvg: null,
        latestWeight: null,
        totalChange: null,
        avgEnergy: null,
        avgSatiety: null,
        avgAdherence: null,
        avgStress: null,
        avgSleep: null,
        interpretation: 'Aún no existen registros suficientes para generar una interpretación clínica.'
      };
    }

    const now = new Date();
    const sortedLogs = [...patient.logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestWeight = sortedLogs[0].weight;
    const initialWeight = sortedLogs[sortedLogs.length - 1].weight;
    const totalChange = (latestWeight - initialWeight).toFixed(1);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyLogs = sortedLogs.filter(l => new Date(l.date) >= sevenDaysAgo);
    const weeklyAvg = weeklyLogs.length > 0 
      ? (weeklyLogs.reduce((acc, curr) => acc + curr.weight, 0) / weeklyLogs.length).toFixed(1)
      : latestWeight.toFixed(1);

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthlyLogs = sortedLogs.filter(l => new Date(l.date) >= thirtyDaysAgo);
    const monthlyAvg = monthlyLogs.length > 0
      ? (monthlyLogs.reduce((acc, curr) => acc + curr.weight, 0) / monthlyLogs.length).toFixed(1)
      : weeklyAvg;

    const activeLogs = monthlyLogs.length > 0 ? monthlyLogs : sortedLogs;
    const avgEnergy = (activeLogs.reduce((a, c) => a + (c.energy || 3), 0) / activeLogs.length).toFixed(1);
    const avgSatiety = (activeLogs.reduce((a, c) => a + (c.satiety || 3), 0) / activeLogs.length).toFixed(1);
    const avgAdherence = Math.round(activeLogs.reduce((a, c) => a + (c.adherence || 80), 0) / activeLogs.length);
    const avgStress = (activeLogs.reduce((a, c) => a + (c.stress || 3), 0) / activeLogs.length).toFixed(1);
    const avgSleep = (activeLogs.reduce((a, c) => a + (c.sleep || 3), 0) / activeLogs.length).toFixed(1);

    let interpretationLines = [];
    const diffAvg = (parseFloat(weeklyAvg) - parseFloat(monthlyAvg)).toFixed(1);

    if (diffAvg < -0.3) {
      interpretationLines.push(`📉 Tendencia Descendente Saludable: El promedio semanal (${weeklyAvg} kg) está por debajo del mensual (${monthlyAvg} kg). Hay un déficit calórico efectivo.`);
    } else if (diffAvg > 0.3) {
      interpretationLines.push(`📈 Repunte o Retención de Líquidos: El promedio semanal (${weeklyAvg} kg) supera al mensual (${monthlyAvg} kg) en +${diffAvg} kg.`);
    } else {
      interpretationLines.push(`⚖️ Fase de Estabilización: Peso muy estable entre el promedio semanal (${weeklyAvg} kg) y el mensual (${monthlyAvg} kg).`);
    }

    if (patient.sex === 'female_cycle') {
      const recentLutealOrMenstruation = sortedLogs.slice(0, 3).some(l => l.cycleStatus === 'luteal' || l.cycleStatus === 'menstruation');
      if (recentLutealOrMenstruation) {
        interpretationLines.push(`🌸 Influencia Hormonal: En fase Lútea o Menstruación. La elevación puntual suele responder a retención de líquidos fisiológica, no a grasa.`);
      }
    }

    if (avgAdherence < 70) {
      interpretationLines.push(`⚠️ Adherencia Regular: Adherencia promedio del ${avgAdherence}%. Considerar simplificar preparaciones.`);
    } else {
      interpretationLines.push(`✨ Alta Adherencia: Excelente compromiso con el plan alimentario (${avgAdherence}% de cumplimiento medio).`);
    }

    return {
      weeklyAvg,
      monthlyAvg,
      latestWeight,
      totalChange,
      avgEnergy,
      avgSatiety,
      avgAdherence,
      avgStress,
      avgSleep,
      interpretation: interpretationLines.join('\n\n')
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 w-full overflow-x-hidden">
      
      {/* HEADER ADAPTADO A MÓVIL Y DESKTOP */}
      <header className="bg-white border-b border-emerald-100 shadow-xs sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Logo y Nombre con Subtítulo Exacto Solicitado */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <DevesaLogo className="h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0" />
            <div>
              <h1 className="text-base sm:text-xl font-black text-emerald-950 tracking-tight leading-none">
                Nutrición La Devesa
              </h1>
              <p className="text-[10px] sm:text-xs text-emerald-700 font-medium mt-0.5 leading-tight">
                Centro de Nutrición y salud integral
              </p>
            </div>
          </div>

          {/* Botones de Navegación / Sesión */}
          <div className="flex items-center space-x-2">
            {viewMode === 'login_patient' && (
              <button
                onClick={() => { setViewMode('login_admin'); setLoginError(''); }}
                className="text-xs font-semibold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 text-emerald-900 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 transition flex items-center space-x-1"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-[11px] sm:text-xs">Acceso Nutricionista</span>
              </button>
            )}

            {viewMode === 'login_admin' && (
              <button
                onClick={() => { setViewMode('login_patient'); setLoginError(''); }}
                className="text-xs font-semibold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-[11px] sm:text-xs"
              >
                Acceso Paciente
              </button>
            )}

            {(viewMode === 'patient_dashboard' || viewMode === 'admin_dashboard') && (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline-block text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  {isAdminLoggedIn ? '👨‍⚕️ Nutricionista' : `👤 ${currentPatient?.name}`}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-xs font-bold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition text-[11px] sm:text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL ADAPTADO Y FLUIDO */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

        {/* 1. LOGIN DE PACIENTES */}
        {viewMode === 'login_patient' && (
          <div className="max-w-md mx-auto my-6 sm:my-12 bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-emerald-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-teal-500"></div>

            <div className="text-center mb-6">
              <DevesaLogo className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Portal del Paciente</h2>
              <p className="text-xs text-slate-500 mt-1">Ingresa tus datos personales para acceder a tu historial</p>
            </div>

            {loginError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handlePatientLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PIN Personal (4 dígitos)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="****"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none tracking-widest text-lg font-bold bg-slate-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 mt-2"
              >
                <span>Acceder</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 2. LOGIN DE NUTRICIONISTA (PIN 2026 OCULTO) */}
        {viewMode === 'login_admin' && (
          <div className="max-w-md mx-auto my-6 sm:my-12 bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-900"></div>

            <div className="text-center mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-800" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Acceso Clínico</h2>
              <p className="text-xs text-slate-500 mt-1">Portal exclusivo para el equipo de Nutrición La Devesa</p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clave o PIN de Nutricionista</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  {/* TEXTO EXACTO CAMBIADO: INGRESA PIN Y PIN SECRETO DE 4 DÍGITOS TIPO PASSWORD */}
                  <input
                    type="password"
                    required
                    placeholder="INGRESA PIN"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none tracking-widest font-bold"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setViewMode('login_patient'); setLoginError(''); }}
                  className="w-1/2 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-emerald-900 text-white font-bold rounded-xl text-xs hover:bg-emerald-950 transition shadow-md"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. VISTA DEL PACIENTE */}
        {viewMode === 'patient_dashboard' && currentPatient && (
          <div>
            {!rgpdAccepted ? (
              <div className="max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-3xl shadow-lg border border-emerald-100 my-4 sm:my-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <ShieldCheck className="w-7 h-7 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">Compromiso Ético y Confidencialidad</h3>
                    <p className="text-xs text-emerald-700 font-semibold">Nutrición La Devesa - Protección de Datos</p>
                  </div>
                </div>

                {/* MODIFICACIÓN RGPD: SE ELIMINÓ EL TEXTO SOLICITADO SOBRE ALMACENAMIENTO CIFRADO */}
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                  <p>
                    En <strong>Nutrición La Devesa</strong>, la relación con cada paciente se basa en la máxima confianza y rigor sanitario. Todos los datos registrados en esta plataforma —incluyendo historiales ponderales, sintomatología menstrual, estados digestivos y <strong>fotografías de progreso corporal</strong>— son tratados bajo <strong>estricto secreto profesional</strong> conforme a la Deontología Sanitaria y al <strong>Reglamento General de Protección de Datos (RGPD UE 2016/679)</strong>.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700 font-medium">
                    <li><strong className="text-slate-900">Uso Exclusivo Clínico:</strong> Tus imágenes e historial solo serán accesibles por tu nutricionista asignado para valorar la composición corporal real.</li>
                    <li><strong className="text-slate-900">Confidencialidad Absoluta de Fotografías:</strong> En ningún caso se publicarán, difundirán ni compartirán imágenes con terceros sin tu consentimiento expreso por escrito.</li>
                  </ul>
                </div>

                <button
                  onClick={handleAcceptRgpd}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Acepto las Condiciones de Privacidad</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                
                {/* Banner Saludo */}
                <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">¡Hola, {currentPatient.name}! 👋</h2>
                    <p className="text-emerald-200 text-xs mt-1">Seguimiento de nutrición personalizada</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs w-max">
                    <div>
                      <span className="text-emerald-200 block text-[10px] uppercase font-bold">Objetivo:</span>
                      <span className="font-extrabold text-xs sm:text-sm text-white">{currentPatient.targetWeight ? `${currentPatient.targetWeight} kg` : 'Mantenimiento'}</span>
                    </div>
                    <div className="h-6 w-px bg-emerald-600"></div>
                    <div>
                      <span className="text-emerald-200 block text-[10px] uppercase font-bold">Perfil:</span>
                      <span className="font-extrabold text-xs sm:text-sm text-white">
                        {currentPatient.sex === 'female_cycle' ? 'Mujer (ciclo)' : currentPatient.sex === 'female_no_cycle' ? 'Mujer (sin ciclo)' : 'Hombre'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RECORDATORIO DE PESAJE */}
                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 shadow-xs">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-800 flex-shrink-0">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
                  </div>
                  <div className="text-xs text-amber-900 space-y-1">
                    <div className="font-bold text-xs sm:text-sm flex flex-wrap items-center justify-between gap-1">
                      <span>🔔 Recordatorio de Registro (Cada 2 días)</span>
                    </div>
                    <p className="leading-relaxed text-amber-800 text-[11px] sm:text-xs">
                      Para evitar obsesiones con fluctuaciones diarias, te aconsejamos registrar tu peso <strong>cada 2 días</strong>.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-medium text-amber-950">
                      <span>☀️ En ayunas</span>
                      <span>🚽 Tras ir al baño</span>
                      <span>👕 Misma ropa</span>
                      <span>⚖️ Mismo pesapersonas</span>
                    </div>
                  </div>
                </div>

                {/* FORMULARIO DE REGISTRO */}
                <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xs border border-slate-100">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-emerald-600" />
                    <span>Registrar Pesaje y Sensaciones</span>
                  </h3>

                  <form onSubmit={handleAddLog} className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Peso Hoy en Ayunas (kg)</label>
                      <div className="relative max-w-xs">
                        <Scale className="w-5 h-5 text-emerald-700 absolute left-3.5 top-3.5" />
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="Ej: 64.5"
                          value={weighForm.weight}
                          onChange={(e) => setWeighForm({ ...weighForm, weight: e.target.value })}
                          className="w-full pl-11 pr-4 py-2.5 text-base sm:text-lg font-bold text-emerald-950 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-emerald-50/30"
                        />
                      </div>
                    </div>

                    {/* Métrica de Sensaciones Responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> Energía</span>
                          <span className="text-emerald-800 font-extrabold">{weighForm.energy}/5</span>
                        </label>
                        <input
                          type="range" min="1" max="5"
                          value={weighForm.energy}
                          onChange={(e) => setWeighForm({ ...weighForm, energy: e.target.value })}
                          className="w-full accent-emerald-700 h-1.5"
                        />
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1"><Smile className="w-3.5 h-3.5 text-emerald-600" /> Saciedad</span>
                          <span className="text-emerald-800 font-extrabold">{weighForm.satiety}/5</span>
                        </label>
                        <input
                          type="range" min="1" max="5"
                          value={weighForm.satiety}
                          onChange={(e) => setWeighForm({ ...weighForm, satiety: e.target.value })}
                          className="w-full accent-emerald-700 h-1.5"
                        />
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-indigo-500" /> Sueño</span>
                          <span className="text-emerald-800 font-extrabold">{weighForm.sleep}/5</span>
                        </label>
                        <input
                          type="range" min="1" max="5"
                          value={weighForm.sleep}
                          onChange={(e) => setWeighForm({ ...weighForm, sleep: e.target.value })}
                          className="w-full accent-emerald-700 h-1.5"
                        />
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-rose-500" /> Cumplimiento</span>
                          <span className="text-emerald-800 font-extrabold">{weighForm.adherence}%</span>
                        </label>
                        <input
                          type="range" min="0" max="100" step="10"
                          value={weighForm.adherence}
                          onChange={(e) => setWeighForm({ ...weighForm, adherence: e.target.value })}
                          className="w-full accent-emerald-700 h-1.5"
                        />
                      </div>
                    </div>

                    {/* MÓDULO CICLO MENSTRUAL */}
                    {currentPatient.sex === 'female_cycle' && (
                      <div className="p-4 sm:p-5 bg-pink-50/80 border border-pink-200 rounded-2xl space-y-3.5">
                        <div className="flex items-center space-x-2 text-pink-950 font-bold text-xs border-b border-pink-200/80 pb-2">
                          <Heart className="w-4 h-4 text-pink-600" />
                          <span>Seguimiento Hormonal y Regla</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-xl border border-pink-100">
                            <label className="block text-xs font-bold text-slate-700 mb-2">
                              ¿Estás con la regla hoy?
                            </label>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => setWeighForm({ ...weighForm, isPeriodActive: true, cycleStatus: 'menstruation' })}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${weighForm.isPeriodActive ? 'bg-pink-600 text-white border-pink-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                              >
                                Sí
                              </button>
                              <button
                                type="button"
                                onClick={() => setWeighForm({ ...weighForm, isPeriodActive: false })}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${!weighForm.isPeriodActive ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-pink-100">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Fase del ciclo aproximada
                            </label>
                            <select
                              value={weighForm.cycleStatus}
                              onChange={(e) => setWeighForm({ ...weighForm, cycleStatus: e.target.value })}
                              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium"
                            >
                              <option value="none">Normal / No identificada</option>
                              <option value="follicular">Fase Folicular (Post-regla)</option>
                              <option value="ovulation">Ovulación</option>
                              <option value="luteal">Fase Lútea (Pre-menstrual)</option>
                              <option value="menstruation">Menstruación</option>
                            </select>
                          </div>
                        </div>

                        {/* Síntomas */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">Síntomas presentes:</label>
                          <div className="flex flex-wrap gap-1.5">
                            {CYCLE_SYMPTOMS_OPTIONS.map(symptom => {
                              const active = weighForm.cycleSymptoms.includes(symptom);
                              return (
                                <button
                                  type="button"
                                  key={symptom}
                                  onClick={() => handleSymptomToggle(symptom)}
                                  className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${active ? 'bg-pink-700 text-white border-pink-700' : 'bg-white text-slate-600 border-pink-200 hover:bg-pink-100/50'}`}
                                >
                                  {active ? '✓ ' : '+ '}{symptom}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FOTO DE PROGRESO */}
                    <div className="p-3.5 sm:p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-emerald-700" />
                          <span>Foto de Progreso Corporal (Opcional)</span>
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <label className="cursor-pointer bg-white border border-slate-200 hover:border-emerald-500 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 transition flex items-center space-x-2">
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                          <span>{weighForm.photoUrl ? 'Cambiar Imagen' : 'Adjuntar Foto'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        {weighForm.photoUrl && (
                          <div className="relative">
                            <img
                              src={weighForm.photoUrl}
                              alt="Vista previa"
                              className="w-10 h-10 object-cover rounded-xl border border-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={() => setWeighForm({ ...weighForm, photoUrl: null })}
                              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 text-[9px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comentarios */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Comentarios para tu nutricionista</label>
                      <textarea
                        rows={2}
                        placeholder="Ej: Buena digestión, respeté las pautas..."
                        value={weighForm.notes}
                        onChange={(e) => setWeighForm({ ...weighForm, notes: e.target.value })}
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md"
                    >
                      Guardar Registro
                    </button>
                  </form>
                </div>

                {/* GRÁFICO PACIENTE */}
                {currentPatient.logs && currentPatient.logs.length > 0 && (
                  <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xs border border-slate-100">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-4">Tu Gráfico de Evolución</h3>
                    <div className="h-56 sm:h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[...currentPatient.logs].reverse()}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                          <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                          <Line type="monotone" dataKey="weight" stroke="#0B5D34" strokeWidth={3} dot={{ r: 4, fill: '#25B863' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. VISTA COMPLETA DEL NUTRICIONISTA */}
        {viewMode === 'admin_dashboard' && isAdminLoggedIn && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* SELECTOR DE PACIENTES RESPONSIVE */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xs border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              
              <div className="w-full md:w-auto">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 mb-1.5 inline-block">
                  Expediente Activo
                </span>
                
                <div className="flex items-center space-x-2 mt-0.5">
                  <User className="w-5 h-5 text-emerald-800 flex-shrink-0" />
                  <select
                    value={selectedAdminPatientId || ''}
                    onChange={(e) => setSelectedAdminPatientId(e.target.value)}
                    className="w-full sm:w-auto text-base sm:text-lg font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowNewPatientModal(true)}
                className="w-full md:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Alta Nuevo Paciente</span>
              </button>
            </div>

            {selectedAdminPatient ? (
              (() => {
                const metrics = getPatientMetrics(selectedAdminPatient);
                return (
                  <div className="space-y-4 sm:space-y-6">

                    {/* INDICADORES NUMÉRICOS */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                      <div className="bg-white p-3.5 sm:p-5 rounded-3xl shadow-xs border border-slate-100">
                        <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Media Semanal</div>
                        <div className="text-xl sm:text-3xl font-black text-emerald-900 mt-1">
                          {metrics.weeklyAvg ? `${metrics.weeklyAvg} kg` : '--'}
                        </div>
                      </div>

                      <div className="bg-white p-3.5 sm:p-5 rounded-3xl shadow-xs border border-slate-100">
                        <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Media Mensual</div>
                        <div className="text-xl sm:text-3xl font-black text-slate-800 mt-1">
                          {metrics.monthlyAvg ? `${metrics.monthlyAvg} kg` : '--'}
                        </div>
                      </div>

                      <div className="bg-white p-3.5 sm:p-5 rounded-3xl shadow-xs border border-slate-100">
                        <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Último Peso</div>
                        <div className="text-xl sm:text-3xl font-black text-emerald-950 mt-1">
                          {metrics.latestWeight ? `${metrics.latestWeight} kg` : '--'}
                        </div>
                      </div>

                      <div className="bg-white p-3.5 sm:p-5 rounded-3xl shadow-xs border border-slate-100">
                        <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Variación Total</div>
                        <div className={`text-xl sm:text-3xl font-black mt-1 ${metrics.totalChange <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {metrics.totalChange !== null ? `${metrics.totalChange > 0 ? '+' : ''}${metrics.totalChange} kg` : '--'}
                        </div>
                      </div>
                    </div>

                    {/* INTERPRETACIÓN CLÍNICA */}
                    <div className="bg-emerald-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg">
                      <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                        <BrainCircuit className="w-4 h-4 text-emerald-400" />
                        <span>Interpretación Nutricional</span>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium whitespace-pre-line bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-700/50">
                        {metrics.interpretation}
                      </p>
                    </div>

                    {/* GRÁFICO DE EVOLUCIÓN */}
                    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xs border border-slate-100">
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-4">Evolución de Peso</h3>
                      <div className="h-60 sm:h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[...selectedAdminPatient.logs].reverse()}>
                            <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0B5D34" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#0B5D34" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '16px', fontSize: '12px' }} />
                            {selectedAdminPatient.targetWeight > 0 && (
                              <ReferenceLine y={selectedAdminPatient.targetWeight} stroke="#10b981" strokeDasharray="3 3" />
                            )}
                            <Area type="monotone" dataKey="weight" stroke="#0B5D34" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" dot={{ r: 4, fill: '#25B863' }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* HISTORIAL Y DETALLE */}
                    <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
                      <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700 uppercase tracking-wider">
                        Historial de Registros ({selectedAdminPatient.logs.length})
                      </div>

                      {selectedAdminPatient.logs.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          Sin registros de pesaje grabados.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {selectedAdminPatient.logs.map((log) => (
                            <div key={log.id} className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-extrabold text-xs sm:text-sm text-slate-800">{log.date}</span>
                                  <span className="text-xs sm:text-sm font-black text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                    {log.weight} kg
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-[11px]">
                                  <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-semibold">⚡ {log.energy}/5</span>
                                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">🥗 {log.satiety}/5</span>
                                  <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md font-bold">🎯 {log.adherence}%</span>
                                </div>
                              </div>

                              {log.photoUrl && (
                                <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100 flex items-center space-x-3">
                                  <img
                                    src={log.photoUrl}
                                    alt="Foto progreso"
                                    className="w-12 h-12 object-cover rounded-lg border border-emerald-300 cursor-pointer"
                                    onClick={() => {
                                      const w = window.open("");
                                      if (w) w.document.write(`<img src="${log.photoUrl}" style="max-width:100%;" />`);
                                    }}
                                  />
                                  <span className="text-[11px] font-bold text-emerald-950">Foto de progreso adjunta (Haz clic para ver)</span>
                                </div>
                              )}

                              {log.notes && (
                                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                                  "{log.notes}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleDeletePatient(selectedAdminPatient.id, selectedAdminPatient.name)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar expediente</span>
                      </button>
                    </div>

                  </div>
                );
              })()
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs">
                No hay pacientes cargados.
              </div>
            )}

          </div>
        )}

        {/* MODAL ALTA PACIENTE */}
        {showNewPatientModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Alta de Nuevo Paciente</h3>

              <form onSubmit={handleCreatePatient} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text" required placeholder="Ej: Lucía Martínez"
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico (Login)</label>
                  <input
                    type="email" required placeholder="lucia@ejemplo.com"
                    value={newPatientData.email}
                    onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PIN Paciente (4 dígitos)</label>
                    <input
                      type="text" maxLength={4} required placeholder="1234"
                      value={newPatientData.pin}
                      onChange={(e) => setNewPatientData({ ...newPatientData, pin: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl font-bold tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Peso Objetivo (kg)</label>
                    <input
                      type="number" step="0.1" placeholder="Ej: 60.0"
                      value={newPatientData.targetWeight}
                      onChange={(e) => setNewPatientData({ ...newPatientData, targetWeight: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perfil Hormonal</label>
                  <select
                    value={newPatientData.sex}
                    onChange={(e) => setNewPatientData({ ...newPatientData, sex: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 font-medium"
                  >
                    <option value="female_cycle">Femenino (Con ciclo menstrual)</option>
                    <option value="female_no_cycle">Femenino (Sin ciclo)</option>
                    <option value="male">Masculino</option>
                  </select>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPatientModal(false)}
                    className="w-1/2 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-emerald-800 text-white font-bold rounded-xl text-xs hover:bg-emerald-900 transition shadow-md"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}