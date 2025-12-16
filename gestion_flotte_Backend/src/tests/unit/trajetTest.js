import { expect } from 'chai';
import sinon from 'sinon';
import {
  createTrajet,
  getAllTrajets,
  getTrajetsChauffeur,
  getTrajetById,
  updateTrajetChauffeur,
  updatetrajet,
  deleteTrajet
} from '../../controllers/trajetController.js';
import Trajet from '../../models/Trajet.js';
import User from '../../models/User.js';
import Camion from '../../models/Camion.js';
import Remorque from '../../models/Remorque.js';

describe('Trajet Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
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

  describe('createTrajet', () => {
    it('devrait retourner une erreur 404 si le chauffeur n\'existe pas', async () => {
      req.body = {
        chauffeurId: '123',
        camionId: '456',
        remorqueId: '789',
        lieuDepart: 'Paris',
        lieuArrivee: 'Lyon',
        dateDepart: '2024-01-01',
        dateArrivee: '2024-01-02'
      };

      sinon.stub(User, 'findById').resolves(null);

      await createTrajet(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Chauffeur non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 404 si le camion n\'existe pas', async () => {
      req.body = {
        chauffeurId: '123',
        camionId: '456',
        remorqueId: '789',
        lieuDepart: 'Paris',
        lieuArrivee: 'Lyon'
      };

      sinon.stub(User, 'findById').resolves({ _id: '123', nom: 'Chauffeur' });
      sinon.stub(Camion, 'findById').resolves(null);

      await createTrajet(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Camion non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 404 si la remorque n\'existe pas', async () => {
      req.body = {
        chauffeurId: '123',
        camionId: '456',
        remorqueId: '789',
        lieuDepart: 'Paris',
        lieuArrivee: 'Lyon'
      };

      sinon.stub(User, 'findById').resolves({ _id: '123', nom: 'Chauffeur' });
      sinon.stub(Camion, 'findById').resolves({ _id: '456', immatriculation: 'ABC-123' });
      sinon.stub(Remorque, 'findById').resolves(null);

      await createTrajet(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Remorque non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait créer un trajet avec succès', async () => {
      req.body = {
        chauffeurId: '123',
        camionId: '456',
        remorqueId: '789',
        lieuDepart: 'Paris',
        lieuArrivee: 'Lyon',
        dateDepart: '2024-01-01',
        dateArrivee: '2024-01-02',
        remarque: 'Test'
      };

      const mockTrajet = {
        _id: 'trajet123',
        ...req.body
      };

      sinon.stub(User, 'findById').resolves({ _id: '123', nom: 'Chauffeur' });
      sinon.stub(Camion, 'findById').resolves({ _id: '456', immatriculation: 'ABC-123' });
      sinon.stub(Remorque, 'findById').resolves({ _id: '789', immatriculation: 'REM-123' });
      sinon.stub(Trajet, 'create').resolves(mockTrajet);

      await createTrajet(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('trajet créé avec succés');
      expect(response.data).to.deep.equal(mockTrajet);
      expect(next.called).to.be.false;
    });
  });

  describe('getAllTrajets', () => {
    it('devrait récupérer tous les trajets avec succès', async () => {
      const mockTrajets = [
        {
          _id: '1',
          lieuDepart: 'Paris',
          lieuArrivee: 'Lyon',
          chauffeurId: { nom: 'Jean', email: 'jean@test.com' },
          camionId: { immatriculation: 'ABC-123' },
          remorqueId: { immatriculation: 'REM-123' }
        }
      ];

      const findStub = sinon.stub(Trajet, 'find').returns({
        populate: sinon.stub().returnsThis(),
        sort: sinon.stub().resolves(mockTrajets)
      });
      sinon.stub(Trajet, 'countDocuments').resolves(1);

      await getAllTrajets(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('trajets récupérés avec succès');
      expect(response.metaData.totalItems).to.equal(1);
      expect(response.metaData.count).to.equal(1);
      expect(response.data).to.deep.equal(mockTrajets);
      expect(next.called).to.be.false;
    });
  });

  describe('getTrajetsChauffeur', () => {
    it('devrait récupérer les trajets du chauffeur connecté', async () => {
      req.user = { _id: '123' };

      const mockTrajets = [
        {
          _id: '1',
          chauffeurId: '123',
          lieuDepart: 'Paris',
          lieuArrivee: 'Lyon'
        }
      ];

      const findStub = sinon.stub(Trajet, 'find').returns({
        populate: sinon.stub().returnsThis()
      });
      findStub.returnsThis();
      findStub.resolves(mockTrajets);

      await getTrajetsChauffeur(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('les trajets du chauffeur récupérés avec succès');
      expect(response.metaData.count).to.equal(1);
      expect(response.data).to.deep.equal(mockTrajets);
      expect(next.called).to.be.false;
    });

    it('devrait récupérer les trajets d\'un chauffeur spécifique via query', async () => {
      req.query.chauffeurId = '456';
      req.user = { _id: '123' };

      const mockTrajets = [
        {
          _id: '1',
          chauffeurId: '456',
          lieuDepart: 'Paris',
          lieuArrivee: 'Lyon'
        }
      ];

      const findStub = sinon.stub(Trajet, 'find').returns({
        populate: sinon.stub().returnsThis()
      });
      findStub.returnsThis();
      findStub.resolves(mockTrajets);

      await getTrajetsChauffeur(req, res, next);

      expect(Trajet.find.calledWith({ chauffeurId: '456' })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
    });
  });

  describe('getTrajetById', () => {
    it('devrait retourner une erreur 404 si le trajet n\'existe pas', async () => {
      req.params.id = '123';
      req.user = { id: '123', role: 'admin' };

      const findByIdStub = sinon.stub(Trajet, 'findById').returns({
        populate: sinon.stub().returnsThis()
      });
      findByIdStub.returnsThis();
      findByIdStub.resolves(null);

      await getTrajetById(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Trajet non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 403 si un chauffeur essaie d\'accéder au trajet d\'un autre', async () => {
      req.params.id = '123';
      req.user = { id: '999', role: 'chauffeur' };

      const mockTrajet = {
        _id: '123',
        chauffeurId: { _id: '456' },
        lieuDepart: 'Paris'
      };

      const findByIdStub = sinon.stub(Trajet, 'findById').returns({
        populate: sinon.stub().returnsThis()
      });
      findByIdStub.returnsThis();
      findByIdStub.resolves(mockTrajet);

      await getTrajetById(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Accès refusé : vous ne pouvez consulter que vos trajets');
      expect(error.statusCode).to.equal(403);
    });

    it('devrait récupérer un trajet par ID avec succès', async () => {
      req.params.id = '123';
      req.user = { id: '456', role: 'chauffeur' };

      const mockTrajet = {
        _id: '123',
        chauffeurId: { _id: '456' },
        lieuDepart: 'Paris',
        lieuArrivee: 'Lyon'
      };

      const findByIdStub = sinon.stub(Trajet, 'findById').returns({
        populate: sinon.stub().returnsThis()
      });
      findByIdStub.returnsThis();
      findByIdStub.resolves(mockTrajet);

      await getTrajetById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Trajet récupéré avec succès');
      expect(response.data).to.deep.equal(mockTrajet);
      expect(next.called).to.be.false;
    });
  });

  describe('updateTrajetChauffeur', () => {
    it('devrait retourner une erreur 404 si le trajet n\'existe pas', async () => {
      req.params.id = '123';
      req.user = { id: '456' };

      sinon.stub(Trajet, 'findById').resolves(null);

      await updateTrajetChauffeur(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Trajet non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait retourner une erreur 403 si le trajet n\'appartient pas au chauffeur', async () => {
      req.params.id = '123';
      req.user = { id: '999' };

      const mockTrajet = {
        _id: '123',
        chauffeurId: '456'
      };

      sinon.stub(Trajet, 'findById').resolves(mockTrajet);

      await updateTrajetChauffeur(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Accès refusé : ce trajet ne vous appartient pas');
      expect(error.statusCode).to.equal(403);
    });

    it('devrait retourner une erreur 400 si kmDepart ou statut est manquant', async () => {
      req.params.id = '123';
      req.user = { id: '456' };
      req.body = { kmArrivee: 500 };

      const mockTrajet = {
        _id: '123',
        chauffeurId: '456'
      };

      sinon.stub(Trajet, 'findById').resolves(mockTrajet);

      await updateTrajetChauffeur(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Veuillez remplir tous les champs obligatoires : kmDepart, statut');
      expect(error.statusCode).to.equal(400);
    });

    it('devrait retourner une erreur 400 si statut est terminé sans kmArrivee ou volumeGasoil', async () => {
      req.params.id = '123';
      req.user = { id: '456' };
      req.body = {
        kmDepart: 100,
        statut: 'terminé'
      };

      const mockTrajet = {
        _id: '123',
        chauffeurId: '456'
      };

      sinon.stub(Trajet, 'findById').resolves(mockTrajet);

      await updateTrajetChauffeur(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('kmArrivee et volumeGasoil sont obligatoires');
      expect(error.statusCode).to.equal(400);
    });

    it('devrait mettre à jour le trajet avec succès', async () => {
      req.params.id = '123';
      req.user = { id: '456' };
      req.body = {
        kmDepart: 100,
        kmArrivee: 500,
        statut: 'terminé',
        volumeGasoil: 50,
        remarque: 'RAS'
      };

      const mockTrajet = {
        _id: '123',
        chauffeurId: '456',
        kmDepart: 0,
        kmArrivee: 0,
        statut: 'en_cours',
        volumeGasoil: 0,
        remarque: '',
        save: sinon.stub().resolves()
      };

      sinon.stub(Trajet, 'findById').resolves(mockTrajet);

      await updateTrajetChauffeur(req, res, next);

      expect(mockTrajet.kmDepart).to.equal(100);
      expect(mockTrajet.kmArrivee).to.equal(500);
      expect(mockTrajet.statut).to.equal('terminé');
      expect(mockTrajet.volumeGasoil).to.equal(50);
      expect(mockTrajet.remarque).to.equal('RAS');
      expect(mockTrajet.save.calledOnce).to.be.true;

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('trajet modifier avec succés');
      expect(next.called).to.be.false;
    });
  });

  describe('updatetrajet', () => {
    it('devrait retourner une erreur 404 si le trajet n\'existe pas', async () => {
      req.params.id = '123';
      req.body = { lieuDepart: 'Marseille' };

      sinon.stub(Trajet, 'findById').resolves(null);
      sinon.stub(Trajet, 'findByIdAndUpdate').resolves(null);

      await updatetrajet(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('trajet non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait mettre à jour un trajet avec succès', async () => {
      req.params.id = '123';
      req.body = {
        lieuDepart: 'Marseille',
        lieuArrivee: 'Nice'
      };

      const mockTrajet = { _id: '123', lieuDepart: 'Paris' };
      const mockUpdatedTrajet = {
        _id: '123',
        lieuDepart: 'Marseille',
        lieuArrivee: 'Nice'
      };

      sinon.stub(Trajet, 'findById').resolves(mockTrajet);
      sinon.stub(Trajet, 'findByIdAndUpdate').resolves(mockUpdatedTrajet);

      await updatetrajet(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('trajet mis à jour avec succès');
      expect(response.data).to.deep.equal(mockUpdatedTrajet);
      expect(next.called).to.be.false;
    });
  });

  describe('deleteTrajet', () => {
    it('devrait retourner une erreur 404 si le trajet n\'existe pas', async () => {
      req.params.id = '123';

      sinon.stub(Trajet, 'findByIdAndDelete').resolves(null);

      await deleteTrajet(req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.false;
      expect(response.message).to.equal('Trajet non trouvé');
    });

    it('devrait supprimer un trajet avec succès', async () => {
      req.params.id = '123';

      const mockDeletedTrajet = {
        _id: '123',
        lieuDepart: 'Paris',
        lieuArrivee: 'Lyon'
      };

      sinon.stub(Trajet, 'findByIdAndDelete').resolves(mockDeletedTrajet);

      await deleteTrajet(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('trajet supprimé avec succès');
      expect(next.called).to.be.false;
    });
  });
});