/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import axios from 'axios';
import { GET } from '../../src/app/api/order-status/[id]/route';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock environment variables
const mockApiKey = 'test-api-key';
process.env.COINBASE_API_KEY = mockApiKey;

describe('/api/order-status/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns payment status successfully', async () => {
    const mockResponseData = {
      data: {
        data: {
          timeline: [
            { status: 'NEW' },
            { status: 'PENDING' },
            { status: 'CONFIRMED' }
          ]
        }
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponseData);

    const request = new NextRequest('http://localhost:3000/api/order-status/charge-123');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      status: 'confirmed'
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.commerce.coinbase.com/charges/charge-123',
      {
        headers: {
          'X-CC-Api-Key': mockApiKey,
          'X-CC-Version': '2018-03-22'
        }
      }
    );
  });

  it('handles missing charge ID', async () => {
    // Create request without ID in path
    const request = new NextRequest('http://localhost:3000/api/order-status/');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData).toEqual({
      status: 'missing_id'
    });

    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('handles empty charge ID', async () => {
    const request = new NextRequest('http://localhost:3000/api/order-status/');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData).toEqual({
      status: 'missing_id'
    });
  });

  it('returns latest status from timeline', async () => {
    const mockResponseData = {
      data: {
        data: {
          timeline: [
            { status: 'NEW' },
            { status: 'PENDING' },
            { status: 'CONFIRMED' },
            { status: 'COMPLETED' }
          ]
        }
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponseData);

    const request = new NextRequest('http://localhost:3000/api/order-status/charge-456');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      status: 'completed'
    });
  });

  it('handles empty timeline', async () => {
    const mockResponseData = {
      data: {
        data: {
          timeline: []
        }
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponseData);

    const request = new NextRequest('http://localhost:3000/api/order-status/charge-empty');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      status: undefined
    });
  });

  it('converts status to lowercase', async () => {
    const testCases = [
      { input: 'NEW', expected: 'new' },
      { input: 'PENDING', expected: 'pending' },
      { input: 'CONFIRMED', expected: 'confirmed' },
      { input: 'COMPLETED', expected: 'completed' },
      { input: 'CANCELLED', expected: 'cancelled' },
      { input: 'EXPIRED', expected: 'expired' }
    ];

    for (const { input, expected } of testCases) {
      const mockResponseData = {
        data: {
          data: {
            timeline: [{ status: input }]
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponseData);

      const request = new NextRequest(`http://localhost:3000/api/order-status/charge-${input.toLowerCase()}`);

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        status: expected
      });
    }
  });

  it('handles Coinbase API error with response data', async () => {
    const mockError = {
      response: {
        data: { error: 'Charge not found' }
      }
    };

    mockedAxios.get.mockRejectedValueOnce(mockError);

    const request = new NextRequest('http://localhost:3000/api/order-status/invalid-charge');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      status: 'unknown'
    });
  });

  it('handles network error', async () => {
    const mockError = new Error('Network timeout');
    mockedAxios.get.mockRejectedValueOnce(mockError);

    const request = new NextRequest('http://localhost:3000/api/order-status/charge-timeout');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      status: 'unknown'
    });
  });

  it('uses correct Coinbase API headers', async () => {
    const mockResponseData = {
      data: {
        data: {
          timeline: [{ status: 'NEW' }]
        }
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponseData);

    const request = new NextRequest('http://localhost:3000/api/order-status/charge-headers-test');

    await GET(request);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.commerce.coinbase.com/charges/charge-headers-test',
      {
        headers: {
          'X-CC-Api-Key': mockApiKey,
          'X-CC-Version': '2018-03-22'
        }
      }
    );
  });

  it('extracts charge ID from URL correctly', async () => {
    const testUrls = [
      { url: 'http://localhost:3000/api/order-status/charge-123', expectedId: 'charge-123' },
      { url: 'http://localhost:3000/api/order-status/abcd-efgh-ijkl', expectedId: 'abcd-efgh-ijkl' },
      { url: 'http://localhost:3000/api/order-status/12345', expectedId: '12345' },
      { url: 'http://localhost:3000/api/order-status/test_charge_id', expectedId: 'test_charge_id' }
    ];

    for (const { url, expectedId } of testUrls) {
      const mockResponseData = {
        data: {
          data: {
            timeline: [{ status: 'NEW' }]
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponseData);

      const request = new NextRequest(url);

      await GET(request);

      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        `https://api.commerce.coinbase.com/charges/${expectedId}`,
        expect.any(Object)
      );
    }
  });

  it('handles timeline with single status', async () => {
    const mockResponseData = {
      data: {
        data: {
          timeline: [{ status: 'PENDING' }]
        }
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponseData);

    const request = new NextRequest('http://localhost:3000/api/order-status/charge-single');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      status: 'pending'
    });
  });

  it('handles complex charge IDs with special characters', async () => {
    const complexChargeId = 'charge-123_test-456.payment';
    const mockResponseData = {
      data: {
        data: {
          timeline: [{ status: 'CONFIRMED' }]
        }
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponseData);

    const request = new NextRequest(`http://localhost:3000/api/order-status/${complexChargeId}`);

    await GET(request);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://api.commerce.coinbase.com/charges/${complexChargeId}`,
      expect.any(Object)
    );
  });

  it('handles timeline with undefined status', async () => {
    const mockResponseData = {
      data: {
        data: {
          timeline: [{ /* no status property */ }]
        }
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponseData);

    const request = new NextRequest('http://localhost:3000/api/order-status/charge-no-status');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      status: undefined
    });
  });
});