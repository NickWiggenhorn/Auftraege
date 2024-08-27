import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getDatabase, ref, push, onValue, remove, update } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyAPVrcDdvMgjUWKL9d_NqYt1RZllJeZIzI",
    authDomain: "industriegebiet2.firebaseapp.com",
    databaseURL: "https://industriegebiet2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "industriegebiet2",
    storageBucket: "industriegebiet2.appspot.com",
    messagingSenderId: "449327174110",
    appId: "1:449327174110:web:c5ab9b52ad9c4c8ab68d4f"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Globale Funktionen definieren
window.deleteAuftrag = function(id) {
    const auftragRef = ref(db, 'auftraege/' + id);
    remove(auftragRef).then(() => {
        console.log('Auftrag erfolgreich gelöscht');
    }).catch((error) => {
        console.error('Fehler beim Löschen des Auftrags:', error);
    });
};

window.updateStatus = function(id, newStatus) {
    update(ref(db, 'auftraege/' + id), { status: newStatus });
};

// Formular-Ereignislistener
document.getElementById('auftragForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const baustoff = document.getElementById('baustoff').value;
    const lkw = document.getElementById('lkw').value;
    const adresse = document.getElementById('adresse').value;
    const lieferdatum = document.getElementById('lieferdatum').value;
    const kontakt = document.getElementById('kontakt').value;
    const anweisungen = document.getElementById('anweisungen').value;
    const status = document.getElementById('status').value;

    const auftrag = {
        name,
        baustoff,
        lkw,
        adresse,
        lieferdatum,
        kontakt,
        anweisungen,
        status
    };

    // Auftrag zur Firebase-Datenbank hinzufügen
    const auftragRef = push(ref(db, 'auftraege'));
    const auftragKey = auftragRef.key;
    update(ref(db, 'auftraege/' + auftragKey), auftrag);

    clearForm();
});

function clearForm() {
    document.getElementById('auftragForm').reset();
}

function addAuftragToList(auftrag, id) {
    const auftraegeList = document.getElementById('auftraegeList');
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', id);

    listItem.innerHTML = `
        <div class="auftrag-content" id="auftrag-${id}">
            <div><strong>Name:</strong> ${auftrag.name}</div>
            <div><strong>Baustoff:</strong> ${auftrag.baustoff}</div>
            <div><strong>LKW:</strong> ${auftrag.lkw}</div>
            <div><strong>Adresse:</strong> ${auftrag.adresse}</div>
            <div><strong>Lieferdatum:</strong> ${auftrag.lieferdatum}</div>
            <div><strong>Kontaktinformationen:</strong> ${auftrag.kontakt}</div>
            <div><strong>Besondere Anweisungen:</strong> ${auftrag.anweisungen}</div>
            <div><strong>Status:</strong> ${auftrag.status}</div>
            <button onclick="deleteAuftrag('${id}')">Löschen</button>
            <button onclick="printAuftrag('${id}')">Drucken</button>
            <select onchange="updateStatus('${id}', this.value)">
                <option value="Eingegangen" ${auftrag.status === 'Eingegangen' ? 'selected' : ''}>Eingegangen</option>
                <option value="In Bearbeitung" ${auftrag.status === 'In Bearbeitung' ? 'selected' : ''}>In Bearbeitung</option>
                <option value="Abgeschlossen" ${auftrag.status === 'Abgeschlossen' ? 'selected' : ''}>Abgeschlossen</option>
            </select>
        </div>
    `;

    auftraegeList.appendChild(listItem);
}

window.printAuftrag = function(id) {
    const auftragContent = document.getElementById(`auftrag-${id}`).innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Druckvorschau</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 20px; }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(auftragContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
};


function loadAuftraege() {
    const auftraegeRef = ref(db, 'auftraege');
    onValue(auftraegeRef, (snapshot) => {
        const auftraegeList = document.getElementById('auftraegeList');
        auftraegeList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const id = childSnapshot.key;
            const auftrag = childSnapshot.val();
            addAuftragToList(auftrag, id);
        });
    });
}

document.addEventListener('DOMContentLoaded', loadAuftraege);
