import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import api from '../lib/api';
import {
    UserPlus, User, Phone, Calendar, MapPin, FileText, Stethoscope,
    ClipboardList, CheckCircle, XCircle, Sparkles, ArrowLeft, Activity,
    Users, RefreshCw, Search
} from 'lucide-react';

const AddPatient = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState(null); // null, 'new', or 'revisit'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNo: '',
        age: '',
        gender: 'Male',
        caseTaking: '',
        diagnosis: '',
        protocol: '',
        consent: false,
    });

    const [visitData, setVisitData] = useState({
        visitDate: new Date().toISOString().split('T')[0],
        symptoms: '',
        diagnosis: '',
        protocol: '',
        notes: '',
    });


    useEffect(() => {
        if (mode === 'revisit') {
            fetchPatients();
        }
    }, [mode]);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients?limit=1000');
            setPatients(response.data.patients || []);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleVisitChange = (e) => {
        const { name, value } = e.target;
        setVisitData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await api.post('/patients', {
                ...formData,
                age: parseInt(formData.age),
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/manage-patients');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add patient');
        } finally {
            setLoading(false);
        }
    };

    const handleRevisitSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) {
            setError('Please select a patient');
            return;
        }

        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await api.post(`/patients/${selectedPatient._id}/visits`, visitData);
            setSuccess(true);
            setTimeout(() => {
                navigate(`/patient/${selectedPatient._id}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add visit');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phoneNo.includes(searchQuery)
    );

    // Mode Selection Screen
    if (!mode) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl glass-card p-6 hover-lift transition-smooth">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
                    <div className="relative flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                            <UserPlus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Patient Management
                            </h1>
                            <p className="text-sm md:text-base text-slate-600 flex items-center gap-1">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                Choose an option to continue
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mode Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Register New Patient */}
                    <Card
                        className="glass-card border-0 hover-lift transition-smooth cursor-pointer group"
                        onClick={() => setMode('new')}
                    >
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <UserPlus className="h-10 w-10 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">Register New Patient</h3>
                                    <p className="text-sm text-slate-600">
                                        Add a new patient to the system with their initial consultation details
                                    </p>
                                </div>
                                <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-0 shadow-lg">
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    New Patient
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Record Revisit */}
                    <Card
                        className="glass-card border-0 hover-lift transition-smooth cursor-pointer group"
                        onClick={() => setMode('revisit')}
                    >
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <RefreshCw className="h-10 w-10 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">Record Revisit</h3>
                                    <p className="text-sm text-slate-600">
                                        Add a follow-up visit for an existing patient
                                    </p>
                                </div>
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-lg">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Patient Revisit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Revisit Mode - Patient Selection and Visit Form
    if (mode === 'revisit') {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl glass-card p-6 hover-lift transition-smooth">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10" />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setMode(null)}
                                className="glass hover-lift transition-smooth"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                                <RefreshCw className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Record Patient Revisit
                                </h1>
                                <p className="text-sm md:text-base text-slate-600 flex items-center gap-1">
                                    <Sparkles className="h-4 w-4 text-blue-500" />
                                    {selectedPatient ? `Adding visit for ${selectedPatient.name}` : 'Select a patient to continue'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {!selectedPatient ? (
                    /* Patient Selection */
                    <Card className="glass-card border-0 hover-lift transition-smooth">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600" />
                                <CardTitle>Select Patient</CardTitle>
                            </div>
                            <CardDescription>Search and select the patient for this visit</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name or phone number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 glass border-white/40 focus:border-blue-400 focus:ring-blue-400 h-12"
                                />
                            </div>

                            {/* Patient List */}
                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {filteredPatients.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                                        <p className="text-slate-600">No patients found</p>
                                    </div>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <div
                                            key={patient._id}
                                            onClick={() => setSelectedPatient(patient)}
                                            className="glass-card rounded-xl p-4 hover:bg-blue-50 cursor-pointer transition-all hover-lift border-blue-200"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                                                        {patient.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-700">{patient.name}</p>
                                                        <p className="text-sm text-slate-600">{patient.phoneNo}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">Age: {patient.age}</p>
                                                    <p className="text-xs text-slate-500">{patient.gender}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Visit Form */
                    <Card className="glass-card border-0 hover-lift transition-smooth">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600" />
                                    <CardTitle>Visit Details</CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPatient(null)}
                                    className="glass"
                                >
                                    Change Patient
                                </Button>
                            </div>
                            <CardDescription>Record visit information for {selectedPatient.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleRevisitSubmit} className="space-y-6">
                                {/* Visit Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="visitDate" className="text-slate-700 font-medium flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        Visit Date *
                                    </Label>
                                    <Input
                                        id="visitDate"
                                        name="visitDate"
                                        type="date"
                                        value={visitData.visitDate}
                                        onChange={handleVisitChange}
                                        required
                                        className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 h-11"
                                    />
                                </div>

                                {/* Symptoms */}
                                <div className="space-y-2">
                                    <Label htmlFor="symptoms" className="text-slate-700 font-medium flex items-center gap-1">
                                        <Activity className="h-4 w-4 text-blue-600" />
                                        Symptoms
                                    </Label>
                                    <Textarea
                                        id="symptoms"
                                        name="symptoms"
                                        value={visitData.symptoms}
                                        onChange={handleVisitChange}
                                        placeholder="Describe patient symptoms..."
                                        rows={4}
                                        className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                    />
                                </div>

                                {/* Diagnosis */}
                                <div className="space-y-2">
                                    <Label htmlFor="diagnosis" className="text-slate-700 font-medium flex items-center gap-1">
                                        <Stethoscope className="h-4 w-4 text-blue-600" />
                                        Diagnosis
                                    </Label>
                                    <Textarea
                                        id="diagnosis"
                                        name="diagnosis"
                                        value={visitData.diagnosis}
                                        onChange={handleVisitChange}
                                        placeholder="Enter diagnosis..."
                                        rows={4}
                                        className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                    />
                                </div>

                                {/* Treatment Protocol */}
                                <div className="space-y-2">
                                    <Label htmlFor="protocol" className="text-slate-700 font-medium flex items-center gap-1">
                                        <ClipboardList className="h-4 w-4 text-blue-600" />
                                        Treatment Protocol
                                    </Label>
                                    <Textarea
                                        id="protocol"
                                        name="protocol"
                                        value={visitData.protocol}
                                        onChange={handleVisitChange}
                                        placeholder="Enter treatment protocol..."
                                        rows={4}
                                        className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                    />
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-slate-700 font-medium flex items-center gap-1">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        Additional Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        value={visitData.notes}
                                        onChange={handleVisitChange}
                                        placeholder="Any additional notes..."
                                        rows={3}
                                        className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="rounded-xl glass-card border-red-200 p-4 animate-in slide-in-from-top">
                                        <div className="flex items-center gap-3">
                                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Success Message */}
                                {success && (
                                    <div className="rounded-xl glass-card border-green-200 p-4 animate-in slide-in-from-top">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            <p className="text-sm text-green-600 font-medium">
                                                Visit recorded successfully! Redirecting...
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover-lift transition-smooth border-0"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                <span>Recording Visit...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5" />
                                                <span>Record Visit</span>
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSelectedPatient(null)}
                                        className="flex-1 h-12 glass hover-lift transition-smooth"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    }

    // New Patient Mode - Registration Form
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl glass-card p-6 hover-lift transition-smooth">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-emerald-500/10" />
                <div className="relative flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setMode(null)}
                        className="glass hover-lift transition-smooth"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 shadow-lg">
                        <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            Register New Patient
                        </h1>
                        <p className="text-sm md:text-base text-slate-600 flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-green-500" />
                            Fill out the patient information form
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <Card className="glass-card border-0 hover-lift transition-smooth">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-600 to-teal-600" />
                        <CardTitle>Patient Information</CardTitle>
                    </div>
                    <CardDescription>Enter all required patient details below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                                <User className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold text-slate-700">Personal Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-700 font-medium flex items-center gap-1">
                                        <User className="h-4 w-4 text-green-600" />
                                        Full Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter patient's full name"
                                        className="glass border-white/40 focus:border-green-400 focus:ring-green-400 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phoneNo" className="text-slate-700 font-medium flex items-center gap-1">
                                        <Phone className="h-4 w-4 text-green-600" />
                                        Phone Number *
                                    </Label>
                                    <Input
                                        id="phoneNo"
                                        name="phoneNo"
                                        value={formData.phoneNo}
                                        onChange={handleChange}
                                        required
                                        placeholder="Contact number"
                                        className="glass border-white/40 focus:border-green-400 focus:ring-green-400 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age" className="text-slate-700 font-medium flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                        Age *
                                    </Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="0"
                                        max="150"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                        placeholder="Patient age"
                                        className="glass border-white/40 focus:border-green-400 focus:ring-green-400 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender" className="text-slate-700 font-medium">
                                        Gender *
                                    </Label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className="flex h-11 w-full rounded-lg glass border-white/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-slate-700 font-medium flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-green-600" />
                                    Address
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Patient's residential address"
                                    className="glass border-white/40 focus:border-green-400 focus:ring-green-400 h-11"
                                />
                            </div>
                        </div>

                        {/* Medical Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                                <Stethoscope className="h-5 w-5 text-teal-600" />
                                <h3 className="font-semibold text-slate-700">Medical Information</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="caseTaking" className="text-slate-700 font-medium flex items-center gap-1">
                                    <FileText className="h-4 w-4 text-teal-600" />
                                    Case Taking
                                </Label>
                                <Textarea
                                    id="caseTaking"
                                    name="caseTaking"
                                    value={formData.caseTaking}
                                    onChange={handleChange}
                                    placeholder="Enter detailed case history and patient complaints"
                                    rows={4}
                                    className="glass border-white/40 focus:border-teal-400 focus:ring-teal-400 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="diagnosis" className="text-slate-700 font-medium flex items-center gap-1">
                                    <Stethoscope className="h-4 w-4 text-teal-600" />
                                    Diagnosis
                                </Label>
                                <Textarea
                                    id="diagnosis"
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    placeholder="Medical diagnosis and findings"
                                    rows={4}
                                    className="glass border-white/40 focus:border-teal-400 focus:ring-teal-400 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="protocol" className="text-slate-700 font-medium flex items-center gap-1">
                                    <ClipboardList className="h-4 w-4 text-teal-600" />
                                    Treatment Protocol
                                </Label>
                                <Textarea
                                    id="protocol"
                                    name="protocol"
                                    value={formData.protocol}
                                    onChange={handleChange}
                                    placeholder="Recommended treatment plan and protocols"
                                    rows={4}
                                    className="glass border-white/40 focus:border-teal-400 focus:ring-teal-400 resize-none"
                                />
                            </div>
                        </div>

                        {/* Consent Section */}
                        <div className="glass-card rounded-xl p-4 border-green-200">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleChange}
                                    required
                                    className="h-5 w-5 rounded border-green-300 text-green-600 focus:ring-green-500 mt-0.5"
                                />
                                <Label htmlFor="consent" className="cursor-pointer text-sm text-slate-700 leading-relaxed">
                                    I confirm that the patient has given informed consent for treatment and data processing *
                                </Label>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-xl glass-card border-red-200 p-4 animate-in slide-in-from-top">
                                <div className="flex items-center gap-3">
                                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="rounded-xl glass-card border-green-200 p-4 animate-in slide-in-from-top">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <p className="text-sm text-green-600 font-medium">
                                        Patient added successfully! Redirecting...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold shadow-lg hover-lift transition-smooth border-0"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Adding Patient...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="h-5 w-5" />
                                        <span>Add Patient</span>
                                    </div>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/manage-patients')}
                                className="flex-1 h-12 glass hover-lift transition-smooth"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddPatient;
