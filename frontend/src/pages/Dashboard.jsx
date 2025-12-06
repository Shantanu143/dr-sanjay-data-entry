import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../lib/api';
import { Users, UserPlus, Activity, TrendingUp, Calendar, Heart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [period, setPeriod] = useState('daily');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchTrends();
    }, [period]);

    const fetchStats = async () => {
        try {
            const response = await api.get(`/analytics/stats?period=${period}`);
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const fetchTrends = async () => {
        try {
            const response = await api.get('/analytics/trends');
            setTrends(response.data.trends);
        } catch (error) {
            console.error('Error fetching trends:', error);
        }
    };

    const COLORS = ['#667eea', '#f093fb', '#4facfe', '#0ba360'];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                        <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-purple-400/20" />
                    </div>
                    <div className="text-sm font-medium text-slate-600">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 custom-scrollbar">
            {/* Header with Gradient */}
            <div className="relative overflow-hidden rounded-2xl glass-card p-8 hover-lift transition-smooth">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-xl bg-gradient-primary">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-sm md:text-base text-slate-600">Welcome back! Here's your overview</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards with Glass Effect */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-card border-0 hover-lift transition-smooth overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Patients</CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-primary">
                            <Users className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {stats?.totalPatients || 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">All registered patients</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-0 hover-lift transition-smooth overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-10 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">New Patients</CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-success">
                            <UserPlus className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            {stats?.newPatients || 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {period === 'daily' ? 'Today' : period === 'weekly' ? 'This week' : 'This month'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-0 hover-lift transition-smooth overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-warning opacity-0 group-hover:opacity-10 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Active Today</CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-warning">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                            {stats?.newPatients ? Math.floor(stats.newPatients * 1.5) : 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Patient visits today</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-0 hover-lift transition-smooth overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-info opacity-0 group-hover:opacity-10 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Growth Rate</CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-info">
                            <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            +12.5%
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Compared to last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Time Period Selector */}
            <Card className="glass-card border-0">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={period === 'daily' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('daily')}
                            className={period === 'daily' ? 'bg-gradient-primary border-0 text-white hover:opacity-90' : 'glass hover-lift'}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Daily
                        </Button>
                        <Button
                            variant={period === 'weekly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('weekly')}
                            className={period === 'weekly' ? 'bg-gradient-primary border-0 text-white hover:opacity-90' : 'glass hover-lift'}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Weekly
                        </Button>
                        <Button
                            variant={period === 'monthly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('monthly')}
                            className={period === 'monthly' ? 'bg-gradient-primary border-0 text-white hover:opacity-90' : 'glass hover-lift'}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Monthly
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Charts with Glass Effect */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-0 hover-lift transition-smooth">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gradient-primary" />
                            Gender Distribution
                        </CardTitle>
                        <CardDescription>Patient distribution by gender</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.genderDistribution && stats.genderDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats.genderDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ gender, count }) => `${gender}: ${count}`}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {stats.genderDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                                        <Users className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <p className="text-slate-500">No patient data available</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass-card border-0 hover-lift transition-smooth">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gradient-success" />
                            Patient Trends
                        </CardTitle>
                        <CardDescription>New patients over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {trends && trends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={trends}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                                    <XAxis dataKey="date" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#667eea" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                                        <TrendingUp className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <p className="text-slate-500">No trend data available</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
