import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import api from "../../../services/api";
import EmployeLayout from "../../../layouts/Employe/Layout";

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        date_debut: "",
        date_fin: "",
        type_conge: "conge_paye",
        description: ""
    });

    useEffect(() => {
        fetchLeave();
    }, [id]);

    const fetchLeave = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/users/leaves/${id}/`);
            // Initialiser le formulaire avec les données
            setFormData({
                date_debut: response.data.date_debut,
                date_fin: response.data.date_fin,
                type_conge: response.data.type_conge,
                description: response.data.description || ""
            });

            // Empêcher l'édition si déjà traité
            if (response.data.statut !== 'en_attente') {
                navigate(`/employe/conges/${id}`);
            }
        } catch (error) {
            console.error("Erreur récupération:", error);
            setError("Impossible de charger la demande.");
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        if (new Date(formData.date_fin) < new Date(formData.date_debut)) {
            setError("La date de fin ne peut pas être antérieure à la date de début.");
            setSaving(false);
            return;
        }

        try {
            await api.patch(`/users/leaves/${id}/`, formData);
            navigate(`/employe/conges/${id}`);
        } catch (err) {
            console.error("Erreur modification:", err);
            setError("Erreur lors de la modification.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <EmployeLayout>
                <div className="flex items-center justify-center h-64">Chargement...</div>
            </EmployeLayout>
        );
    }

    return (
        <EmployeLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <button
                    onClick={() => navigate('/employe/conges')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Annuler
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Modifier la demande
                    </h1>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de Congé</label>
                            <select
                                value={formData.type_conge}
                                onChange={(e) => setFormData({ ...formData, type_conge: e.target.value })}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="conge_paye">Congé Payé</option>
                                <option value="maladie">Maladie</option>
                                <option value="sans_solde">Sans Solde</option>
                                <option value="rtt">RTT</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de début</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date_debut}
                                    onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de fin</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date_fin}
                                    onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {formData.date_debut && formData.date_fin && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                                Durée estimée: <span className="font-bold">{calculateDuration(formData.date_debut, formData.date_fin)} jours</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motif / Description</label>
                            <textarea
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </EmployeLayout>
    );
};

export default Edit;
