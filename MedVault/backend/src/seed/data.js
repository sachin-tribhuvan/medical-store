const DAY = 24 * 60 * 60 * 1000;
const at = (offsetDays) => {
  const t = new Date(Date.now() + offsetDays * DAY);
  return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
};

// [name, company, category, batch, price, qty, minStock, mfgOffsetDays, expiryOffsetDays, description]
const rows = [
  ['Paracetamol 500mg', 'Micro Labs', 'Tablet', 'PCM-2405A', 30, 500, 100, -200, 520, 'Analgesic and antipyretic for fever and mild pain.'],
  ['Ibuprofen 400mg', 'Cipla', 'Tablet', 'IBU-2404B', 45, 320, 80, -180, 540, 'NSAID for pain, inflammation and fever.'],
  ['Amoxicillin 500mg', 'Sun Pharma', 'Capsule', 'AMX-2403C', 120, 60, 80, -150, 400, 'Broad-spectrum penicillin antibiotic. Low stock.'],
  ['Azithromycin 500mg', 'Zydus', 'Tablet', 'AZI-2406D', 95, 150, 50, -120, 450, 'Macrolide antibiotic for respiratory infections.'],
  ['Cetirizine 10mg', "Dr. Reddy's", 'Tablet', 'CTZ-2402E', 25, 400, 100, -220, 480, 'Antihistamine for allergies.'],
  ['Omeprazole 20mg', 'Lupin', 'Capsule', 'OMP-2405F', 55, 0, 60, -160, 420, 'Proton pump inhibitor for acidity and GERD. Out of stock.'],
  ['Pantoprazole 40mg', 'Alkem', 'Tablet', 'PAN-2407G', 85, 220, 70, -100, 600, 'Reduces stomach acid production.'],
  ['Vitamin C 500mg', 'Abbott', 'Tablet', 'VTC-2404H', 60, 35, 50, -140, 380, 'Chewable vitamin C supplement. Low stock.'],
  ['ORS Powder', 'FDC', 'Powder', 'ORS-2406I', 22, 300, 100, -90, 500, 'Oral rehydration salts for dehydration.'],
  ['Cough Syrup 100ml', 'Dabur', 'Syrup', 'CSY-2401J', 110, 90, 40, -240, 300, 'Herbal expectorant cough syrup.'],
  ['Antacid Suspension 170ml', 'Mankind', 'Syrup', 'ANT-2405K', 95, 75, 30, -700, 12, 'Relief from heartburn and indigestion. Expiring soon.'],
  ['Antiseptic Cream 15g', 'Himalaya', 'Cream', 'ASC-2403L', 70, 130, 40, -130, 460, 'Topical antiseptic for minor cuts and wounds.'],
  ['Eye Drops 10ml', 'Allergan', 'Drops', 'EYD-2406M', 140, 45, 25, -80, 330, 'Lubricating eye drops for dryness.'],
  ['Pain Relief Gel 30g', 'Sun Pharma', 'Ointment', 'PRG-2404N', 165, 20, 25, -110, 550, 'Topical gel for muscle and joint pain. Low stock.'],
  ['Multivitamin Tablets', 'Zydus Wellness', 'Tablet', 'MVT-2407O', 320, 180, 40, -60, 640, 'Daily multivitamin and mineral supplement.'],
  ['Metformin 500mg', 'USV', 'Tablet', 'MET-2405P', 38, 260, 80, -170, 510, 'Oral antidiabetic medicine.'],
  ['Amlodipine 5mg', 'Torrent', 'Tablet', 'AML-2406Q', 42, 210, 60, -130, 570, 'Calcium channel blocker for hypertension.'],
  ['Diclofenac Injection 75mg', 'Cadila', 'Injection', 'DIC-2402R', 28, 100, 30, -760, -25, 'Injectable NSAID. Expired batch kept for demo.'],
  ['Salbutamol Inhaler 100mcg', 'Cipla', 'Other', 'SAL-2405S', 155, 55, 20, -100, 200, 'Bronchodilator inhaler for asthma relief.'],
  ['Clotrimazole Cream 1%', 'Glenmark', 'Cream', 'CLO-2404T', 78, 95, 30, -120, 430, 'Antifungal cream for skin infections.'],
  ['Povidone Iodine Ointment', 'Win-Medicare', 'Ointment', 'PVI-2403U', 88, 12, 20, -150, 360, 'Antiseptic ointment for wound care. Low stock.'],
];

module.exports = rows.map(([medicineName, company, category, batchNumber, price, quantity, minimumStock, m, e, description]) => ({
  medicineName, company, category, batchNumber, price, quantity, minimumStock,
  manufacturingDate: at(m), expiryDate: at(e), description,
}));
