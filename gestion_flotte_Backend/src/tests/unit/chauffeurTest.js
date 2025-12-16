import { expect } from 'chai';
import sinon from 'sinon';
import crypto from 'crypto';
import {
  createChauffeur,
  getAllChauffeurs,
  getChauffeurById
} from '../../controllers/chauffeurController.js';
import User from '../../models/User.js';
import { sendMail } from '../../config/mail.js';

describe('Chauffeur Controller', () => {
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

  describe('createChauffeur', () => {
    it('devrait retourner une erreur 400 si un chauffeur avec cet email existe déjà', async () => {
      req.body = {
        nom: 'Jean Dupont',
        email: 'jean@test.com'
      };

      const mockChauffeurExistant = {
        _id: '123',
        email: 'jean@test.com'
      };

      sinon.stub(User, 'findOne').resolves(mockChauffeurExistant);

      await createChauffeur(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Un chauffeur avec cet email existe déjà');
      expect(error.statusCode).to.equal(400);
    });

    it('devrait créer un chauffeur, générer un mot de passe et envoyer un email', async () => {
      req.body = {
        nom: 'Jean Dupont',
        email: 'jean@test.com'
      };

      // Mock du mot de passe généré
      const mockPassword = 'abc12345';
      sinon.stub(crypto, 'randomBytes').returns({
        toString: sinon.stub().returns(mockPassword)
      });

      const mockChauffeur = {
        _id: '123',
        nom: 'Jean Dupont',
        email: 'jean@test.com',
        role: 'chauffeur'
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves(mockChauffeur);
      const sendMailStub = sinon.stub().resolves();
      
      // Mock du module sendMail
      sinon.replace(await import('../config/mail.js'), 'sendMail', sendMailStub);

      await createChauffeur(req, res, next);

      // Vérifier que User.create a été appelé avec les bons paramètres
      expect(User.create.calledOnce).to.be.true;
      const createArgs = User.create.firstCall.args[0];
      expect(createArgs.nom).to.equal('Jean Dupont');
      expect(createArgs.email).to.equal('jean@test.com');
      expect(createArgs.motDePasse).to.equal(mockPassword);
      expect(createArgs.role).to.equal('chauffeur');

      // Vérifier que sendMail a été appelé
      expect(sendMailStub.calledOnce).to.be.true;
      const mailArgs = sendMailStub.firstCall.args[0];
      expect(mailArgs.to).to.equal('jean@test.com');
      expect(mailArgs.subject).to.equal('Votre compte chauffeur');
      expect(mailArgs.text).to.include(mockPassword);
      expect(mailArgs.html).to.include(mockPassword);

      // Vérifier la réponse
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Chauffeur créé avec succès et email envoyé');
      expect(response.data).to.deep.equal(mockChauffeur);
      expect(next.called).to.be.false;
    });

    it('devrait appeler next avec une erreur si sendMail échoue', async () => {
      req.body = {
        nom: 'Jean Dupont',
        email: 'jean@test.com'
      };

      const mockPassword = 'abc12345';
      sinon.stub(crypto, 'randomBytes').returns({
        toString: sinon.stub().returns(mockPassword)
      });

      const mockChauffeur = {
        _id: '123',
        nom: 'Jean Dupont',
        email: 'jean@test.com',
        role: 'chauffeur'
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves(mockChauffeur);
      
      const mailError = new Error('Erreur d\'envoi d\'email');
      const sendMailStub = sinon.stub().rejects(mailError);
      sinon.replace(await import('../config/mail.js'), 'sendMail', sendMailStub);

      await createChauffeur(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.equal(mailError);
    });
  });

  describe('getAllChauffeurs', () => {
    it('devrait récupérer tous les chauffeurs avec succès', async () => {
      const mockChauffeurs = [
        {
          _id: '1',
          nom: 'Jean Dupont',
          email: 'jean@test.com',
          role: 'chauffeur'
        },
        {
          _id: '2',
          nom: 'Marie Martin',
          email: 'marie@test.com',
          role: 'chauffeur'
        }
      ];

      const findStub = sinon.stub(User, 'find').returns({
        select: sinon.stub().returnsThis(),
        sort: sinon.stub().resolves(mockChauffeurs)
      });
      sinon.stub(User, 'countDocuments').resolves(2);

      await getAllChauffeurs(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('chauffeurs récupérés avec succès');
      expect(response.metaData.totalItems).to.equal(2);
      expect(response.data).to.deep.equal(mockChauffeurs);
      expect(next.called).to.be.false;

      // Vérifier que select("-motDePasse") a été appelé
      const selectStub = findStub.returnValue.select;
      expect(selectStub.calledWith('-motDePasse')).to.be.true;
    });

    it('devrait retourner un tableau vide si aucun chauffeur n\'existe', async () => {
      const findStub = sinon.stub(User, 'find').returns({
        select: sinon.stub().returnsThis(),
        sort: sinon.stub().resolves([])
      });
      sinon.stub(User, 'countDocuments').resolves(0);

      await getAllChauffeurs(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.data).to.be.an('array').that.is.empty;
      expect(response.metaData.totalItems).to.equal(0);
    });
  });

  describe('getChauffeurById', () => {
    it('devrait retourner une erreur 404 si le chauffeur n\'existe pas', async () => {
      req.params.id = '123';

      const findByIdStub = sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves(null)
      });

      await getChauffeurById(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error.message).to.equal('Chauffeur non trouvé');
      expect(error.statusCode).to.equal(404);
    });

    it('devrait récupérer un chauffeur par son ID avec succès', async () => {
      req.params.id = '123';

      const mockChauffeur = {
        _id: '123',
        nom: 'Jean Dupont',
        email: 'jean@test.com',
        role: 'chauffeur'
      };

      const findByIdStub = sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves(mockChauffeur)
      });

      await getChauffeurById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal('Chauffeur récupéré avec succès');
      expect(response.data).to.deep.equal(mockChauffeur);
      expect(next.called).to.be.false;

      // Vérifier que select("-motDePasse") a été appelé
      const selectStub = findByIdStub.returnValue.select;
      expect(selectStub.calledWith('-motDePasse')).to.be.true;
    });

    it('devrait exclure le mot de passe du résultat', async () => {
      req.params.id = '123';

      const mockChauffeur = {
        _id: '123',
        nom: 'Jean Dupont',
        email: 'jean@test.com',
        role: 'chauffeur'
        // Note: pas de motDePasse car select("-motDePasse") l'exclut
      };

      const selectStub = sinon.stub().resolves(mockChauffeur);
      const findByIdStub = sinon.stub(User, 'findById').returns({
        select: selectStub
      });

      await getChauffeurById(req, res, next);

      expect(selectStub.calledWith('-motDePasse')).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.data).to.not.have.property('motDePasse');
    });
  });
});