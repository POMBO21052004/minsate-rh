import React, { useState, useEffect } from "react";
import {
    Calendar,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Eye,
    Pencil,
    X
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import EmployeLayout from "../../../contexts/Layout";
import { motion, AnimatePresence } from "framer-motion";

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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            <Icon className="w-3 h-3 mr-1" />
            {labels[status] || status}
        </span>
    );
};

const Index = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        date_debut: "",
        date_fin: "",
        type_conge: "conge_paye",
        description: ""
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users/leaves/");
            setLeaves(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des congés:", error);
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
        setSubmitLoading(true);

        // Basic Validation
        if (new Date(formData.date_fin) < new Date(formData.date_debut)) {
            setError("La date de fin ne peut pas être antérieure à la date de début.");
            setSubmitLoading(false);
            return;
        }

        try {
            await api.post("/users/leaves/", formData);
            setIsModalOpen(false);
            setFormData({ date_debut: "", date_fin: "", type_conge: "conge_paye", description: "" });
            fetchLeaves();
        } catch (err) {
            console.error("Erreur lors de la création:", err);
            setError("Erreur lors de la soumission de la demande. Veuillez vérifier les champs.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const filteredLeaves = leaves.filter(leave => {
        if (filter === "all") return true;
        return leave.statut === filter;
    });

    return (
        <EmployeLayout>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Congés</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gérez vos demandes et consultez votre historique
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nouvelle Demande
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 mr-4">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Solde Restant</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">18 Jours</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 mr-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">En Attente</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {leaves.filter(l => l.statut === 'en_attente').length} Demandes
                            </p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 mr-4">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Approuvés (Année)</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {leaves.filter(l => l.statut === 'approuve').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters & List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
                            {['all', 'en_attente', 'approuve', 'rejete'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === status
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {status === 'all' ? 'Toutes' :
                                        status === 'en_attente' ? 'En attente' :
                                            status === 'approuve' ? 'Approuvées' : 'Rejetées'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-750 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Type</th>
                                    <th className="px-6 py-3 font-medium">Dates</th>
                                    <th className="px-6 py-3 font-medium">Durée</th>
                                    <th className="px-6 py-3 font-medium">Statut</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Chargement...</td>
                                    </tr>
                                ) : filteredLeaves.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Aucune demande trouvée</td>
                                    </tr>
                                ) : (
                                    filteredLeaves.map((leave) => (
                                        <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white capitalize">
                                                {leave.type_conge.replace('_', ' ')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {new Date(leave.date_debut).toLocaleDateString()} - {new Date(leave.date_fin).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {calculateDuration(leave.date_debut, leave.date_fin)} j
                                            </td>
                                            <td className="px-6 py-4">
                                                <LeaveStatusBadge status={leave.statut} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        to={`/employe/conges/${leave.id}`}
                                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="Voir les détails"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    {leave.statut === 'en_attente' && (
                                                        <Link
                                                            to={`/employe/conges/${leave.id}/edit`}
                                                            className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* New Request Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto z-50 w-full max-w-lg h-fit max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nouvelle Demande de Congé</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Précisez le motif de votre absence..."
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitLoading ? "Envoi..." : "Soumettre la demande"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </EmployeLayout>
    );
};

export default Index;
