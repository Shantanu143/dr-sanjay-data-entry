import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Eye, EyeOff, Sparkles, Heart, Users, TrendingUp } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2 animated-gradient">
            {/* Left side - Login Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-grid-slate/5" />

                <div className="mx-auto w-full max-w-md space-y-8 relative z-10">
                    {/* Glass Card */}
                    <div className="glass-card rounded-3xl p-8 shadow-2xl hover-lift transition-smooth">
                        {/* Logo and Header */}
                        <div className="flex flex-col items-center space-y-4 text-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-xl">
                                    <Activity className="h-9 w-9 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                    Welcome Back
                                </h1>
                                <p className="text-sm text-slate-600 mt-2 flex items-center justify-center gap-1">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                    Sign in to MediCare Dashboard
                                </p>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-12 glass border-white/40 focus:border-purple-400 focus:ring-purple-400 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                        <a
                                            href="#"
                                            className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-12 glass border-white/40 focus:border-purple-400 focus:ring-purple-400 pr-12 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl glass-card border-red-200 p-4 text-sm text-red-600 animate-in slide-in-from-top">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-red-600" />
                                        {error}
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover-lift transition-smooth border-0"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Sign In
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 rounded-xl glass border-purple-200 p-4">
                            <p className="text-xs font-semibold text-center mb-3 text-purple-600 flex items-center justify-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                Demo Credentials
                            </p>
                            <div className="space-y-2 text-xs text-slate-600">
                                <div className="flex items-center justify-between glass-card rounded-lg p-2">
                                    <span className="text-slate-500">Email:</span>
                                    <span className="font-mono font-semibold text-purple-600">dr.sanjay@gmail.com</span>
                                </div>
                                <div className="flex items-center justify-between glass-card rounded-lg p-2">
                                    <span className="text-slate-500">Password:</span>
                                    <span className="font-mono font-semibold text-purple-600">Dr.sanjay@123</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-xs text-slate-500 mt-6">
                            By continuing, you agree to our{' '}
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium" onClick={(e) => e.preventDefault()}>
                                Terms
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium" onClick={(e) => e.preventDefault()}>
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Branding */}
            <div className="hidden lg:flex relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-3xl" />
                <div className="absolute inset-0 bg-grid-white/10" />

                <div className="relative h-full flex flex-col items-center justify-center p-12 text-slate-800">
                    <div className="space-y-8 text-center max-w-lg">
                        {/* Animated Logo */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
                                <div className="relative glass-card rounded-3xl p-12 shadow-2xl">
                                    <Activity className="h-24 w-24 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                MediCare
                            </h2>
                            <p className="text-xl text-slate-700 font-medium">
                                Patient Management System
                            </p>
                            <p className="text-slate-600">
                                Streamline your healthcare practice with our comprehensive solution
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-8">
                            <div className="glass-card rounded-2xl p-6 hover-lift transition-smooth">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">500+</div>
                                    <div className="text-sm text-slate-600 font-medium">Patients</div>
                                </div>
                            </div>
                            <div className="glass-card rounded-2xl p-6 hover-lift transition-smooth">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                                        <Heart className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">50+</div>
                                    <div className="text-sm text-slate-600 font-medium">Doctors</div>
                                </div>
                            </div>
                            <div className="glass-card rounded-2xl p-6 hover-lift transition-smooth">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-teal-600">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">99%</div>
                                    <div className="text-sm text-slate-600 font-medium">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
