import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { login, getUserConnected, logout } from '../../controllers/authController.js';
import User from '../../models/User.js';

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('devrait retourner une erreur 400 si email est manquant', async () => {
      req.body = { motDePasse: 'password123' };

      await login(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('email et mot de passe sont obligatoires');
      expect(error.statusCode).to.equal(400);
    });

    it('devrait retourner une erreur 400 si motDePasse est manquant', async () => {
      req.body = { email: 'test@test.com' };

      await login(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('email et mot de passe sont obligatoires');
      expect(error.statusCode).to.equal(400);
    });

    it('devrait retourner une erreur 401 si utilisateur non trouvé', async () => {
      req.body = { email: 'test@test.com', motDePasse: 'password123' };
      
      const findOneStub = sinon.stub(User, 'findOne').returns({
        select: sinon.stub().resolves(null)
      });

      await login(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Email ou mot de passe incorrect');
      expect(error.statusCode).to.equal(401);
    });

    it('devrait retourner une erreur 401 si mot de passe incorrect', async () => {
      req.body = { email: 'test@test.com', motDePasse: 'wrongpassword' };
      
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        nom: 'Test User',
        role: 'user',
        comparePassword: sinon.stub().resolves(false)
      };

      const findOneStub = sinon.stub(User, 'findOne').returns({
        select: sinon.stub().resolves(mockUser)
      });

      await login(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Email ou mot de passe incorrect');
      expect(error.statusCode).to.equal(401);
    });

    it('devrait retourner un token et les données utilisateur si connexion réussie', async () => {
      req.body = { email: 'test@test.com', motDePasse: 'password123' };
      
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        nom: 'Test User',
        role: 'user',
        comparePassword: sinon.stub().resolves(true)
      };

      const findOneStub = sinon.stub(User, 'findOne').returns({
        select: sinon.stub().resolves(mockUser)
      });

      const mockToken = 'mock.jwt.token';
      const jwtStub = sinon.stub(jwt, 'sign').returns(mockToken);

      await login(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('connexion réussie');
      expect(response.token).to.equal(mockToken);
      expect(response.data).to.deep.equal({
        id: '123',
        nom: 'Test User',
        email: 'test@test.com',
        role: 'user'
      });
      
      expect(jwtStub.calledOnce).to.be.true;
      expect(next.called).to.be.false;
    });
  });

  describe('getUserConnected', () => {
    it('devrait retourner une erreur 404 si utilisateur non trouvé', async () => {
      req.user = { id: '123' };
      
      sinon.stub(User, 'findById').resolves(null);

      await getUserConnected(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Utilisateur non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner les données de l\'utilisateur connecté', async () => {
      req.user = { id: '123' };
      
      const mockUser = {
        _id: '123',
        nom: 'Test User',
        email: 'test@test.com',
        role: 'user'
      };

      sinon.stub(User, 'findById').resolves(mockUser);

      await getUserConnected(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.data).to.deep.equal({
        id: '123',
        nom: 'Test User',
        email: 'test@test.com',
        role: 'user'
      });
      
      expect(next.called).to.be.false;
    });
  });

  describe('logout', () => {
    it('devrait retourner un message de succès', async () => {
      await logout(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Déconnexion réussie');
      
      expect(next.called).to.be.false;
    });
  });
});