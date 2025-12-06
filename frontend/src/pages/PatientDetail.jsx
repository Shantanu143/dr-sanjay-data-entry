import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import api from '../lib/api';
import {
    ArrowLeft, Edit, Save, X, User, Phone, Calendar, MapPin,
    FileText, Stethoscope, ClipboardList, CheckCircle, XCircle,
    Sparkles, Shield, Clock, Mail
} from 'lucide-react';

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(searchParams.get('edit') === 'true');
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchPatient();
    }, [id]);

    const fetchPatient = async () => {
        try {
            const response = await api.get(`/patients/${id}`);
            setPatient(response.data);
            setFormData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patient:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/patients/${id}`, {
                ...formData,
                age: parseInt(formData.age),
            });
            setPatient(formData);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Failed to update patient');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(patient);
        setEditMode(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                        <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-purple-400/20" />
                    </div>
                    <div className="text-sm font-medium text-slate-600">Loading patient details...</div>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="space-y-6">
                <Card className="glass-card border-0 max-w-md mx-auto mt-20">
                    <CardContent className="pt-6 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center">
                            <XCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-slate-700">Patient Not Found</h2>
                        <p className="text-slate-600 mb-6">The patient you're looking for doesn't exist.</p>
                        <Button
                            onClick={() => navigate('/manage-patients')}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Patients
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl glass-card p-6 hover-lift transition-smooth">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/manage-patients')}
                            className="glass hover-lift transition-smooth"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {patient.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {editMode ? 'Edit Patient' : 'Patient Details'}
                                </h1>
                                <p className="text-sm text-slate-600 flex items-center gap-1">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                    {editMode ? 'Update patient information' : 'View patient information'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {editMode ? (
                            <>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-0 shadow-lg hover-lift transition-smooth"
                                >
                                    {saving ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="glass hover-lift transition-smooth"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setEditMode(true)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg hover-lift transition-smooth"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Patient
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Patient Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card className="glass-card border-0 hover-lift transition-smooth">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Patient ID</p>
                                    <p className="font-mono text-sm font-semibold text-slate-700">{patient._id.slice(-8)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-green-600 to-teal-600">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Registered On</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {new Date(patient.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${patient.consent ? 'bg-gradient-to-br from-green-600 to-teal-600' : 'bg-gradient-to-br from-red-600 to-pink-600'}`}>
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Consent Status</p>
                                    <p className={`text-sm font-semibold ${patient.consent ? 'text-green-600' : 'text-red-600'}`}>
                                        {patient.consent ? '✓ Consent Given' : '✗ No Consent'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Details */}
                <Card className="glass-card border-0 hover-lift transition-smooth lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                            <CardTitle>Personal Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <User className="h-4 w-4 text-purple-600" />
                                    Full Name
                                </Label>
                                {editMode ? (
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="glass border-white/40 focus:border-purple-400 focus:ring-purple-400 h-11"
                                    />
                                ) : (
                                    <div className="glass-card rounded-lg p-3">
                                        <p className="text-lg font-semibold text-slate-700">{patient.name}</p>
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <Phone className="h-4 w-4 text-purple-600" />
                                    Phone Number
                                </Label>
                                {editMode ? (
                                    <Input
                                        name="phoneNo"
                                        value={formData.phoneNo}
                                        onChange={handleChange}
                                        className="glass border-white/40 focus:border-purple-400 focus:ring-purple-400 h-11"
                                    />
                                ) : (
                                    <div className="glass-card rounded-lg p-3">
                                        <p className="text-lg font-semibold text-slate-700">{patient.phoneNo}</p>
                                    </div>
                                )}
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                    Age
                                </Label>
                                {editMode ? (
                                    <Input
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="glass border-white/40 focus:border-purple-400 focus:ring-purple-400 h-11"
                                    />
                                ) : (
                                    <div className="glass-card rounded-lg p-3">
                                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                                            {patient.age} years
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Gender</Label>
                                {editMode ? (
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="flex h-11 w-full rounded-lg glass border-white/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : (
                                    <div className="glass-card rounded-lg p-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${patient.gender === 'Male'
                                                ? 'bg-blue-100 text-blue-700'
                                                : patient.gender === 'Female'
                                                    ? 'bg-pink-100 text-pink-700'
                                                    : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            {patient.gender}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-purple-600" />
                                    Address
                                </Label>
                                {editMode ? (
                                    <Input
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        className="glass border-white/40 focus:border-purple-400 focus:ring-purple-400 h-11"
                                    />
                                ) : (
                                    <div className="glass-card rounded-lg p-3">
                                        <p className="text-slate-700">{patient.address || 'Not provided'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Medical Information */}
            <Card className="glass-card border-0 hover-lift transition-smooth">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600" />
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-teal-600" />
                            Medical Information
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Case Taking */}
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium flex items-center gap-1">
                                <FileText className="h-4 w-4 text-teal-600" />
                                Case Taking
                            </Label>
                            {editMode ? (
                                <Textarea
                                    name="caseTaking"
                                    value={formData.caseTaking || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    className="glass border-white/40 focus:border-teal-400 focus:ring-teal-400 resize-none"
                                />
                            ) : (
                                <div className="glass-card rounded-lg p-4">
                                    <p className="text-slate-700 whitespace-pre-wrap">
                                        {patient.caseTaking || 'Not provided'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Diagnosis */}
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium flex items-center gap-1">
                                <Stethoscope className="h-4 w-4 text-teal-600" />
                                Diagnosis
                            </Label>
                            {editMode ? (
                                <Textarea
                                    name="diagnosis"
                                    value={formData.diagnosis || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    className="glass border-white/40 focus:border-teal-400 focus:ring-teal-400 resize-none"
                                />
                            ) : (
                                <div className="glass-card rounded-lg p-4">
                                    <p className="text-slate-700 whitespace-pre-wrap">
                                        {patient.diagnosis || 'Not provided'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Protocol */}
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium flex items-center gap-1">
                                <ClipboardList className="h-4 w-4 text-teal-600" />
                                Treatment Protocol
                            </Label>
                            {editMode ? (
                                <Textarea
                                    name="protocol"
                                    value={formData.protocol || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    className="glass border-white/40 focus:border-teal-400 focus:ring-teal-400 resize-none"
                                />
                            ) : (
                                <div className="glass-card rounded-lg p-4">
                                    <p className="text-slate-700 whitespace-pre-wrap">
                                        {patient.protocol || 'Not provided'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Consent in Edit Mode */}
                        {editMode && (
                            <div className="glass-card rounded-xl p-4 border-teal-200">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        id="consent"
                                        name="consent"
                                        checked={formData.consent}
                                        onChange={handleChange}
                                        className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500 mt-0.5"
                                    />
                                    <Label htmlFor="consent" className="cursor-pointer text-sm text-slate-700 leading-relaxed">
                                        Patient has given informed consent for treatment
                                    </Label>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PatientDetail;
