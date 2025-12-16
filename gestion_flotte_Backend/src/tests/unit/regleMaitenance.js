import { expect } from 'chai';
import sinon from 'sinon';
import {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  calculerProchaineMaintenance
} from '../../controllers/maintenanceController.js';
import Maintenance from '../../models/Maintenance.js';
import Camion from '../../models/Camion.js';
import Remorque from '../../models/Remorque.js';
import RegleMaintenance from '../../models/regleMaintenance.js';

describe('Maintenance Controller', () => {
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

  describe('createMaintenance', () => {
    it('devrait retourner une erreur 404 si le camion n\'existe pas', async () => {
      req.body = {
        vehiculeType: 'camion',
        vehiculeId: '123',
        regleMaintenanceId: '456',
        type: 'vidange',
        dateMaintenance: '2024-01-01',
        kilometrageRealisation: 50000
      };

      sinon.stub(Camion, 'findById').resolves(null);

      await createMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Camion non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 404 si la remorque n\'existe pas', async () => {
      req.body = {
        vehiculeType: 'remorque',
        vehiculeId: '123',
        regleMaintenanceId: '456',
        type: 'contrôle',
        dateMaintenance: '2024-01-01'
      };

      sinon.stub(Remorque, 'findById').resolves(null);

      await createMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Remorque non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 404 si la règle de maintenance n\'existe pas', async () => {
      req.body = {
        vehiculeType: 'camion',
        vehiculeId: '123',
        regleMaintenanceId: '456',
        type: 'vidange'
      };

      sinon.stub(Camion, 'findById').resolves({ _id: '123', immatriculation: 'ABC-123' });
      sinon.stub(RegleMaintenance, 'findById').resolves(null);

      await createMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Règle de maintenance non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait créer une maintenance pour un camion avec succès', async () => {
      req.body = {
        vehiculeType: 'camion',
        vehiculeId: '123',
        regleMaintenanceId: '456',
        type: 'contrôle technique',
        dateMaintenance: '2024-01-01',
        kilometrageRealisation: 50000,
        cout: 200,
        description: 'Contrôle technique annuel'
      };

      const mockCamion = { _id: '123', immatriculation: 'ABC-123' };
      const mockRegle = { _id: '456', type: 'contrôle technique' };
      const mockMaintenance = {
        _id: '789',
        ...req.body,
        vehiculeModel: 'Camion'
      };

      sinon.stub(Camion, 'findById').resolves(mockCamion);
      sinon.stub(RegleMaintenance, 'findById').resolves(mockRegle);
      sinon.stub(Maintenance, 'create').resolves(mockMaintenance);

      await createMaintenance(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Maintenance créée avec succès');
      expect(response.data).to.deep.equal(mockMaintenance);
      expect(next.called).to.be.false;
    });

    it('devrait créer une vidange et mettre à jour kmDerniereVidange du camion', async () => {
      req.body = {
        vehiculeType: 'camion',
        vehiculeId: '123',
        regleMaintenanceId: '456',
        type: 'vidange',
        dateMaintenance: '2024-01-01',
        kilometrageRealisation: 50000,
        cout: 150,
        description: 'Vidange complète'
      };

      const mockCamion = { _id: '123', immatriculation: 'ABC-123' };
      const mockRegle = { _id: '456', type: 'vidange' };
      const mockMaintenance = {
        _id: '789',
        ...req.body,
        vehiculeModel: 'Camion'
      };

      sinon.stub(Camion, 'findById').resolves(mockCamion);
      sinon.stub(RegleMaintenance, 'findById').resolves(mockRegle);
      sinon.stub(Maintenance, 'create').resolves(mockMaintenance);
      const updateStub = sinon.stub(Camion, 'findByIdAndUpdate').resolves();

      await createMaintenance(req, res, next);

      // Vérifier que kmDerniereVidange a été mis à jour
      expect(updateStub.calledWith('123', { kmDerniereVidange: 50000 })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
    });

    it('devrait créer une maintenance pour une remorque sans mettre à jour kmDerniereVidange', async () => {
      req.body = {
        vehiculeType: 'remorque',
        vehiculeId: '123',
        regleMaintenanceId: '456',
        type: 'contrôle',
        dateMaintenance: '2024-01-01',
        cout: 100
      };

      const mockRemorque = { _id: '123', immatriculation: 'REM-123' };
      const mockRegle = { _id: '456', type: 'contrôle' };
      const mockMaintenance = {
        _id: '789',
        ...req.body,
        vehiculeModel: 'Remorque'
      };

      sinon.stub(Remorque, 'findById').resolves(mockRemorque);
      sinon.stub(RegleMaintenance, 'findById').resolves(mockRegle);
      sinon.stub(Maintenance, 'create').resolves(mockMaintenance);
      const updateStub = sinon.stub(Camion, 'findByIdAndUpdate');

      await createMaintenance(req, res, next);

      // Vérifier que kmDerniereVidange n'a PAS été mis à jour
      expect(updateStub.called).to.be.false;
      expect(res.status.calledWith(201)).to.be.true;
    });
  });

  describe('getAllMaintenance', () => {
    it('devrait récupérer toutes les maintenances avec populate', async () => {
      const mockMaintenances = [
        {
          _id: '1',
          type: 'vidange',
          dateMaintenance: '2024-01-01',
          regleMaintenanceId: { _id: '456', type: 'vidange' },
          vehiculeId: { _id: '123', immatriculation: 'ABC-123', marque: 'Mercedes' }
        },
        {
          _id: '2',
          type: 'contrôle technique',
          dateMaintenance: '2024-02-01',
          regleMaintenanceId: { _id: '789', type: 'contrôle technique' },
          vehiculeId: { _id: '456', immatriculation: 'DEF-456', type: 'Bâchée' }
        }
      ];

      const findStub = sinon.stub(Maintenance, 'find').returns({
        populate: sinon.stub().returnsThis(),
        sort: sinon.stub().resolves(mockMaintenances)
      });
      sinon.stub(Maintenance, 'countDocuments').resolves(2);

      await getAllMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Maintenances récupérées avec succès');
      expect(response.metaData.totalItems).to.equal(2);
      expect(response.data).to.deep.equal(mockMaintenances);
      expect(next.called).to.be.false;
    });

    it('devrait retourner un tableau vide si aucune maintenance n\'existe', async () => {
      const findStub = sinon.stub(Maintenance, 'find').returns({
        populate: sinon.stub().returnsThis(),
        sort: sinon.stub().resolves([])
      });
      sinon.stub(Maintenance, 'countDocuments').resolves(0);

      await getAllMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.data).to.be.an('array').that.is.empty;
      expect(response.metaData.totalItems).to.equal(0);
    });
  });

  describe('getMaintenanceById', () => {
    it('devrait retourner une erreur 404 si la maintenance n\'existe pas', async () => {
      req.params.id = '123';

      const findByIdStub = sinon.stub(Maintenance, 'findById').returns({
        populate: sinon.stub().returnsThis()
      });
      findByIdStub.returnsThis();
      findByIdStub.resolves(null);

      await getMaintenanceById(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Maintenance non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait récupérer une maintenance par ID avec succès', async () => {
      req.params.id = '123';

      const mockMaintenance = {
        _id: '123',
        type: 'vidange',
        dateMaintenance: '2024-01-01',
        kilometrageRealisation: 50000,
        regleMaintenanceId: {
          _id: '456',
          type: 'vidange',
          description: 'Vidange moteur',
          periodiciteKm: 10000
        },
        vehiculeId: {
          _id: '789',
          immatriculation: 'ABC-123',
          marque: 'Mercedes'
        }
      };

      const findByIdStub = sinon.stub(Maintenance, 'findById').returns({
        populate: sinon.stub().returnsThis()
      });
      findByIdStub.returnsThis();
      findByIdStub.resolves(mockMaintenance);

      await getMaintenanceById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Maintenance récupérée avec succès');
      expect(response.data).to.deep.equal(mockMaintenance);
      expect(next.called).to.be.false;
    });
  });

  describe('updateMaintenance', () => {
    it('devrait retourner une erreur 404 si la maintenance n\'existe pas', async () => {
      req.params.id = '123';
      req.body = { cout: 200 };

      sinon.stub(Maintenance, 'findById').resolves(null);

      await updateMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Maintenance non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait mettre à jour une maintenance avec succès', async () => {
      req.params.id = '123';
      req.body = {
        cout: 200,
        description: 'Maintenance complète'
      };

      const mockMaintenance = {
        _id: '123',
        type: 'contrôle technique',
        vehiculeType: 'camion',
        vehiculeId: '456',
        cout: 150
      };

      const mockUpdated = {
        ...mockMaintenance,
        cout: 200,
        description: 'Maintenance complète'
      };

      sinon.stub(Maintenance, 'findById').resolves(mockMaintenance);
      sinon.stub(Maintenance, 'findByIdAndUpdate').resolves(mockUpdated);

      await updateMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Maintenance mise à jour avec succès');
      expect(response.data).to.deep.equal(mockUpdated);
      expect(next.called).to.be.false;
    });

    it('devrait mettre à jour kmDerniereVidange si vidange camion et kilometrageRealisation modifié', async () => {
      req.params.id = '123';
      req.body = {
        kilometrageRealisation: 60000
      };

      const mockMaintenance = {
        _id: '123',
        type: 'vidange',
        vehiculeType: 'camion',
        vehiculeId: '456',
        kilometrageRealisation: 50000
      };

      const mockUpdated = {
        ...mockMaintenance,
        kilometrageRealisation: 60000
      };

      sinon.stub(Maintenance, 'findById').resolves(mockMaintenance);
      sinon.stub(Maintenance, 'findByIdAndUpdate').resolves(mockUpdated);
      const updateCamionStub = sinon.stub(Camion, 'findByIdAndUpdate').resolves();

      await updateMaintenance(req, res, next);

      // Vérifier que kmDerniereVidange a été mis à jour
      expect(updateCamionStub.calledWith('456', { kmDerniereVidange: 60000 })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
    });

    it('ne devrait pas mettre à jour kmDerniereVidange si ce n\'est pas une vidange', async () => {
      req.params.id = '123';
      req.body = {
        kilometrageRealisation: 60000
      };

      const mockMaintenance = {
        _id: '123',
        type: 'contrôle technique',
        vehiculeType: 'camion',
        vehiculeId: '456'
      };

      sinon.stub(Maintenance, 'findById').resolves(mockMaintenance);
      sinon.stub(Maintenance, 'findByIdAndUpdate').resolves(mockMaintenance);
      const updateCamionStub = sinon.stub(Camion, 'findByIdAndUpdate');

      await updateMaintenance(req, res, next);

      // Vérifier que kmDerniereVidange n'a PAS été mis à jour
      expect(updateCamionStub.called).to.be.false;
      expect(res.status.calledWith(200)).to.be.true;
    });
  });

  describe('deleteMaintenance', () => {
    it('devrait retourner une erreur 404 si la maintenance n\'existe pas', async () => {
      req.params.id = '123';

      sinon.stub(Maintenance, 'findByIdAndDelete').resolves(null);

      await deleteMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Maintenance non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait supprimer une maintenance avec succès', async () => {
      req.params.id = '123';

      const mockDeleted = {
        _id: '123',
        type: 'vidange',
        vehiculeId: '456'
      };

      sinon.stub(Maintenance, 'findByIdAndDelete').resolves(mockDeleted);

      await deleteMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Maintenance supprimée avec succès');
      expect(next.called).to.be.false;
    });
  });

  describe('calculerProchaineMaintenance', () => {
    it('devrait retourner une erreur 400 si vehiculeType manquant', async () => {
      req.params.vehiculeId = '123';
      req.query = { type: 'vidange' };

      await calculerProchaineMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Le type de véhicule (vehiculeType) est requis');
      expect(error.statusCode).to.equal(400);
    });

    it('devrait retourner une erreur 404 si le camion n\'existe pas', async () => {
      req.params.vehiculeId = '123';
      req.query = { vehiculeType: 'camion', type: 'vidange' };

      sinon.stub(Camion, 'findById').resolves(null);

      await calculerProchaineMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Camion non trouvé(e)');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 404 si la remorque n\'existe pas', async () => {
      req.params.vehiculeId = '123';
      req.query = { vehiculeType: 'remorque', type: 'contrôle' };

      sinon.stub(Remorque, 'findById').resolves(null);

      await calculerProchaineMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Remorque non trouvé(e)');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 404 si la règle n\'existe pas', async () => {
      req.params.vehiculeId = '123';
      req.query = { vehiculeType: 'camion', type: 'vidange' };

      const mockCamion = {
        _id: '123',
        immatriculation: 'ABC-123',
        kilometrageActuel: 50000
      };

      sinon.stub(Camion, 'findById').resolves(mockCamion);
      sinon.stub(RegleMaintenance, 'findOne').resolves(null);

      await calculerProchaineMaintenance(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Règle de maintenance pour le type "vidange" non trouvée');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait calculer la prochaine maintenance avec alerte nécessaire', async () => {
      req.params.vehiculeId = '123';
      req.query = { vehiculeType: 'camion', type: 'vidange' };

      const mockCamion = {
        _id: '123',
        immatriculation: 'ABC-123',
        kilometrageActuel: 49500,
        kmDerniereVidange: 40000
      };

      const mockRegle = {
        type: 'vidange',
        periodiciteKm: 10000,
        periodiciteMois: 12,
        seuilAlerteKm: 1000,
        seuilAlerteJours: 30
      };

      const mockDerniereMaintenance = {
        dateMaintenance: new Date('2024-01-01'),
        kilometrageRealisation: 40000
      };

      sinon.stub(Camion, 'findById').resolves(mockCamion);
      sinon.stub(RegleMaintenance, 'findOne').resolves(mockRegle);
      const findOneStub = sinon.stub(Maintenance, 'findOne').returns({
        sort: sinon.stub().resolves(mockDerniereMaintenance)
      });

      await calculerProchaineMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Prochaine maintenance calculée avec succès');
      expect(response.data.prochaineMaintenance.kilometrage).to.equal(50000);
      expect(response.data.prochaineMaintenance.kmRestants).to.equal(500);
      expect(response.data.alerte.necessaire).to.be.true;
      expect(response.data.alerte.raisons).to.be.an('array').that.is.not.empty;
      expect(next.called).to.be.false;
    });

    it('devrait calculer sans alerte si les seuils ne sont pas atteints', async () => {
      req.params.vehiculeId = '123';
      req.query = { vehiculeType: 'camion', type: 'vidange' };

      const mockCamion = {
        _id: '123',
        immatriculation: 'ABC-123',
        kilometrageActuel: 42000,
        kmDerniereVidange: 40000
      };

      const mockRegle = {
        type: 'vidange',
        periodiciteKm: 10000,
        periodiciteMois: 12,
        seuilAlerteKm: 1000,
        seuilAlerteJours: 30
      };

      sinon.stub(Camion, 'findById').resolves(mockCamion);
      sinon.stub(RegleMaintenance, 'findOne').resolves(mockRegle);
      const findOneStub = sinon.stub(Maintenance, 'findOne').returns({
        sort: sinon.stub().resolves(null)
      });

      await calculerProchaineMaintenance(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.data.alerte.necessaire).to.be.false;
      expect(response.data.alerte.raisons).to.be.an('array').that.is.empty;
    });
  });
});