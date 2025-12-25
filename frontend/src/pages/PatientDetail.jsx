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
    Sparkles, Shield, Clock, Mail, Plus, Trash2, Activity, TrendingUp,
    DollarSign, CreditCard, Wallet, Banknote
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
    const [visits, setVisits] = useState([]);
    const [showVisitModal, setShowVisitModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [visitFormData, setVisitFormData] = useState({
        visitDate: new Date().toISOString().split('T')[0],
        notes: '',
        diagnosis: '',
        protocol: '',
        symptoms: '',
        payment: {
            doctorFees: '',
            status: 'Unpaid',
            method: 'Not Paid',
            transactionId: '',
        },
    });
    const [paymentFormData, setPaymentFormData] = useState({
        doctorFees: '',
        status: 'Unpaid',
        method: 'Not Paid',
        transactionId: '',
    });

    useEffect(() => {
        fetchPatient();
    }, [id]);

    const fetchPatient = async () => {
        try {
            const response = await api.get(`/patients/${id}`);
            setPatient(response.data);
            setFormData(response.data);
            setVisits(response.data.visits || []);
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

    // Calculate gap between visits
    const calculateGap = (date1, date2) => {
        const diff = Math.abs(new Date(date1) - new Date(date2));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Same day';
        if (days === 1) return '1 day';
        if (days < 7) return `${days} days`;
        if (days < 30) {
            const weeks = Math.floor(days / 7);
            return weeks === 1 ? '1 week' : `${weeks} weeks`;
        }
        if (days < 365) {
            const months = Math.floor(days / 30);
            return months === 1 ? '1 month' : `${months} months`;
        }
        const years = Math.floor(days / 365);
        return years === 1 ? '1 year' : `${years} years`;
    };

    const handleVisitFormChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('payment.')) {
            const paymentField = name.split('.')[1];
            setVisitFormData((prev) => ({
                ...prev,
                payment: {
                    ...prev.payment,
                    [paymentField]: value,
                },
            }));
        } else {
            setVisitFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handlePaymentFormChange = (e) => {
        const { name, value } = e.target;
        setPaymentFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddVisit = async () => {
        try {
            setSaving(true);
            await api.post(`/patients/${id}/visits`, visitFormData);
            await fetchPatient(); // Refresh patient data
            setShowVisitModal(false);
            setVisitFormData({
                visitDate: new Date().toISOString().split('T')[0],
                notes: '',
                diagnosis: '',
                protocol: '',
                symptoms: '',
                payment: {
                    doctorFees: '',
                    status: 'Unpaid',
                    method: 'Not Paid',
                    transactionId: '',
                },
            });
        } catch (error) {
            console.error('Error adding visit:', error);
            alert('Failed to add visit');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteVisit = async (visitId) => {
        if (!window.confirm('Are you sure you want to delete this visit?')) return;

        try {
            await api.delete(`/patients/${id}/visits/${visitId}`);
            await fetchPatient(); // Refresh patient data
        } catch (error) {
            console.error('Error deleting visit:', error);
            alert('Failed to delete visit');
        }
    };

    const handleOpenPaymentModal = (visit) => {
        setSelectedVisit(visit);
        setPaymentFormData({
            doctorFees: visit.payment?.doctorFees || '',
            status: visit.payment?.status || 'Unpaid',
            method: visit.payment?.method || 'Not Paid',
            transactionId: visit.payment?.transactionId || '',
        });
        setShowPaymentModal(true);
    };

    const handleUpdatePayment = async () => {
        if (!selectedVisit) return;

        try {
            setSaving(true);
            await api.put(`/patients/${id}/visits/${selectedVisit._id}/payment`, paymentFormData);
            await fetchPatient(); // Refresh patient data
            setShowPaymentModal(false);
            setSelectedVisit(null);
        } catch (error) {
            console.error('Error updating payment:', error);
            alert('Failed to update payment');
        } finally {
            setSaving(false);
        }
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

            {/* Visit History Section */}
            <Card className="glass-card border-0 hover-lift transition-smooth">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600" />
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600" />
                                Visit History
                            </CardTitle>
                        </div>
                        <Button
                            onClick={() => setShowVisitModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-lg hover-lift transition-smooth"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Visit
                        </Button>
                    </div>
                    <CardDescription>
                        Track patient revisits and monitor treatment progress
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {visits.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                                <Activity className="h-10 w-10 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Visits Recorded</h3>
                            <p className="text-slate-600 mb-4">Start tracking patient visits to monitor treatment progress</p>
                            <Button
                                onClick={() => setShowVisitModal(true)}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Visit
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Visit Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="glass-card rounded-xl p-4 border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                                            <Activity className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Total Visits</p>
                                            <p className="text-2xl font-bold text-slate-700">{visits.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-card rounded-xl p-4 border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-600 to-teal-600">
                                            <Calendar className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">First Visit</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {new Date(patient.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-card rounded-xl p-4 border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                                            <TrendingUp className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Latest Visit</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {visits.length > 0 ? new Date(visits[0].visitDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />

                                <div className="space-y-6">
                                    {[...visits].sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate)).map((visit, index, sortedVisits) => {
                                        const previousVisit = sortedVisits[index + 1];
                                        const gap = previousVisit ? calculateGap(visit.visitDate, previousVisit.visitDate) : null;

                                        return (
                                            <div key={visit._id} className="relative pl-16">
                                                {/* Timeline dot */}
                                                <div className="absolute left-3.5 top-6 w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-4 border-white shadow-lg z-10" />

                                                {/* Gap indicator */}
                                                {gap && (
                                                    <div className="absolute left-14 -top-3 px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 z-20">
                                                        <p className="text-xs font-semibold text-orange-700 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {gap} gap
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Visit card */}
                                                <div className="glass-card rounded-xl p-5 hover-lift transition-smooth border-blue-200">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                                                                <Calendar className="h-4 w-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-700">
                                                                    Visit #{visits.length - index}
                                                                </p>
                                                                <p className="text-sm text-slate-600">
                                                                    {new Date(visit.visitDate).toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleDeleteVisit(visit._id)}
                                                            className="glass hover:bg-red-50 hover:border-red-300 transition-smooth"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {/* Payment Information */}
                                                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-3 border border-green-200">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <Label className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                                                                    <DollarSign className="h-3 w-3" />
                                                                    Payment Information
                                                                </Label>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleOpenPaymentModal(visit)}
                                                                    className="h-7 text-xs glass hover-lift transition-smooth"
                                                                >
                                                                    <Edit className="h-3 w-3 mr-1" />
                                                                    Update
                                                                </Button>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <p className="text-xs text-slate-500">Doctor Fees</p>
                                                                    <p className="text-sm font-semibold text-slate-700">
                                                                        ₹{visit.payment?.doctorFees || 0}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-slate-500">Status</p>
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${visit.payment?.status === 'Paid'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-red-100 text-red-700'
                                                                        }`}>
                                                                        {visit.payment?.status === 'Paid' ? (
                                                                            <CheckCircle className="h-3 w-3" />
                                                                        ) : (
                                                                            <XCircle className="h-3 w-3" />
                                                                        )}
                                                                        {visit.payment?.status || 'Unpaid'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-slate-500">Method</p>
                                                                    <p className="text-sm font-semibold text-slate-700">
                                                                        {visit.payment?.method || 'Not Paid'}
                                                                    </p>
                                                                </div>
                                                                {visit.payment?.paidDate && (
                                                                    <div>
                                                                        <p className="text-xs text-slate-500">Paid Date</p>
                                                                        <p className="text-sm font-semibold text-slate-700">
                                                                            {new Date(visit.payment.paidDate).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {visit.symptoms && (
                                                            <div>
                                                                <Label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                                                    <Activity className="h-3 w-3" />
                                                                    {index === visits.length - 1 ? 'Case Taking / Initial Symptoms' : 'Symptoms'}
                                                                </Label>
                                                                <p className="text-sm text-slate-700 bg-white/50 rounded-lg p-2">
                                                                    {visit.symptoms}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {visit.diagnosis && (
                                                            <div>
                                                                <Label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                                                    <Stethoscope className="h-3 w-3" />
                                                                    Diagnosis
                                                                </Label>
                                                                <p className="text-sm text-slate-700 bg-white/50 rounded-lg p-2">
                                                                    {visit.diagnosis}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {visit.protocol && (
                                                            <div>
                                                                <Label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                                                    <ClipboardList className="h-3 w-3" />
                                                                    Treatment Protocol
                                                                </Label>
                                                                <p className="text-sm text-slate-700 bg-white/50 rounded-lg p-2">
                                                                    {visit.protocol}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {visit.notes && (
                                                            <div>
                                                                <Label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                                                    <FileText className="h-3 w-3" />
                                                                    Notes
                                                                </Label>
                                                                <p className="text-sm text-slate-700 bg-white/50 rounded-lg p-2">
                                                                    {visit.notes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Visit Modal */}
            {showVisitModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 glass-card rounded-t-2xl p-6 border-b border-white/20 z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                                        <Plus className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                            Add New Visit
                                        </h2>
                                        <p className="text-sm text-slate-600">Record a new patient visit</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowVisitModal(false)}
                                    className="glass hover-lift transition-smooth"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Visit Date */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    Visit Date
                                </Label>
                                <Input
                                    type="date"
                                    name="visitDate"
                                    value={visitFormData.visitDate}
                                    onChange={handleVisitFormChange}
                                    className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 h-11"
                                />
                            </div>

                            {/* Symptoms */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <Activity className="h-4 w-4 text-blue-600" />
                                    Symptoms
                                </Label>
                                <Textarea
                                    name="symptoms"
                                    value={visitFormData.symptoms}
                                    onChange={handleVisitFormChange}
                                    rows={3}
                                    placeholder="Describe patient symptoms..."
                                    className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                />
                            </div>

                            {/* Diagnosis */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <Stethoscope className="h-4 w-4 text-blue-600" />
                                    Diagnosis
                                </Label>
                                <Textarea
                                    name="diagnosis"
                                    value={visitFormData.diagnosis}
                                    onChange={handleVisitFormChange}
                                    rows={3}
                                    placeholder="Enter diagnosis..."
                                    className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                />
                            </div>

                            {/* Treatment Protocol */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <ClipboardList className="h-4 w-4 text-blue-600" />
                                    Treatment Protocol
                                </Label>
                                <Textarea
                                    name="protocol"
                                    value={visitFormData.protocol}
                                    onChange={handleVisitFormChange}
                                    rows={3}
                                    placeholder="Enter treatment protocol..."
                                    className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                />
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    Additional Notes
                                </Label>
                                <Textarea
                                    name="notes"
                                    value={visitFormData.notes}
                                    onChange={handleVisitFormChange}
                                    rows={3}
                                    placeholder="Any additional notes..."
                                    className="glass border-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                />
                            </div>

                            {/* Payment Information Section */}
                            <div className="border-t border-white/20 pt-6 mt-6">
                                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    Payment Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Doctor Fees */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-medium flex items-center gap-1">
                                            <Banknote className="h-4 w-4 text-green-600" />
                                            Doctor Fees (₹)
                                        </Label>
                                        <Input
                                            type="number"
                                            name="payment.doctorFees"
                                            value={visitFormData.payment.doctorFees}
                                            onChange={handleVisitFormChange}
                                            placeholder="Enter amount"
                                            className="glass border-white/40 focus:border-green-400 focus:ring-green-400 h-11"
                                        />
                                    </div>

                                    {/* Payment Status */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-medium flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Payment Status
                                        </Label>
                                        <select
                                            name="payment.status"
                                            value={visitFormData.payment.status}
                                            onChange={handleVisitFormChange}
                                            className="flex h-11 w-full rounded-lg glass border-white/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                                        >
                                            <option value="Unpaid">Unpaid</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-medium flex items-center gap-1">
                                            <CreditCard className="h-4 w-4 text-green-600" />
                                            Payment Method
                                        </Label>
                                        <select
                                            name="payment.method"
                                            value={visitFormData.payment.method}
                                            onChange={handleVisitFormChange}
                                            className="flex h-11 w-full rounded-lg glass border-white/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                                        >
                                            <option value="Not Paid">Not Paid</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Card">Card</option>
                                            <option value="Cash">Cash</option>
                                        </select>
                                    </div>

                                    {/* Transaction ID */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-medium flex items-center gap-1">
                                            <Wallet className="h-4 w-4 text-green-600" />
                                            Transaction ID (Optional)
                                        </Label>
                                        <Input
                                            type="text"
                                            name="payment.transactionId"
                                            value={visitFormData.payment.transactionId}
                                            onChange={handleVisitFormChange}
                                            placeholder="Enter transaction ID"
                                            className="glass border-white/40 focus:border-green-400 focus:ring-green-400 h-11"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 glass-card rounded-b-2xl p-6 border-t border-white/20 flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowVisitModal(false)}
                                className="glass hover-lift transition-smooth"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddVisit}
                                disabled={saving}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-lg hover-lift transition-smooth"
                            >
                                {saving ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Visit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Update Modal */}
            {showPaymentModal && selectedVisit && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card rounded-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-white/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-600 to-teal-600">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                            Update Payment
                                        </h2>
                                        <p className="text-sm text-slate-600">Update payment information for this visit</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="glass hover-lift transition-smooth"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Doctor Fees */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <Banknote className="h-4 w-4 text-green-600" />
                                    Doctor Fees (₹)
                                </Label>
                                <Input
                                    type="number"
                                    name="doctorFees"
                                    value={paymentFormData.doctorFees}
                                    onChange={handlePaymentFormChange}
                                    placeholder="Enter amount"
                                    className="glass border-white/40 focus:border-green-400 focus:ring-green-400 h-11"
                                />
                            </div>

                            {/* Payment Status */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Payment Status
                                </Label>
                                <select
                                    name="status"
                                    value={paymentFormData.status}
                                    onChange={handlePaymentFormChange}
                                    className="flex h-11 w-full rounded-lg glass border-white/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                                >
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <CreditCard className="h-4 w-4 text-green-600" />
                                    Payment Method
                                </Label>
                                <select
                                    name="method"
                                    value={paymentFormData.method}
                                    onChange={handlePaymentFormChange}
                                    className="flex h-11 w-full rounded-lg glass border-white/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                                >
                                    <option value="Not Paid">Not Paid</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Card">Card</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>

                            {/* Transaction ID */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-1">
                                    <Wallet className="h-4 w-4 text-green-600" />
                                    Transaction ID (Optional)
                                </Label>
                                <Input
                                    type="text"
                                    name="transactionId"
                                    value={paymentFormData.transactionId}
                                    onChange={handlePaymentFormChange}
                                    placeholder="Enter transaction ID"
                                    className="glass border-white/40 focus:border-green-400 focus:ring-green-400 h-11"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/20 flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowPaymentModal(false)}
                                className="glass hover-lift transition-smooth"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdatePayment}
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
                                        Update Payment
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDetail;
