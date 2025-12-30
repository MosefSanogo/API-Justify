import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { rateLimitMiddleware } from "../middlewares/rateLimit.middleware.js";
import { tokenStore } from '../storage/memory.store.js';

describe('authMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should call next() with valid token', () => {
    // Simulez un token valide dans le store
    const token = 'valid-token-123';
    require('../storage/memory.store').tokenStore.set(token, { email: 'test@example.com' });
    
    mockRequest.headers = {
      authorization: `Bearer ${token}`
    };

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 without authorization header', () => {
    mockRequest.headers = {};

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Authorization header missing' });
  });
});


// Mock du tokenStore
jest.mock('../storage/memory.store');

describe('rateLimitMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let mockTokenStore: any;

  beforeEach(() => {
    // Réinitialiser les mocks
    mockTokenStore = {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn()
    };
    (tokenStore as any) = mockTokenStore;

    // Initialiser les objets de test
    mockRequest = {
      body: ''
    };
    (mockRequest as any).token = 'test-token-123';
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    
    nextFunction = jest.fn();
    
    // Mock Date pour des tests cohérents
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Rate limiting logic', () => {
    it('should reset word count when date changes', () => {
      // Mock pour hier
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      mockTokenStore.get.mockReturnValue({
        wordUsedToday: 50000,
        lastDate: yesterdayStr
      });

      // On simule aujourd'hui
      jest.setSystemTime(new Date());
      
      const todayStr = new Date().toISOString().split('T')[0];
      
      mockRequest.body = 'Hello world';
      
      rateLimitMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // Vérifie que le compteur a été réinitialisé
      expect(mockTokenStore.get).toHaveBeenCalledWith('test-token-123');
      // Le tokenData devrait être mis à jour avec wordUsedToday = 2 et lastDate = aujourd'hui
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should allow request when under limit', () => {
      const today = new Date().toISOString().split('T')[0];
      
      mockTokenStore.get.mockReturnValue({
        wordUsedToday: 500,
        lastDate: today
      });

      mockRequest.body = 'Hello world this is a test'; // 5 mots
      
      rateLimitMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 402 when exceeding daily limit', () => {
      const today = new Date().toISOString().split('T')[0];
      
      mockTokenStore.get.mockReturnValue({
        wordUsedToday: 79995, // 5 mots avant la limite
        lastDate: today
      });

      mockRequest.body = 'one two three four five six'; // 6 mots
      
      rateLimitMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(402);
      expect(mockResponse.send).toHaveBeenCalledWith('Payment Required');
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should handle exact limit', () => {
      const today = new Date().toISOString().split('T')[0];
      
      mockTokenStore.get.mockReturnValue({
        wordUsedToday: 79995, // 5 mots restants
        lastDate: today
      });

      mockRequest.body = 'one two three four five'; // Exactement 5 mots
      
      rateLimitMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should update word count correctly', () => {
      const today = new Date().toISOString().split('T')[0];
      const mockTokenData = {
        wordUsedToday: 100,
        lastDate: today
      };
      
      mockTokenStore.get.mockReturnValue(mockTokenData);
      mockRequest.body = 'word1 word2 word3'; // 3 mots

      rateLimitMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // Vérifie que wordUsedToday a été incrémenté
      expect(mockTokenData.wordUsedToday).toBe(103);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text', () => {
      const today = new Date().toISOString().split('T')[0];
      
      mockTokenStore.get.mockReturnValue({
        wordUsedToday: 79999,
        lastDate: today
      });

      mockRequest.body = ''; // 0 mots
      
      rateLimitMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockTokenStore.get().wordUsedToday).toBe(80000); // Non modifié
    });

    it('should handle text with multiple spaces', () => {
      const today = new Date().toISOString().split('T')[0];
      
      mockTokenStore.get.mockReturnValue({
        wordUsedToday: 100,
        lastDate: today
      });

      mockRequest.body = '  Hello     world   with   spaces   '; // 4 mots
      
      rateLimitMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle text with tabs and newlines', () => {
      const today = new Date().toISOString().split('T')[0];
      
      mockTokenStore.get.mockReturnValue({
        wordUsedToday: 100,
        lastDate: today
      });

      mockRequest.body = 'Hello\nworld\twith\n\twhitespace'; // 4 mots
      
      rateLimitMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    });
});