import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Clock,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import api from "../../../services/api";
import EmployeLayout from "../../../layouts/Employe/Layout";

const LeaveStatusBadge = ({ status }) => {
    const styles = {
        approuve: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        en_attente: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        rejete: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };

    const labels = {
        approuve: "Approuvé",
        en_attente: "En attente",
        rejete: "Rejeté",
    };

    const icons = {
        approuve: CheckCircle2,
        en_attente: Clock,
        rejete: XCircle,
    };

    const Icon = icons[status] || AlertCircle;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
            <Icon className="w-4 h-4 mr-2" />
            {labels[status] || status}
        </span>
    );
};

const Show = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeave();
    }, [id]);

    const fetchLeave = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/users/leaves/${id}/`);
            setLeave(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de la demande:", error);
            // Optionnel: Rediriger si non trouvé
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    if (loading) {
        return (
            <EmployeLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Chargement...</div>
                </div>
            </EmployeLayout>
        );
    }

    if (!leave) {
        return (
            <EmployeLayout>
                <div className="max-w-3xl mx-auto text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Demande non trouvée</h2>
                    <Link to="/employe/conges" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
                        Retour à la liste
                    </Link>
                </div>
            </EmployeLayout>
        );
    }

    return (
        <EmployeLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                <button
                    onClick={() => navigate('/employe/conges')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Retour
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Détails de la demande
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Demande créée le {new Date(leave.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <LeaveStatusBadge status={leave.statut} />
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Type de Congé</label>
                                <div className="text-lg font-medium text-gray-900 dark:text-white capitalize flex items-center">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 mr-3">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    {leave.type_conge.replace('_', ' ')}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Durée</label>
                                <div className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 mr-3">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    {calculateDuration(leave.date_debut, leave.date_fin)} jours
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Date de début</label>
                                <div className="text-lg text-gray-900 dark:text-white">
                                    {new Date(leave.date_debut).toLocaleDateString()}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Date de fin</label>
                                <div className="text-lg text-gray-900 dark:text-white">
                                    {new Date(leave.date_fin).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Motif / Description</label>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-gray-700 dark:text-gray-300 flex items-start">
                                <FileText className="w-5 h-5 mr-3 mt-1 text-gray-400" />
                                <p>{leave.description || "Aucun motif spécifié."}</p>
                            </div>
                        </div>

                        {leave.statut === 'en_attente' && (
                            <div className="flex justify-end pt-4">
                                <Link
                                    to={`/employe/conges/${leave.id}/edit`}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    Modifier la demande
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </EmployeLayout>
    );
};

export default Show;
