import { expect } from 'chai';
import sinon from 'sinon';
import {
  createCamion,
  getAllCamions,
  getCamionById,
  updateCamion,
  deleteCamion
} from '../../controllers/camionController.js';
import Camion from '../../models/Camion.js';

describe('Camion Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
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

  describe('createCamion', () => {
    it('devrait retourner une erreur 400 si un camion avec la même immatriculation existe déjà', async () => {
      req.body = {
        immatriculation: 'ABC-123',
        marque: 'Mercedes',
        modele: 'Actros',
        annee: 2020,
        kilometrageActuel: 50000,
        kmDerniereVidange: 45000
      };

      const mockCamionExistant = { _id: '123', immatriculation: 'ABC-123' };
      sinon.stub(Camion, 'findOne').resolves(mockCamionExistant);

      await createCamion(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Un camion avec cette immatriculation existe déjà');
      expect(error.statusCode).to.equal(400);
    });

    it('devrait créer un camion avec succès', async () => {
      req.body = {
        immatriculation: 'ABC-123',
        marque: 'Mercedes',
        modele: 'Actros',
        annee: 2020,
        kilometrageActuel: 50000,
        kmDerniereVidange: 45000
      };

      const mockCamion = {
        _id: '123',
        ...req.body
      };

      sinon.stub(Camion, 'findOne').resolves(null);
      sinon.stub(Camion, 'create').resolves(mockCamion);

      await createCamion(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('camion créé avec succés');
      expect(response.data).to.deep.equal(mockCamion);
      expect(next.called).to.be.false;
    });
  });

  describe('getAllCamions', () => {
    it('devrait récupérer tous les camions avec succès', async () => {
      const mockCamions = [
        {
          _id: '1',
          immatriculation: 'ABC-123',
          marque: 'Mercedes',
          modele: 'Actros'
        },
        {
          _id: '2',
          immatriculation: 'DEF-456',
          marque: 'Volvo',
          modele: 'FH16'
        }
      ];

      const findStub = sinon.stub(Camion, 'find').returns({
        sort: sinon.stub().resolves(mockCamions)
      });
      sinon.stub(Camion, 'countDocuments').resolves(2);

      await getAllCamions(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Camions récupérés avec succès');
      expect(response.metaData.totalItems).to.equal(2);
      expect(response.metaData.count).to.equal(2);
      expect(response.data).to.deep.equal(mockCamions);
      expect(next.called).to.be.false;
    });

    it('devrait retourner un tableau vide si aucun camion n\'existe', async () => {
      const findStub = sinon.stub(Camion, 'find').returns({
        sort: sinon.stub().resolves([])
      });
      sinon.stub(Camion, 'countDocuments').resolves(0);

      await getAllCamions(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.data).to.be.an('array').that.is.empty;
      expect(response.metaData.totalItems).to.equal(0);
    });
  });

  describe('getCamionById', () => {
    it('devrait retourner une erreur 404 si le camion n\'existe pas', async () => {
      req.params.id = '123';

      sinon.stub(Camion, 'findById').resolves(null);

      await getCamionById(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Camion non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait récupérer un camion par son ID avec succès', async () => {
      req.params.id = '123';

      const mockCamion = {
        _id: '123',
        immatriculation: 'ABC-123',
        marque: 'Mercedes',
        modele: 'Actros'
      };

      sinon.stub(Camion, 'findById').resolves(mockCamion);

      await getCamionById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('camion récupéré avec succès');
      expect(response.data).to.deep.equal(mockCamion);
      expect(next.called).to.be.false;
    });
  });

  describe('updateCamion', () => {
    it('devrait retourner une erreur 404 si le camion n\'existe pas', async () => {
      req.params.id = '123';
      req.body = { marque: 'Scania' };

      sinon.stub(Camion, 'findByIdAndUpdate').resolves(null);

      await updateCamion(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Camion non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait mettre à jour un camion avec succès', async () => {
      req.params.id = '123';
      req.body = { 
        marque: 'Scania',
        kilometrageActuel: 60000
      };

      const mockUpdatedCamion = {
        _id: '123',
        immatriculation: 'ABC-123',
        marque: 'Scania',
        modele: 'Actros',
        kilometrageActuel: 60000
      };

      sinon.stub(Camion, 'findByIdAndUpdate').resolves(mockUpdatedCamion);

      await updateCamion(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Camion mis à jour avec succès');
      expect(response.data).to.deep.equal(mockUpdatedCamion);
      expect(next.called).to.be.false;

      // Vérifier que findByIdAndUpdate a été appelé avec les bons paramètres
      expect(Camion.findByIdAndUpdate.calledWith(
        '123',
        req.body,
        { new: true, runValidators: true }
      )).to.be.true;
    });
  });

  describe('deleteCamion', () => {
    it('devrait retourner une erreur 404 si le camion n\'existe pas', async () => {
      req.params.id = '123';

      sinon.stub(Camion, 'findByIdAndDelete').resolves(null);

      await deleteCamion(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Camion non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait supprimer un camion avec succès', async () => {
      req.params.id = '123';

      const mockDeletedCamion = {
        _id: '123',
        immatriculation: 'ABC-123',
        marque: 'Mercedes'
      };

      sinon.stub(Camion, 'findByIdAndDelete').resolves(mockDeletedCamion);

      await deleteCamion(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Camion supprimé avec succès');
      expect(next.called).to.be.false;

      // Vérifier que findByIdAndDelete a été appelé avec le bon ID
      expect(Camion.findByIdAndDelete.calledWith('123')).to.be.true;
    });
  });
});