import React, { useState, useEffect } from 'react';
import './NotificationPrompt.css';
import { Bell, X } from 'lucide-react';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if we already asked
    const hasAsked = localStorage.getItem('hasAskedNotification');
    
    // Only show if browser supports notifications and service workers, and permission is default
    if ('Notification' in window && 'serviceWorker' in navigator && Notification.permission === 'default' && !hasAsked) {
      // Small delay so it doesn't pop up immediately on load
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    setShowPrompt(false);
    localStorage.setItem('hasAskedNotification', 'true');
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        subscribeUser();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleDeny = () => {
    setShowPrompt(false);
    localStorage.setItem('hasAskedNotification', 'true');
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID public key from backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/vapidPublicKey`);
      const vapidData = await response.json();
      const convertedVapidKey = urlBase64ToUint8Array(vapidData.publicKey);

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      // Send subscription to backend
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
      
      console.log('User subscribed to notifications successfully');
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="notification-prompt-overlay">
      <div className="notification-prompt-card">
        <button className="close-prompt-btn" onClick={handleDeny}>
          <X size={20} />
        </button>
        <div className="prompt-icon-container">
          <Bell size={28} />
        </div>
        <h3>Enable Notifications</h3>
        <p>Get instant updates when new announcements or festival details are published.</p>
        <div className="prompt-actions">
          <button className="prompt-deny-btn" onClick={handleDeny}>Not Now</button>
          <button className="prompt-allow-btn" onClick={handleAllow}>Allow</button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPrompt;
