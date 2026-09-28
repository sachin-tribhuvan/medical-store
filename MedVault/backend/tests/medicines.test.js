const request = require('supertest');

jest.mock('../src/services/medicineService', () => ({
  listMedicines: jest.fn(), getMedicine: jest.fn(), createMedicine: jest.fn(),
  updateMedicine: jest.fn(), deleteMedicine: jest.fn(), getStats: jest.fn(),
}));
const svc = require('../src/services/medicineService');
const app = require('../src/app')();

const sample = { id: '665f1c2e8f1b2a0012345678', medicineName: 'Paracetamol 500mg', status: 'available' };

beforeEach(() => jest.clearAllMocks());

test('GET /api/health reports service and database state', async () => {
  const res = await request(app).get('/api/health');
  expect(res.body.service).toBe('medvault-backend');
  expect(res.status).toBe(503); // no DB connection in unit tests
  expect(res.body.database).toBe('disconnected');
});

test('GET /api/medicines returns a list', async () => {
  svc.listMedicines.mockResolvedValue([sample]);
  const res = await request(app).get('/api/medicines?status=available');
  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({ success: true, count: 1 });
  expect(svc.listMedicines).toHaveBeenCalledWith(expect.objectContaining({ status: 'available' }));
});

test('POST /api/medicines creates (201)', async () => {
  svc.createMedicine.mockResolvedValue(sample);
  const res = await request(app).post('/api/medicines').send({ medicineName: 'Paracetamol 500mg' });
  expect(res.status).toBe(201);
  expect(res.body.data.id).toBe(sample.id);
});

test('PUT /api/medicines/:id updates, and 404s when missing', async () => {
  svc.updateMedicine.mockResolvedValueOnce(sample).mockResolvedValueOnce(null);
  expect((await request(app).put(`/api/medicines/${sample.id}`).send({ price: 10 })).status).toBe(200);
  expect((await request(app).put(`/api/medicines/${sample.id}`).send({ price: 10 })).status).toBe(404);
});

test('DELETE /api/medicines/:id deletes, and 404s when missing', async () => {
  svc.deleteMedicine.mockResolvedValueOnce(sample).mockResolvedValueOnce(null);
  expect((await request(app).delete(`/api/medicines/${sample.id}`)).status).toBe(200);
  expect((await request(app).delete(`/api/medicines/${sample.id}`)).status).toBe(404);
});

test('unknown route returns JSON 404', async () => {
  const res = await request(app).get('/api/nope');
  expect(res.status).toBe(404);
  expect(res.body.success).toBe(false);
});
