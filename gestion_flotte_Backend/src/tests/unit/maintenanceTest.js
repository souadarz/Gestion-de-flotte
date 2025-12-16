import { expect } from 'chai';
import sinon from 'sinon';
import {
  createRegleMaintenance,
  getAllRegleMaintenance,
  getRegleMaintenanceById,
  updateRegleMaintenance,
  deleteRegleMaintenance
} from '../../controllers/regleMaintenanceController.js';
import RegleMaintenance from '../../models/regleMaintenance.js';

describe('RegleMaintenance Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
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

  describe('createRegleMaintenance', () => {
    it('devrait retourner une erreur 409 si une règle pour ce type existe déjà', async () => {
      req.body = {
        type: 'vidange',
        periodiciteKm: 10000,
        periodiciteMois: 12
      };

      sinon.stub(RegleMaintenance, 'findOne').resolves({ _id: '123', type: 'vidange' });

      await createRegleMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Une règle de maintenance pour "vidange" existe déjà');
      expect(error.statusCode).to.equal(409);
    });

    it('devrait créer une règle de maintenance avec succès', async () => {
      req.body = {
        type: 'vidange',
        periodiciteKm: 10000,
        periodiciteMois: 12,
        description: 'Vidange moteur',
        seuilAlerteKm: 1000,
        seuilAlerteJours: 30
      };

      const mockRegle = {
        _id: '123',
        ...req.body
      };

      sinon.stub(RegleMaintenance, 'findOne').resolves(null);
      sinon.stub(RegleMaintenance, 'create').resolves(mockRegle);

      await createRegleMaintenance(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Règle de maintenance créée avec succès');
      expect(response.data).to.deep.equal(mockRegle);
      expect(next.called).to.be.false;
    });
  });

  describe('getAllRegleMaintenance', () => {
    it('devrait récupérer toutes les règles de maintenance', async () => {
      const mockRegles = [
        { _id: '1', type: 'vidange', periodiciteKm: 10000 },
        { _id: '2', type: 'contrôle technique', periodiciteMois: 24 }
      ];

      const findStub = sinon.stub(RegleMaintenance, 'find').returns({
        sort: sinon.stub().resolves(mockRegles)
      });
      sinon.stub(RegleMaintenance, 'countDocuments').resolves(2);

      await getAllRegleMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Regles de maintenance récupérées avec succès');
      expect(response.metaData.totalItems).to.equal(2);
      expect(response.metaData.count).to.equal(2);
      expect(response.data).to.deep.equal(mockRegles);
      expect(next.called).to.be.false;
    });

    it('devrait retourner un tableau vide si aucune règle n\'existe', async () => {
      const findStub = sinon.stub(RegleMaintenance, 'find').returns({
        sort: sinon.stub().resolves([])
      });
      sinon.stub(RegleMaintenance, 'countDocuments').resolves(0);

      await getAllRegleMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.data).to.be.an('array').that.is.empty;
      expect(response.metaData.totalItems).to.equal(0);
    });
  });

  describe('getRegleMaintenanceById', () => {
    it('devrait retourner une erreur 404 si la règle n\'existe pas', async () => {
      req.params.id = '123';

      sinon.stub(RegleMaintenance, 'findById').resolves(null);

      await getRegleMaintenanceById(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Règle de maintenance non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait récupérer une règle par ID avec succès', async () => {
      req.params.id = '123';

      const mockRegle = {
        _id: '123',
        type: 'vidange',
        periodiciteKm: 10000,
        periodiciteMois: 12,
        description: 'Vidange moteur'
      };

      sinon.stub(RegleMaintenance, 'findById').resolves(mockRegle);

      await getRegleMaintenanceById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Règle de maintenance récupérée avec succès');
      expect(response.data).to.deep.equal(mockRegle);
      expect(next.called).to.be.false;
    });
  });

  describe('updateRegleMaintenance', () => {
    it('devrait retourner une erreur 404 si la règle n\'existe pas', async () => {
      req.params.id = '123';
      req.body = { periodiciteKm: 15000 };

      sinon.stub(RegleMaintenance, 'findById').resolves(null);

      await updateRegleMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Règle de maintenance non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 409 si le nouveau type existe déjà', async () => {
      req.params.id = '123';
      req.body = { type: 'contrôle technique' };

      const mockRegleExistante = {
        _id: '123',
        type: 'vidange',
        periodiciteKm: 10000
      };

      sinon.stub(RegleMaintenance, 'findById').resolves(mockRegleExistante);
      sinon.stub(RegleMaintenance, 'findOne').resolves({ _id: '456', type: 'contrôle technique' });

      await updateRegleMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Une règle de maintenance pour "contrôle technique" existe déjà');
      expect(error.statusCode).to.equal(409);
    });

    it('devrait mettre à jour une règle avec succès', async () => {
      req.params.id = '123';
      req.body = {
        periodiciteKm: 15000,
        seuilAlerteKm: 1500,
        description: 'Vidange complète'
      };

      const mockRegleExistante = {
        _id: '123',
        type: 'vidange',
        periodiciteKm: 10000,
        periodiciteMois: 12,
        description: 'Vidange moteur',
        seuilAlerteKm: 1000,
        seuilAlerteJours: 30,
        save: sinon.stub().resolves()
      };

      sinon.stub(RegleMaintenance, 'findById').resolves(mockRegleExistante);
      sinon.stub(RegleMaintenance, 'findOne').resolves(null);

      await updateRegleMaintenance(req, res, next);

      expect(mockRegleExistante.periodiciteKm).to.equal(15000);
      expect(mockRegleExistante.seuilAlerteKm).to.equal(1500);
      expect(mockRegleExistante.description).to.equal('Vidange complète');
      expect(mockRegleExistante.save.calledOnce).to.be.true;

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Règle de maintenance mise à jour avec succès');
      expect(next.called).to.be.false;
    });

    it('ne devrait pas vérifier le type si non modifié', async () => {
      req.params.id = '123';
      req.body = { periodiciteKm: 15000 };

      const mockRegleExistante = {
        _id: '123',
        type: 'vidange',
        periodiciteKm: 10000,
        save: sinon.stub().resolves()
      };

      sinon.stub(RegleMaintenance, 'findById').resolves(mockRegleExistante);
      const findOneStub = sinon.stub(RegleMaintenance, 'findOne');

      await updateRegleMaintenance(req, res, next);

      // findOne ne devrait pas être appelé car le type n'a pas changé
      expect(findOneStub.called).to.be.false;
      expect(res.status.calledWith(200)).to.be.true;
    });
  });

  describe('deleteRegleMaintenance', () => {
    it('devrait retourner une erreur 404 si la règle n\'existe pas', async () => {
      req.params.id = '123';

      sinon.stub(RegleMaintenance, 'findByIdAndDelete').resolves(null);

      await deleteRegleMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Règle de maintenance non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait supprimer une règle avec succès', async () => {
      req.params.id = '123';

      const mockDeletedRegle = {
        _id: '123',
        type: 'vidange',
        periodiciteKm: 10000
      };

      sinon.stub(RegleMaintenance, 'findByIdAndDelete').resolves(mockDeletedRegle);

      await deleteRegleMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Règle de maintenance supprimée avec succès');
      expect(next.called).to.be.false;

      // Vérifier que findByIdAndDelete a été appelé avec le bon ID
      expect(RegleMaintenance.findByIdAndDelete.calledWith('123')).to.be.true;
    });
  });
});