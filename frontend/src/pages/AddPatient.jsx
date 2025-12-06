import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import api from '../lib/api';
import { UserPlus, User, Phone, Calendar, MapPin, FileText, Stethoscope, ClipboardList, CheckCircle, XCircle, Sparkles } from 'lucide-react';

const AddPatient = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl glass-card p-6 hover-lift transition-smooth">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-emerald-500/10" />
                <div className="relative flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 shadow-lg">
                        <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            Add New Patient
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
