import { NextRequest } from 'next/server';

jest.mock('../../../prompt', () => ({
  INITIAL_PROMPT: 'MOCKED_INITIAL_PROMPT',
}));

describe('questionnaire-prompt-builder API route', () => {
  beforeEach(() => {
    // Reset the module to clear currentPrompt state
    jest.resetModules();
  });

  describe('GET', () => {
    it('returns the initial prompt if no custom prompt is set', async () => {
      // Re-import to reset state
      const { GET } = await import('./route');
      const res = await GET();
      const json = await res.json();
      expect(json).toEqual({ prompt: 'MOCKED_INITIAL_PROMPT' });
    });

    it('returns the current prompt if a custom prompt is set', async () => {
      // Re-import to reset state
      const { POST, GET } = await import('./route');
      // Set custom prompt
      const req = makeRequest({ prompt: 'Custom prompt' });
      await POST(req);
      const res = await GET();
      const json = await res.json();
      expect(json).toEqual({ prompt: 'Custom prompt' });
    });
  });

  describe('POST', () => {
    it('successfully updates prompt with valid string input', async () => {
      const { POST } = await import('./route');
      const req = makeRequest({ prompt: 'New prompt' });
      const res = await POST(req);
      const json = await res.json();
      expect(json).toEqual({ success: true, prompt: 'New prompt' });
    });

    it('returns error for invalid prompt type (non-string)', async () => {
      const { POST } = await import('./route');
      const req = makeRequest({ prompt: 123 });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Invalid prompt' });
    });

    it('returns error for missing prompt property', async () => {
      const { POST } = await import('./route');
      const req = makeRequest({});
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Invalid prompt' });
    });

    it('handles empty string prompts', async () => {
      const { POST, GET } = await import('./route');
      const req = makeRequest({ prompt: '' });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Invalid prompt' });
      // GET should still return the initial prompt
      const getRes = await GET();
      const getJson = await getRes.json();
      expect(getJson).toEqual({ prompt: 'MOCKED_INITIAL_PROMPT' });
    });

    it('handles special characters in prompts', async () => {
      const { POST, GET } = await import('./route');
      const special = '!@#$%^&*()_+-=[]{}|;:\',.<>/?';
      const req = makeRequest({ prompt: special });
      const res = await POST(req);
      const json = await res.json();
      expect(json).toEqual({ success: true, prompt: special });
      // GET should now return special string
      const getRes = await GET();
      const getJson = await getRes.json();
      expect(getJson).toEqual({ prompt: special });
    });
  });

  describe('integration', () => {
    it('maintains prompt state between GET and POST calls', async () => {
      const { POST, GET } = await import('./route');
      // Set prompt
      const req = makeRequest({ prompt: 'Integration test prompt' });
      await POST(req);
      // GET should return the new prompt
      const res = await GET();
      const json = await res.json();
      expect(json).toEqual({ prompt: 'Integration test prompt' });
    });
  });
});

// Helper to mock NextRequest with JSON body
function makeRequest(json: any) {
  return {
    json: async () => json,
  } as unknown as NextRequest;
}
