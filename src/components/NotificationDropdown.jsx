import React, { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Toast from './ui/Toast';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');

    // Get token for WebSocket auth (if your backend supports it via query param or header)
    const token = localStorage.getItem('token');
    const WS_URL = token ? `ws://127.0.0.1:8000/ws/notifications/?token=${token}` : null;

    const { lastJsonMessage, readyState } = useWebSocket(WS_URL, {
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        onOpen: () => console.log('WebSocket Connected'),
    });

    useEffect(() => {
        fetchNotifications();

        // Click outside to close
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update page title with unread count
    useEffect(() => {
        const baseTitle = 'Digiplus RH';
        if (unreadCount > 0) {
            document.title = `${baseTitle} (${unreadCount})`;
        } else {
            document.title = baseTitle;
        }
    }, [unreadCount]);

    useEffect(() => {
        if (lastJsonMessage) {
            console.log('Notification reçue:', lastJsonMessage);
            // Handle structure depending on backend. Assuming lastJsonMessage contains notification data directly
            // or inside a 'content' field.
            const newNotif = lastJsonMessage.content || lastJsonMessage;

            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Show toast notification
            const notifType = newNotif.type === 'succes' ? 'success' :
                newNotif.type === 'erreur' ? 'error' : 'info';
            setToastMessage(`${newNotif.titre}: ${newNotif.message}`);
            setToastType(notifType);
            setShowToast(true);

            // Play notification sound
            playNotificationSound();

            // Auto-hide toast after 5 seconds
            setTimeout(() => setShowToast(false), 5000);
        }
    }, [lastJsonMessage]);

    // Function to play notification sound
    const playNotificationSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // First tone (higher pitch)
            const oscillator1 = audioContext.createOscillator();
            const gainNode1 = audioContext.createGain();

            oscillator1.connect(gainNode1);
            gainNode1.connect(audioContext.destination);

            oscillator1.frequency.value = 800; // Hz
            oscillator1.type = 'sine';

            gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator1.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.1);

            // Second tone (lower pitch) - plays after first
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();

            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);

            oscillator2.frequency.value = 600; // Hz
            oscillator2.type = 'sine';

            gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.1);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator2.start(audioContext.currentTime + 0.1);
            oscillator2.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.error('Erreur lors de la lecture du son:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/users/notifications/'); // Ensure this endpoint exists and returns list
            setNotifications(response.data.results || response.data);
            // Calculate unread
            const unread = (response.data.results || response.data).filter(n => !n.lu).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/users/notifications/${id}/mark-read/`);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, lu: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        // Implement if backend supports batch update or loop
        // Simple client side update for now if no endpoint
        setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
        setUnreadCount(0);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-750">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Aucune notification</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-start gap-3 ${!notif.lu ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                        >
                                            <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${notif.type === 'succes' ? 'bg-green-100/50 text-green-600' :
                                                notif.type === 'erreur' ? 'bg-red-100/50 text-red-600' :
                                                    'bg-blue-100/50 text-blue-600'
                                                }`}>
                                                <Bell className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                                                        {notif.titre}
                                                    </p>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {new Date(notif.date_envoi || notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                {!notif.lu && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                                        className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                                    >
                                                        <Check className="w-3 h-3 mr-1" /> Marquer comme lu
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 text-center">
                            <Link to="/notifications" className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Voir tout l'historique
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default NotificationDropdown;
