// web/WebDashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function WebDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const alertsSnap = await getDocs(collection(db, 'alerts'));
      const alertList = alertsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlerts(alertList);

      const incSnap = await getDocs(collection(db, 'incidents'));
      const incList = incSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIncidents(incList);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1 style={{ color: '#D92B2B' }}>Painel Web - Tagout</h1>

      <section style={{ marginBottom: 40 }}>
        <h2>🔔 Alertas</h2>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Evento</th>
              <th>Data</th>
              <th>Usuário</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.evento}</td>
                <td>{a.timestamp}</td>
                <td>{a.user || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>⚠️ Ocorrências</h2>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.description}</td>
                <td>{i.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
