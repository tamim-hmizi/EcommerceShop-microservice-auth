import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { bearer, useDatabase } from './helpers.js';

useDatabase();

const base = '/api/auth';
const alice = { name: 'Alice', email: 'alice@example.com', password: 'correct-horse-1' };

describe('auth service', () => {
  it('registers a user and never returns the password', async () => {
    const res = await request(app).post(`${base}/register`).send(alice).expect(201);
    assert.equal(res.body.email, alice.email);
    assert.ok(res.body.token);
    assert.equal(res.body.password, undefined);
  });

  it('rejects a duplicate email', async () => {
    await request(app).post(`${base}/register`).send(alice).expect(201);
    await request(app).post(`${base}/register`).send(alice).expect(400);
  });

  it('logs in with the right password only', async () => {
    await request(app).post(`${base}/register`).send(alice).expect(201);
    const ok = await request(app)
      .post(`${base}/login`)
      .send({ email: alice.email, password: alice.password })
      .expect(200);
    assert.ok(ok.body.token);
    await request(app)
      .post(`${base}/login`)
      .send({ email: alice.email, password: 'wrong-password' })
      .expect(401);
  });

  it('requires a valid token for the profile', async () => {
    await request(app).get(`${base}/profile`).expect(401);
    await request(app).get(`${base}/profile`).set('Authorization', 'Bearer nope').expect(401);

    const { body } = await request(app).post(`${base}/register`).send(alice).expect(201);
    const res = await request(app).get(`${base}/profile`).set(bearer(body._id)).expect(200);
    assert.equal(res.body.email, alice.email);
    assert.equal(res.body.password, undefined);
  });

  it('exposes Prometheus metrics', async () => {
    const res = await request(app).get(`${base}/metrics`).expect(200);
    assert.match(res.text, /http_request_duration/);
  });
});
