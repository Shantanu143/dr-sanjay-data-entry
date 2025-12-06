import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import api from '../lib/api';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Users, UserPlus } from 'lucide-react';

const ManagePatients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchPatients();
    }, [currentPage]);

    const fetchPatients = async () => {
        try {
            const response = await api.get(`/patients?page=${currentPage}&limit=10`);
            setPatients(response.data.patients);
            setTotalPages(response.data.totalPages);
            setTotal(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await api.delete(`/patients/${id}`);
                fetchPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
                alert('Failed to delete patient');
            }
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
                    <div className="text-sm font-medium text-slate-600">Loading patients...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl glass-card p-6 hover-lift transition-smooth">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10" />
                <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Manage Patients
                            </h1>
                            <p className="text-sm md:text-base text-slate-600">View, edit, and manage patient records</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate('/add-patient')}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-lg hover-lift transition-smooth"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add New Patient
                    </Button>
                </div>
            </div>

            {/* Patient List Card */}
            <Card className="glass-card border-0 hover-lift transition-smooth">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600" />
                        <CardTitle>Patient List</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Total patients: <span className="font-semibold text-blue-600">{total}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {patients.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                                <Users className="h-10 w-10 text-blue-600" />
                            </div>
                            <p className="text-slate-600 font-medium">No patients found</p>
                            <p className="text-sm text-slate-500 mt-1">Add your first patient to get started.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-xl">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-200 hover:bg-slate-50/50">
                                            <TableHead className="font-semibold text-slate-700">Name</TableHead>
                                            <TableHead className="hidden sm:table-cell font-semibold text-slate-700">Phone</TableHead>
                                            <TableHead className="hidden md:table-cell font-semibold text-slate-700">Age</TableHead>
                                            <TableHead className="hidden md:table-cell font-semibold text-slate-700">Gender</TableHead>
                                            <TableHead className="hidden lg:table-cell font-semibold text-slate-700">Date Added</TableHead>
                                            <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {patients.map((patient, index) => (
                                            <TableRow
                                                key={patient._id}
                                                className="border-slate-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold shadow-lg">
                                                            {patient.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-700">{patient.name}</div>
                                                            <div className="text-xs text-slate-500 sm:hidden">
                                                                {patient.phoneNo}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-slate-600">{patient.phoneNo}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                        {patient.age} yrs
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.gender === 'Male'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : patient.gender === 'Female'
                                                                ? 'bg-pink-100 text-pink-700'
                                                                : 'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {patient.gender}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell text-slate-600">
                                                    {new Date(patient.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/patient/${patient._id}`)}
                                                            title="View Details"
                                                            className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/patient/${patient._id}?edit=true`)}
                                                            title="Edit"
                                                            className="hover:bg-green-100 hover:text-green-600 transition-colors"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(patient._id)}
                                                            title="Delete"
                                                            className="hover:bg-red-100 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200">
                                <div className="text-sm text-slate-600 font-medium">
                                    Page <span className="text-blue-600 font-bold">{currentPage}</span> of <span className="text-blue-600 font-bold">{totalPages}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="glass hover-lift transition-smooth disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline ml-1">Previous</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="glass hover-lift transition-smooth disabled:opacity-50"
                                    >
                                        <span className="hidden sm:inline mr-1">Next</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ManagePatients;
