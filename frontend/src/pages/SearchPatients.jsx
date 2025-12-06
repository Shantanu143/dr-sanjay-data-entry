import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import api from '../lib/api';
import { Search, Eye, Filter, Calendar, User, Phone, RotateCcw, Sparkles, Users } from 'lucide-react';

const SearchPatients = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [gender, setGender] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (gender) params.append('gender', gender);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            params.append('limit', '100');

            const response = await api.get(`/patients?${params.toString()}`);
            setResults(response.data.patients);
        } catch (error) {
            console.error('Error searching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchTerm('');
        setGender('');
        setStartDate('');
        setEndDate('');
        setResults([]);
        setSearched(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl glass-card p-6 hover-lift transition-smooth">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10" />
                <div className="relative flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 shadow-lg">
                        <Search className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Search Patients
                        </h1>
                        <p className="text-sm md:text-base text-slate-600 flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-orange-500" />
                            Find patients by name, phone, or filters
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Filters Card */}
            <Card className="glass-card border-0 hover-lift transition-smooth">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600" />
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-orange-600" />
                            Search Filters
                        </CardTitle>
                    </div>
                    <CardDescription>Enter search criteria to find patients in the system</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search Term */}
                            <div className="space-y-2">
                                <Label htmlFor="searchTerm" className="text-slate-700 font-medium flex items-center gap-1">
                                    <Search className="h-4 w-4 text-orange-600" />
                                    Search by Name or Phone
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="searchTerm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Enter name or phone number"
                                        className="glass border-white/40 focus:border-orange-400 focus:ring-orange-400 h-11 pl-10"
                                    />
                                </div>
                            </div>

                            {/* Gender Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-slate-700 font-medium flex items-center gap-1">
                                    <User className="h-4 w-4 text-orange-600" />
                                    Gender
                                </Label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="flex h-11 w-full rounded-lg glass border-white/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                                >
                                    <option value="">All Genders</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label htmlFor="startDate" className="text-slate-700 font-medium flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-orange-600" />
                                    Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="glass border-white/40 focus:border-orange-400 focus:ring-orange-400 h-11"
                                />
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <Label htmlFor="endDate" className="text-slate-700 font-medium flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-orange-600" />
                                    End Date
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="glass border-white/40 focus:border-orange-400 focus:ring-orange-400 h-11"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg hover-lift transition-smooth border-0"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Searching...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Search className="h-5 w-5" />
                                        <span>Search Patients</span>
                                    </div>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="flex-1 h-12 glass hover-lift transition-smooth"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Search Results */}
            {searched && (
                <Card className="glass-card border-0 hover-lift transition-smooth">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600" />
                            <CardTitle>Search Results</CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Found <span className="font-semibold text-orange-600">{results.length}</span> patient{results.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {results.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center">
                                    <Search className="h-10 w-10 text-orange-600" />
                                </div>
                                <p className="text-slate-600 font-medium">No patients found</p>
                                <p className="text-sm text-slate-500 mt-1">Try adjusting your search criteria</p>
                            </div>
                        ) : (
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
                                        {results.map((patient) => (
                                            <TableRow
                                                key={patient._id}
                                                className="border-slate-200 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold shadow-lg">
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
                                                <TableCell className="hidden sm:table-cell text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-slate-400" />
                                                        {patient.phoneNo}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
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
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                        {new Date(patient.createdAt).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/patient/${patient._id}`)}
                                                        title="View Details"
                                                        className="hover:bg-orange-100 hover:text-orange-600 transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SearchPatients;
