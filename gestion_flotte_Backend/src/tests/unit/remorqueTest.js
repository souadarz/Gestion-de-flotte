import { expect } from 'chai';
import sinon from 'sinon';
import {
  createRemorque,
  getAllRemorques,
  getRemorqueById,
  updateRemorque,
  deleteRemorque
} from '../../controllers/remorqueController.js';
import Remorque from '../../models/Remorque.js';

describe('Remorque Controller', () => {
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

  describe('createRemorque', () => {
    it('devrait retourner une erreur 404 si une remorque avec la même immatriculation existe déjà', async () => {
      req.body = {
        immatriculation: 'REM-123',
        type: 'Bâchée',
        statut: 'disponible'
      };

      const mockRemorqueExistant = { _id: '123', immatriculation: 'REM-123' };
      sinon.stub(Remorque, 'findOne').resolves(mockRemorqueExistant);

      await createRemorque(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('un remorque avec cette immatriculation existe deja');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait créer une remorque avec succès', async () => {
      req.body = {
        immatriculation: 'REM-123',
        type: 'Bâchée',
        statut: 'disponible'
      };

      const mockRemorque = {
        _id: '123',
        ...req.body
      };

      sinon.stub(Remorque, 'findOne').resolves(null);
      sinon.stub(Remorque, 'create').resolves(mockRemorque);

      await createRemorque(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('remorque créé avec succés');
      expect(response.data).to.deep.equal(mockRemorque);
      expect(next.called).to.be.false;
    });
  });

  describe('getAllRemorques', () => {
    it('devrait récupérer toutes les remorques avec succès', async () => {
      const mockRemorques = [
        {
          _id: '1',
          immatriculation: 'REM-123',
          type: 'Bâchée',
          statut: 'disponible'
        },
        {
          _id: '2',
          immatriculation: 'REM-456',
          type: 'Frigorifique',
          statut: 'en_maintenance'
        }
      ];

      const findStub = sinon.stub(Remorque, 'find').returns({
        sort: sinon.stub().resolves(mockRemorques)
      });
      sinon.stub(Remorque, 'countDocuments').resolves(2);

      await getAllRemorques(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('remorques récupérés avec succès');
      expect(response.metaData.totalItems).to.equal(2);
      expect(response.metaData.count).to.equal(2);
      expect(response.data).to.deep.equal(mockRemorques);
      expect(next.called).to.be.false;
    });

    it('devrait retourner un tableau vide si aucune remorque n\'existe', async () => {
      const findStub = sinon.stub(Remorque, 'find').returns({
        sort: sinon.stub().resolves([])
      });
      sinon.stub(Remorque, 'countDocuments').resolves(0);

      await getAllRemorques(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.data).to.be.an('array').that.is.empty;
      expect(response.metaData.totalItems).to.equal(0);
      expect(response.metaData.count).to.equal(0);
    });
  });

  describe('getRemorqueById', () => {
    it('devrait retourner une erreur 404 si la remorque n\'existe pas', async () => {
      req.params.id = '123';

      sinon.stub(Remorque, 'findById').resolves(null);

      await getRemorqueById(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('remorque non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait récupérer une remorque par son ID avec succès', async () => {
      req.params.id = '123';

      const mockRemorque = {
        _id: '123',
        immatriculation: 'REM-123',
        type: 'Bâchée',
        statut: 'disponible'
      };

      sinon.stub(Remorque, 'findById').resolves(mockRemorque);

      await getRemorqueById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('remorque récupéré avec succès');
      expect(response.data).to.deep.equal(mockRemorque);
      expect(next.called).to.be.false;
    });
  });

  describe('updateRemorque', () => {
    it('devrait retourner une erreur 404 si la remorque n\'existe pas', async () => {
      req.params.id = '123';
      req.body = { type: 'Frigorifique' };

      sinon.stub(Remorque, 'findByIdAndUpdate').resolves(null);

      await updateRemorque(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('remorque non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait mettre à jour une remorque avec succès', async () => {
      req.params.id = '123';
      req.body = { 
        type: 'Frigorifique',
        statut: 'en_maintenance'
      };

      const mockUpdatedRemorque = {
        _id: '123',
        immatriculation: 'REM-123',
        type: 'Frigorifique',
        statut: 'en_maintenance'
      };

      sinon.stub(Remorque, 'findByIdAndUpdate').resolves(mockUpdatedRemorque);

      await updateRemorque(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('remorque mis à jour avec succès');
      expect(response.data).to.deep.equal(mockUpdatedRemorque);
      expect(next.called).to.be.false;

      // Vérifier que findByIdAndUpdate a été appelé avec les bons paramètres
      expect(Remorque.findByIdAndUpdate.calledWith(
        '123',
        req.body,
        { new: true, runValidators: true }
      )).to.be.true;
    });
  });

  describe('deleteRemorque', () => {
    it('devrait retourner une erreur 404 si la remorque n\'existe pas', async () => {
      req.params.id = '123';

      sinon.stub(Remorque, 'findByIdAndDelete').resolves(null);

      await deleteRemorque(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('remorque non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait supprimer une remorque avec succès', async () => {
      req.params.id = '123';

      const mockDeletedRemorque = {
        _id: '123',
        immatriculation: 'REM-123',
        type: 'Bâchée'
      };

      sinon.stub(Remorque, 'findByIdAndDelete').resolves(mockDeletedRemorque);

      await deleteRemorque(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('remorque supprimé avec succès');
      expect(next.called).to.be.false;

      // Vérifier que findByIdAndDelete a été appelé avec le bon ID
      expect(Remorque.findByIdAndDelete.calledWith('123')).to.be.true;
    });
  });
});