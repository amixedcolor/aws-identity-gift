/**
 * Integration tests to verify types work with actual CSV data
 */

import { describe, it, expect } from 'vitest';
import { parseServicesCSV } from '../services';
import type { AWSService } from '../types';

describe('Integration Tests', () => {
  // Sample from actual services.csv
  const actualCSVSample = `Category,ServiceName
分析,Amazon Athena
分析,Amazon Redshift
アプリケーション統合,Amazon SQS
コンピューティング,Amazon EC2
コンピューティング,AWS Lambda
データベース,Amazon RDS
Machine Learning (ML) と人工知能 (AI),Amazon SageMaker
Machine Learning (ML) と人工知能 (AI),Amazon Bedrock`;

  it('should parse actual CSV format correctly', () => {
    const services = parseServicesCSV(actualCSVSample);
    
    expect(services).toHaveLength(8);
    
    // Verify first service
    expect(services[0]).toEqual({
      category: '分析',
      serviceName: 'Amazon Athena'
    });
    
    // Verify ML category with long name
    const mlServices = services.filter(s => s.category.includes('Machine Learning'));
    expect(mlServices).toHaveLength(2);
    expect(mlServices[0].serviceName).toBe('Amazon SageMaker');
    expect(mlServices[1].serviceName).toBe('Amazon Bedrock');
  });

  it('should handle Japanese category names', () => {
    const services = parseServicesCSV(actualCSVSample);
    
    const categories = [...new Set(services.map(s => s.category))];
    
    expect(categories).toContain('分析');
    expect(categories).toContain('アプリケーション統合');
    expect(categories).toContain('コンピューティング');
    expect(categories).toContain('データベース');
  });

  it('should maintain type safety', () => {
    const services: AWSService[] = parseServicesCSV(actualCSVSample);
    
    // TypeScript should enforce these properties exist
    services.forEach(service => {
      expect(service).toHaveProperty('category');
      expect(service).toHaveProperty('serviceName');
      expect(typeof service.category).toBe('string');
      expect(typeof service.serviceName).toBe('string');
    });
  });
});
