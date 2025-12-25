/**
 * Tests for Service Master Utility
 */

import { describe, it, expect } from 'vitest';
import {
  parseServicesCSV,
  groupServicesByCategory,
  findServiceByName,
  filterServicesByCategory,
  formatServicesForPrompt
} from '../services';
import type { AWSService } from '../types';

describe('Service Master Utility', () => {
  const sampleCSV = `Category,ServiceName
分析,Amazon Athena
分析,Amazon Redshift
コンピューティング,Amazon EC2
コンピューティング,AWS Lambda
データベース,Amazon RDS`;

  const expectedServices: AWSService[] = [
    { category: '分析', serviceName: 'Amazon Athena' },
    { category: '分析', serviceName: 'Amazon Redshift' },
    { category: 'コンピューティング', serviceName: 'Amazon EC2' },
    { category: 'コンピューティング', serviceName: 'AWS Lambda' },
    { category: 'データベース', serviceName: 'Amazon RDS' }
  ];

  describe('parseServicesCSV', () => {
    it('should parse CSV text into AWSService array', () => {
      const result = parseServicesCSV(sampleCSV);
      expect(result).toEqual(expectedServices);
    });

    it('should skip empty lines', () => {
      const csvWithEmptyLines = `Category,ServiceName
分析,Amazon Athena

コンピューティング,Amazon EC2`;
      
      const result = parseServicesCSV(csvWithEmptyLines);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ category: '分析', serviceName: 'Amazon Athena' });
      expect(result[1]).toEqual({ category: 'コンピューティング', serviceName: 'Amazon EC2' });
    });

    it('should handle CSV with trailing newlines', () => {
      const csvWithTrailing = `Category,ServiceName
分析,Amazon Athena
`;
      
      const result = parseServicesCSV(csvWithTrailing);
      expect(result).toHaveLength(1);
    });
  });

  describe('groupServicesByCategory', () => {
    it('should group services by category', () => {
      const grouped = groupServicesByCategory(expectedServices);
      
      expect(grouped['分析']).toHaveLength(2);
      expect(grouped['コンピューティング']).toHaveLength(2);
      expect(grouped['データベース']).toHaveLength(1);
    });

    it('should return empty object for empty array', () => {
      const grouped = groupServicesByCategory([]);
      expect(grouped).toEqual({});
    });
  });

  describe('findServiceByName', () => {
    it('should find service by exact name', () => {
      const result = findServiceByName(expectedServices, 'AWS Lambda');
      expect(result).toEqual({ category: 'コンピューティング', serviceName: 'AWS Lambda' });
    });

    it('should return undefined for non-existent service', () => {
      const result = findServiceByName(expectedServices, 'Non-existent Service');
      expect(result).toBeUndefined();
    });
  });

  describe('filterServicesByCategory', () => {
    it('should filter services by category', () => {
      const result = filterServicesByCategory(expectedServices, '分析');
      expect(result).toHaveLength(2);
      expect(result[0].serviceName).toBe('Amazon Athena');
      expect(result[1].serviceName).toBe('Amazon Redshift');
    });

    it('should return empty array for non-existent category', () => {
      const result = filterServicesByCategory(expectedServices, 'Non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('formatServicesForPrompt', () => {
    it('should format services for Claude prompt', () => {
      const result = formatServicesForPrompt(expectedServices);
      const lines = result.split('\n');
      
      expect(lines).toHaveLength(5);
      expect(lines[0]).toBe('- 分析: Amazon Athena');
      expect(lines[1]).toBe('- 分析: Amazon Redshift');
      expect(lines[2]).toBe('- コンピューティング: Amazon EC2');
    });

    it('should return empty string for empty array', () => {
      const result = formatServicesForPrompt([]);
      expect(result).toBe('');
    });
  });
});
