import React, { useState, useEffect } from "react";
import {
    Shield,
    Search,
    Filter,
    Calendar,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDown,
    Eye
} from "lucide-react";
import api from "../../../services/api";
import SuperAdminLayout from "../../../layouts/SuperAdmin/Layout";
import { motion, AnimatePresence } from "framer-motion";

const ActionBadge = ({ action }) => {
    const styles = {
        approuve: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        rejete: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        modification: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    };

    const icons = {
        approuve: CheckCircle2,
        rejete: XCircle,
        modification: Clock
    };

    const Icon = icons[action] || Clock;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[action] || "bg-gray-100 text-gray-800"}`}>
            <Icon className="w-3 h-3 mr-1" />
            {action === 'approuve' ? 'Approbation' : action === 'rejete' ? 'Rejet' : action}
        </span>
    );
};

const Index = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAction, setFilterAction] = useState("all");
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get("/management/audit/"); // Updated endpoint based on views.py
            setLogs(response.data);
        } catch (error) {
            console.error("Erreur chargement audit:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.demande_info?.employe?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterAction === "all" || log.action === filterAction;

        return matchesSearch && matchesFilter;
    });

    return (
        <SuperAdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Shield className="w-8 h-8 mr-3 text-green-600" />
                            Journal d'Audit
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Historique des actions administratives et de sécurité
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par admin ou employé..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterAction}
                                onChange={(e) => setFilterAction(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">Toutes les actions</option>
                                <option value="approuve">Approbations</option>
                                <option value="rejete">Rejets</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-750 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Date & Heure</th>
                                    <th className="px-6 py-3 font-medium">Administrateur</th>
                                    <th className="px-6 py-3 font-medium">Action</th>
                                    <th className="px-6 py-3 font-medium">Sur la demande de</th>
                                    <th className="px-6 py-3 font-medium">Détails</th>
                                    <th className="px-6 py-3 font-medium text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Chargement...</td>
                                    </tr>
                                ) : filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Aucun log trouvé</td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                    {new Date(log.date_action).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-xs font-bold mr-3">
                                                        {log.admin_name?.charAt(0) || "A"}
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {log.admin_name || "Admin"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ActionBadge action={log.action} />
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {log.demande_info?.employe}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                {log.raison || log.demande_info?.type?.replace('_', ' ') || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedLog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLog(null)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto z-50 w-full max-w-lg h-fit bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
                        >
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-green-600" />
                                Détails de l'action
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Administrateur</label>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedLog.admin_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Date</label>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {new Date(selectedLog.date_action).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Demande concernée</h3>
                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                        <p><span className="font-medium">Employé:</span> {selectedLog.demande_info?.employe}</p>
                                        <p><span className="font-medium">Type:</span> {selectedLog.demande_info?.type?.replace('_', ' ')}</p>
                                        <p><span className="font-medium">Dates:</span> {selectedLog.demande_info?.date_debut} au {selectedLog.demande_info?.date_fin}</p>
                                    </div>
                                </div>

                                {selectedLog.raison && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Motif / Commentaire</label>
                                        <div className="mt-1 p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50">
                                            {selectedLog.raison}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
                                >
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </SuperAdminLayout>
    );
};

export default Index;
