/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import axios from 'axios';
import { POST } from '../../src/app/api/create-payment/route';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock environment variables
const mockApiKey = 'test-api-key';
process.env.COINBASE_API_KEY = mockApiKey;

describe('/api/create-payment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates payment successfully', async () => {
    const mockResponseData = {
      data: {
        data: {
          id: 'charge-123',
          hosted_url: 'https://commerce.coinbase.com/charges/charge-123'
        }
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponseData);

    const requestBody = {
      amount: '10.00',
      currency: 'USD',
      customerId: 'customer-123',
      customerName: 'John Doe'
    };

    const request = new NextRequest('http://localhost:3000/api/create-payment', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: true,
      chargeId: 'charge-123',
      paymentUrl: 'https://commerce.coinbase.com/charges/charge-123'
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.commerce.coinbase.com/charges',
      {
        name: 'Test Payment',
        description: 'Testing crypto payments',
        pricing_type: 'fixed_price',
        local_price: { amount: '10.00', currency: 'USD' },
        metadata: { customer_id: 'customer-123', customer_name: 'John Doe' }
      },
      {
        headers: {
          'X-CC-Api-Key': mockApiKey,
          'X-CC-Version': '2018-03-22',
          'Content-Type': 'application/json'
        }
      }
    );
  });

  it('handles missing request body fields', async () => {
    const requestBody = {
      amount: '10.00',
      currency: 'USD'
      // Missing customerId and customerName
    };

    const request = new NextRequest('http://localhost:3000/api/create-payment', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          id: 'charge-456',
          hosted_url: 'https://commerce.coinbase.com/charges/charge-456'
        }
      }
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.success).toBe(true);
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        metadata: { customer_id: undefined, customer_name: undefined }
      }),
      expect.any(Object)
    );
  });

  it('handles Coinbase API error', async () => {
    const mockError = {
      response: {
        data: { error: 'Invalid API key' }
      }
    };

    mockedAxios.post.mockRejectedValueOnce(mockError);

    const requestBody = {
      amount: '5.00',
      currency: 'EUR',
      customerId: 'customer-456',
      customerName: 'Jane Smith'
    };

    const request = new NextRequest('http://localhost:3000/api/create-payment', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: 'Payment creation failed'
    });
  });

  it('handles network error', async () => {
    const mockError = new Error('Network error');
    mockedAxios.post.mockRejectedValueOnce(mockError);

    const requestBody = {
      amount: '15.00',
      currency: 'BTC',
      customerId: 'customer-789',
      customerName: 'Bob Wilson'
    };

    const request = new NextRequest('http://localhost:3000/api/create-payment', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: 'Payment creation failed'
    });
  });

  it('handles invalid JSON in request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/create-payment', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: 'Payment creation failed'
    });
  });

  it('uses correct Coinbase API headers', async () => {
    const mockResponseData = {
      data: {
        data: {
          id: 'charge-test',
          hosted_url: 'https://commerce.coinbase.com/charges/charge-test'
        }
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponseData);

    const requestBody = {
      amount: '25.50',
      currency: 'USD',
      customerId: 'test-customer',
      customerName: 'Test User'
    };

    const request = new NextRequest('http://localhost:3000/api/create-payment', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    await POST(request);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.commerce.coinbase.com/charges',
      expect.any(Object),
      {
        headers: {
          'X-CC-Api-Key': mockApiKey,
          'X-CC-Version': '2018-03-22',
          'Content-Type': 'application/json'
        }
      }
    );
  });

  it('creates correct charge data structure', async () => {
    const mockResponseData = {
      data: {
        data: {
          id: 'charge-structure-test',
          hosted_url: 'https://commerce.coinbase.com/charges/charge-structure-test'
        }
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponseData);

    const requestBody = {
      amount: '99.99',
      currency: 'EUR',
      customerId: 'premium-customer',
      customerName: 'Premium User'
    };

    const request = new NextRequest('http://localhost:3000/api/create-payment', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    await POST(request);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        name: 'Test Payment',
        description: 'Testing crypto payments',
        pricing_type: 'fixed_price',
        local_price: { amount: '99.99', currency: 'EUR' },
        metadata: { customer_id: 'premium-customer', customer_name: 'Premium User' }
      },
      expect.any(Object)
    );
  });

  it('handles different currency types', async () => {
    const currencies = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'];
    
    for (const currency of currencies) {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: {
            id: `charge-${currency.toLowerCase()}`,
            hosted_url: `https://commerce.coinbase.com/charges/charge-${currency.toLowerCase()}`
          }
        }
      });

      const requestBody = {
        amount: '100.00',
        currency,
        customerId: `customer-${currency}`,
        customerName: `${currency} User`
      };

      const request = new NextRequest('http://localhost:3000/api/create-payment', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.chargeId).toBe(`charge-${currency.toLowerCase()}`);
    }
  });

  it('handles different amount formats', async () => {
    const amounts = ['1.00', '10.50', '999.99', '0.01', '1000000.00'];
    
    for (const amount of amounts) {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: {
            id: `charge-${amount.replace('.', '-')}`,
            hosted_url: `https://commerce.coinbase.com/charges/charge-${amount.replace('.', '-')}`
          }
        }
      });

      const requestBody = {
        amount,
        currency: 'USD',
        customerId: 'amount-test-customer',
        customerName: 'Amount Test User'
      };

      const request = new NextRequest('http://localhost:3000/api/create-payment', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
    }
  });
});